<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';
$action = $_GET['action'] ?? 'login';
if ($action === 'login') {
    $clientId = env_required('GITHUB_CLIENT_ID');
    $state = bin2hex(random_bytes(24));
    setcookie('staticstack_oauth_state', $state, cookie_options(600, true));
    $redirect = 'https://github.com/login/oauth/authorize?' . http_build_query([
        'client_id' => $clientId,
        'redirect_uri' => app_base_url() . '/oauth.php?action=callback',
        'scope' => 'read:user',
        'state' => $state,
        'allow_signup' => 'true'
    ]);
    header('Location: ' . $redirect, true, 302); exit;
}
if ($action === 'logout') {
    setcookie(session_cookie_name(), '', cookie_options(-3600));
    $front = getenv('FRONTEND_ORIGIN');
    $redirect = $front ? rtrim($front, '/') . '/community/' : app_base_url() . '/';
    header('Location: ' . $redirect, true, 302); exit;
}
if ($action !== 'callback') { http_response_code(404); exit('Not found'); }
$expectedState = $_COOKIE['staticstack_oauth_state'] ?? '';
$receivedState = $_GET['state'] ?? '';
setcookie('staticstack_oauth_state', '', cookie_options(-3600, true));
if (!$expectedState || !$receivedState || !hash_equals($expectedState, $receivedState) || isset($_GET['error'])) {
    http_response_code(400); exit('GitHub sign-in was cancelled or could not be verified. Please return to the forum and try again.');
}
$code = $_GET['code'] ?? '';
if (!$code) { http_response_code(400); exit('Missing OAuth code.'); }
$tokenData = http_json_request('https://github.com/login/oauth/access_token', 'POST', [
    'client_id' => env_required('GITHUB_CLIENT_ID'),
    'client_secret' => env_required('GITHUB_CLIENT_SECRET'),
    'code' => $code,
    'redirect_uri' => app_base_url() . '/oauth.php?action=callback',
    'state' => $receivedState
], ['Accept: application/json']);
$token = $tokenData['access_token'] ?? '';
if (!$token) { http_response_code(502); exit('GitHub did not return an access token. Check your OAuth app settings.'); }
$profile = http_json_request('https://api.github.com/user', 'GET', null, [
    'Accept: application/vnd.github+json', 'Authorization: Bearer ' . $token, 'X-GitHub-Api-Version: 2022-11-28'
]);
if (empty($profile['id']) || empty($profile['login'])) { http_response_code(502); exit('Could not read your GitHub profile.'); }
try {
    $db = db();
    $adminLogin = strtolower(trim((string)getenv('ADMIN_GITHUB_LOGIN')));
    $isAdmin = strtolower((string)$profile['login']) === $adminLogin && $adminLogin !== '';
    $stmt = $db->prepare('INSERT INTO forum_users (github_id, login, display_name, avatar_url, is_admin) VALUES (:gid, :login, :display, :avatar, :admin) ON CONFLICT (github_id) DO UPDATE SET login = EXCLUDED.login, display_name = EXCLUDED.display_name, avatar_url = EXCLUDED.avatar_url, is_admin = EXCLUDED.is_admin, updated_at = NOW() RETURNING id');
    $stmt->execute([':gid'=>(string)$profile['id'], ':login'=>$profile['login'], ':display'=>($profile['name'] ?? '') ?: $profile['login'], ':avatar'=>$profile['avatar_url'] ?? '', ':admin'=>$isAdmin ? 'true' : 'false']);
    $userId = (int)$stmt->fetchColumn();
} catch (Throwable $e) { error_log('StaticStack OAuth DB error: ' . $e->getMessage()); http_response_code(500); exit('The forum database is not ready yet. Run sql/schema.sql in the Wasmer PostgreSQL database, then try again.'); }
$session = [
    'uid' => $userId,
    'gid' => (string)$profile['id'],
    'login' => (string)$profile['login'],
    'name' => (string)(($profile['name'] ?? '') ?: $profile['login']),
    'avatar' => (string)($profile['avatar_url'] ?? ''),
    'admin' => $isAdmin,
    'exp' => time() + 60 * 60 * 24 * 14
];
setcookie(session_cookie_name(), sign_session($session), cookie_options(60 * 60 * 24 * 14));
$front = getenv('FRONTEND_ORIGIN');
$redirect = $front ? rtrim($front, '/') . '/community/?signed_in=1' : app_base_url() . '/?signed_in=1';
header('Location: ' . $redirect, true, 302); exit;

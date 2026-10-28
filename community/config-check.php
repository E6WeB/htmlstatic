<?php
header('Content-Type: application/json; charset=utf-8');
$required = ['APP_BASE_URL','GITHUB_CLIENT_ID','GITHUB_CLIENT_SECRET','SESSION_SECRET','ADMIN_GITHUB_LOGIN','DB_HOST','DB_PORT','DB_NAME','DB_USERNAME','DB_PASSWORD'];
$missing = [];
foreach ($required as $key) { if (!getenv($key)) $missing[] = $key; }
http_response_code($missing ? 503 : 200);
echo json_encode(['ok' => !$missing, 'missing' => $missing, 'message' => $missing ? 'Set the missing Wasmer environment variables.' : 'Required configuration is present.']);

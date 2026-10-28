<?php
// router.php for StaticStack on Wasmer Edge
declare(strict_types=1);

$root = __DIR__;
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$uri = rawurldecode($uri);

// Normalize path to prevent directory traversal
$path = realpath($root . $uri);
if ($path !== false && str_starts_with($path, $root)) {
    // If it's a specific static file that exists (not a directory and not a php file)
    if (is_file($path) && !str_ends_with($path, '.php')) {
        return false; // Let PHP's built-in server serve the static asset directly
    }

    // If it's a PHP script directly requested, let PHP run it
    if (is_file($path) && str_ends_with($path, '.php')) {
        return false;
    }

    // If it's a directory, check for index.html
    if (is_dir($path)) {
        $indexHtml = $path . DIRECTORY_SEPARATOR . 'index.html';
        if (is_file($indexHtml)) {
            $_SERVER['SCRIPT_FILENAME'] = $indexHtml;
            header('Content-Type: text/html; charset=utf-8');
            readfile($indexHtml);
            return true;
        }
    }
}

// Clean URLs support: e.g. /archive -> /archive.html, /tools/hosting-deployment/wasmer -> wasmer.html
$cleanHtml = realpath($root . rtrim($uri, '/') . '.html');
if ($cleanHtml !== false && str_starts_with($cleanHtml, $root) && is_file($cleanHtml)) {
    $_SERVER['SCRIPT_FILENAME'] = $cleanHtml;
    header('Content-Type: text/html; charset=utf-8');
    readfile($cleanHtml);
    return true;
}

// Directory clean url: e.g. /community -> /community/index.html
$dirIndex = realpath($root . '/' . trim($uri, '/') . '/index.html');
if ($dirIndex !== false && str_starts_with($dirIndex, $root) && is_file($dirIndex)) {
    $_SERVER['SCRIPT_FILENAME'] = $dirIndex;
    header('Content-Type: text/html; charset=utf-8');
    readfile($dirIndex);
    return true;
}

// 404 handler
http_response_code(404);
$page404 = $root . DIRECTORY_SEPARATOR . '404.html';
if (is_file($page404)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($page404);
} else {
    echo '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>';
}
return true;

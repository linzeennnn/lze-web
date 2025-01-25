<?php
// 设置 CORS 头
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// 检查请求方法，如果是 OPTIONS，则返回 204 No Content 并结束脚本执行
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

session_start();

function verifyToken($token) {
    $tokenFile = '/etc/lze-web/token'; // Token 文件路径

    if (file_exists($tokenFile)) {
        $fileContent = file_get_contents($tokenFile);
        $data = json_decode($fileContent, true);

        if ($data && isset($data['token'], $data['expiry'])) {
            $storedToken = $data['token'];
            $expiry = $data['expiry'];

            if ($token === $storedToken && time() <= $expiry) {
                return true;
            } else {
                // 删除过期的 token 文件
                if (time() > $expiry) {
                    unlink($tokenFile);
                }
            }
        }
    }
    return false;
}

function getBearerToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization']) || isset($headers['authorization'])) {
        $matches = [];
        $headerValue = isset($headers['Authorization']) ? $headers['Authorization'] : $headers['authorization'];
        if (preg_match('/Bearer (.+)/', $headerValue, $matches)) {
            return $matches[1]; // 返回 Token 部分
        }
    }
    return null; // 没有找到 Token
}

function requireAuth() {
    $token = getBearerToken();
    if (!$token || !verifyToken($token)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }
}
?>

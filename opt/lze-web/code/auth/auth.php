<?php
// auth.php
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
    if (isset($headers['Authorization'])) {
        $matches = [];
        if (preg_match('/Bearer (.+)/', $headers['Authorization'], $matches)) {
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

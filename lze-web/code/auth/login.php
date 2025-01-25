<?php
// login.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// 从文件中读取正确的密码
$passwordFile = '/etc/lze-web/password';
$correctPassword = trim(file_get_contents($passwordFile));

$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';


// 密码验证
if ($password === $correctPassword) {
    // 检查 token 文件路径
    $tokenFile = '/etc/lze-web/token';

    // 检查 token 文件是否存在
    if (file_exists($tokenFile)) {
        // 读取 token 文件内容
        $fileContent = file_get_contents($tokenFile);
        $tokenData = json_decode($fileContent, true);

        // 验证 token 是否过期
        if ($tokenData && isset($tokenData['expiry']) && $tokenData['expiry'] > time()) {
            // 返回有效 token
            echo json_encode(['success' => true, 'token' => $tokenData['token']]);
            exit;
        } else {
            // Token 文件存在但已过期
            unlink($tokenFile); // 删除过期的 token 文件
        }
    }

    // 生成新的 Token
    $token = bin2hex(random_bytes(16));
    $expiry = time() + 2592000; // 30天

    // 保存新 Token 和过期时间到文件
    $fileContent = json_encode(['token' => $token, 'expiry' => $expiry]);
    file_put_contents($tokenFile, $fileContent);

    // 返回新的 Token 给前端
    echo json_encode(['success' => true, 'token' => $token]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid password']);
}

?>

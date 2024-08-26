<?php
// login.php
header('Content-Type: application/json');

// 从文件中读取正确的密码
$passwordFile = '/etc/lze-web/password';
$correctPassword = trim(file_get_contents($passwordFile));

$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';

if ($password === $correctPassword) {
    // 生成Token
    $token = bin2hex(random_bytes(16));

    // Token过期时间
    $expiry = time() + 2592000; // 1800秒 = 30分钟

    // 保存Token和过期时间到文件
    $tokenFile = '/etc/lze-web/token';
    $fileContent = json_encode(['token' => $token, 'expiry' => $expiry]);
    file_put_contents($tokenFile, $fileContent);

    // 返回Token给前端
    echo json_encode(['success' => true, 'token' => $token]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid password']);
}
?>

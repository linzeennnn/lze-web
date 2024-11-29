<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $fileName = $_POST["fileName"];
    $filePath = "../../file/Note/{$fileName}";
    if (file_exists($filePath)) {
        unlink($filePath);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Note not found"]);
    }
} else {
    // 如果不是 POST 请求，返回错误信息
    echo "Invalid request method";
}
?>

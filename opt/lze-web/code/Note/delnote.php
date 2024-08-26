<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $fileName = $_POST["fileName"];
    $filePath = "../../file/Note/{$fileName}";

    // 判断文件是否存在，然后进行删除
    if (file_exists($filePath)) {
        unlink($filePath);
        echo "success". $fileName;
    } else {
        echo "Note not found" . $fileName;
    }
} else {
    // 如果不是 POST 请求，返回错误信息
    echo "Invalid request method";
}
?>

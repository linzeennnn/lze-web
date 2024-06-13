<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 获取要删除的文件名
    $fileName = $_POST["fileName"];

    // 拼接文件路径
    $filePath = "../../file/Bookmark/{$fileName}";

    // 判断文件是否存在，然后进行删除
    if (file_exists($filePath)) {
        unlink($filePath);
        echo "Note deleted successfully". $fileName;
    } else {
        echo "Note not found" . $fileName;
    }
} else {
    // 如果不是 POST 请求，返回错误信息
    echo "Invalid request method";
}
?>

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
echo "Note added successfully" . $newTitle . $newContent;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 获取新便签的标题和内容
    $newTitle = $_POST["newTitle"];
    $newContent = $_POST["newContent"];

    // 生成新的文件名，可以根据需要进行定制
    $fileName = generateFileName($newTitle);

    // 拼接文件路径
    $filePath = "../../file/Note/{$fileName}";

    // 将新便签写入文件
    file_put_contents($filePath, $newContent);

    echo "Note added successfully" . $newTitle . $newContent;
} else {
    // 如果不是 POST 请求，返回错误信息
    echo "Invalid request method";
}

// 生成新的文件名，使用原始标题
function generateFileName($title) {
    return "{$title}.txt";
}

?>
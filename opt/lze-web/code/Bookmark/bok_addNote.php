<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 获取新便签的标题和内容
    $newTitle = $_POST["newTitle"];
    $newContent = $_POST["newContent"];

    // 生成新的文件名，可以根据需要进行定制
    $fileName = generateFileName($newTitle);

    // 拼接文件路径
    $filePath = "../../file/Bookmark/{$fileName}";

    // 检查文件是否已存在
    if (file_exists($filePath)) {
        echo "FileExistsError";
        exit; // 结束脚本，避免写入重复文件
    }

    // 将新便签写入文件
    if (file_put_contents($filePath, $newContent) !== false) {
        echo "Note added successfully";
    } else {
        echo "Error writing to file";
    }
} else {
    // 如果不是 POST 请求，返回错误信息
    echo "Invalid request method";
}

// 生成新的文件名，使用原始标题
function generateFileName($title) {
    $baseName = "{$title}.bok";
    $filePath = "../../file/Bookmark/{$baseName}";

    // 如果文件已存在，则添加数字后缀
    $count = 1;
    while (file_exists($filePath)) {
        $filePathInfo = pathinfo($baseName);
        $baseName = "{$filePathInfo['filename']}({$count}).{$filePathInfo['extension']}";
        $filePath = "../../file/Bookmark/{$baseName}";
        $count++;
    }

    return $baseName;
}
?>

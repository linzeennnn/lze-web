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
    $filePath = "../../file/Note/{$fileName}";

    // 将新便签写入文件
    if (file_put_contents($filePath, $newContent) !== false) {
        echo json_encode([
            'filename' => $fileName,
            'filepath' => $filePath
        ]);
    } else {
        echo "Error writing to file";
    }
} else {
    // 如果不是 POST 请求，返回错误信息
    echo "Invalid request method";
}

// 生成新的文件名，使用原始标题，必要时添加数字后缀
function generateFileName($title) {
    $fileName = "{$title}.txt";
    $filePath = "../../file/Note/{$fileName}";
    $counter = 1;

    // 检查文件是否已存在
    while (file_exists($filePath)) {
        $fileName = "{$title}({$counter}).txt";
        $filePath = "../../file/Note/{$fileName}";
        $counter++;
    }

    return $fileName;
}
?>

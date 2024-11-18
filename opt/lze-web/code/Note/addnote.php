<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 获取原始 JSON 数据
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (isset($data['newTitle']) && isset($data['newContent'])) {
        $newTitle = $data['newTitle'];
        $newContent = $data['newContent'];

        // 将非断行空格替换为普通空格
        $newContent = str_replace(" ", ' ', $newContent);

        $fileName = generateFileName($newTitle);
        $filePath = "../../file/Note/{$fileName}";

        // 将新便签写入文件
        if (file_put_contents($filePath, $newContent) !== false) {
            echo json_encode([
                'filename' => $fileName,
                'filepath' => $filePath
            ]);
        } else {
            echo json_encode(["error" => "Error writing to file"]);
        }
    } else {
        echo json_encode(["error" => "Invalid input data"]);
    }
} else {
    // 如果不是 POST 请求，返回错误信息
    echo json_encode(["error" => "Invalid request method"]);
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

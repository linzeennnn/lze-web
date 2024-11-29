<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取 JSON 数据
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $fileName = $data['name'] ?? '';
    $fileContent = $data['text'] ?? ''; // 允许内容为空
    $directory = '../../file/Bookmark/';

    if ($fileName) {
        // 拼接完整的文件路径
        $fullPath = $directory . $fileName;

        // 检查文件是否存在，如果存在则添加后缀
        $originalFileName = $fullPath;
        $index = 1;

        while (file_exists($fullPath)) {
            $fullPath = $directory . pathinfo($fileName, PATHINFO_FILENAME) . "(" . $index . ")" . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
            $index++;
        }
        
        file_put_contents($fullPath, $fileContent); // 允许内容为空，因此可以写入空内容
        echo json_encode(['message' => '已添加']);
    } else {
        echo json_encode(['error' => '文件名不能为空。']);
    }
} else {
    echo json_encode(['error' => '无效请求。']);
}
?>

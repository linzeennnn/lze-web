<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取 JSON 数据
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $fileName = $data['name'] ?? '';
    $directory = '../../file/Bookmark/'; // 文件所在目录

    if ($fileName) {
        $fullPath = $directory . $fileName;
        if (file_exists($fullPath)) {
            unlink($fullPath); 
            echo json_encode(['message' => '已删除']);
        } else {
            echo json_encode(['error' => '文件不存在。']);
        }
    } else {
        echo json_encode(['error' => '文件名不能为空。']);
    }
} else {
    echo json_encode(['error' => '无效请求。']);
}
?>

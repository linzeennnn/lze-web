<?php
require '../auth/auth.php';
requireAuth();
// 接收 JSON 数据
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['folderName']) && isset($data['nowpath'])) {
    $folderName = $data['folderName'];
    $folderPath = trim($data['nowpath']); // 从 $data 中获取 nowpath
    if ($folderPath === "/") {
        $folderPath = '../../file/Documents/upload/';
    } else {
        $folderPath = '../../file/Documents/upload/' . $folderPath;
    }
    
    $finalFolderPath = $folderPath . $folderName;
    
    $counter = 0;

    // 如果文件夹存在，则添加序号
    while (file_exists($finalFolderPath)) {
        $counter++;
        $finalFolderPath = $folderPath . '/' . $folderName . "($counter)";
    }

    // 创建文件夹
    if (mkdir($finalFolderPath, 0777, true)) {
        echo "Folder created successfully: " . $finalFolderPath;
    } else {
        echo "Failed to create folder". $folderPath;
    }
} else {
    echo "Invalid input";
}
?>

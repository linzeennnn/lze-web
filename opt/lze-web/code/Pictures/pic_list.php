<?php
// 获取文件夹中的所有文件
$folder = '../../Pictures/';
$files = scandir($folder);

// 用于存储文件路径和最后修改时间的关联数组
$fileInfo = array();

// 遍历文件夹中的每个文件
foreach ($files as $file) {
    // 排除当前目录和上级目录
    if ($file != "." && $file != "..") {
        // 获取文件路径
        $filePath = $folder . $file;
        
        // 检查是否是文件
        if (is_file($filePath)) {
            // 获取文件最后修改时间
            $lastModified = filemtime($filePath);
            // 将文件路径和最后修改时间添加到关联数组中
            $fileInfo[$filePath] = $lastModified;
        }
    }
}

// 根据最后修改时间倒序排序数组
arsort($fileInfo);

// 提取排序后的文件路径
$filePaths = array_keys($fileInfo);

// 将文件路径以 JSON 格式返回
header('Content-Type: application/json');
echo json_encode($filePaths);
?>

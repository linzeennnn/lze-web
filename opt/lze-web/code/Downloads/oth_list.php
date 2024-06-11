<?php
$uploadFolder = '../../Downloads';

$files = array_diff(scandir($uploadFolder), array('.', '..'));

// 获取文件的修改时间
$fileTimes = array();
foreach ($files as $file) {
    $filePath = $uploadFolder . '/' . $file;
    if (is_file($filePath)) {
        $fileTimes[$file] = filemtime($filePath);
    }
}

// 按修改时间倒序排序
arsort($fileTimes);

// 重新构建文件数组
$sortedFiles = array_keys($fileTimes);

echo json_encode(['files' => $sortedFiles]);
?>

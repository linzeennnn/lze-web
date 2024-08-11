<?php
$folderPath = '../../file/Bookmark';
$files = scandir($folderPath);

// 移除 . 和 .. 以及其他非文件项
$noteFiles = array_filter($files, function($file) use ($folderPath) {
    return is_file($folderPath . '/' . $file);
});

// Sort files by modification time in ascending order
usort($noteFiles, function($a, $b) use ($folderPath) {
    $timeA = filemtime($folderPath . $a);
    $timeB = filemtime($folderPath . $b);
    return $timeA - $timeB;
});

echo json_encode($noteFiles);
?>

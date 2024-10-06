<?php
require '../auth/auth.php';
requireAuth();
$directory = '../../file/trash';
$metadataFile = '../../file/data/deleted_metadata.json';

function clearDirectory($directory) {
    if (!is_dir($directory)) {
        return;
    }

    $files = scandir($directory);
    if ($files === false) {
        return; // 如果无法扫描目录，直接返回
    }

    $files = array_diff($files, ['.', '..']);
    foreach ($files as $file) {
        $filePath = "$directory/$file";
        if (is_dir($filePath)) {
            clearDirectory($filePath); // 递归清空子目录
            rmdir($filePath); // 删除空子目录
        } else {
            unlink($filePath); // 删除文件
        }
    }
}

// 清空目录内容
clearDirectory($directory);

// 将 metadata 文件内容覆盖为 null
file_put_contents($metadataFile, 'null');

echo json_encode(['status' => 'success', 'message' => 'Directory contents cleared and metadata updated.']);

?>
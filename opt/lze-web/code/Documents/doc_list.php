<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();

$baseFolder = '../../file/Documents/upload';
$currentFolder = isset($_GET['folder']) ? $_GET['folder'] : '';
$uploadFolder = $baseFolder . '/' . $currentFolder;

// 获取所有文件和文件夹
$items = array_diff(scandir($uploadFolder), array('.', '..'));

$files = [];
$folders = [];

// 分别处理文件和文件夹
foreach ($items as $item) {
    $itemPath = $uploadFolder . '/' . $item;
    if (is_file($itemPath)) {
        $files[$item] = filemtime($itemPath); // 文件的修改时间
    } elseif (is_dir($itemPath)) {
        $folders[$item] = filemtime($itemPath); // 文件夹的修改时间
    }
}

// 按修改时间倒序排序
arsort($files);
arsort($folders);

// 重新构建文件和文件夹数组
$sortedFiles = array_keys($files);
$sortedFolders = array_keys($folders);

// 获取上级目录
$parentFolder = dirname($currentFolder);
if ($parentFolder == '.') {
    $parentFolder = '';
}

echo json_encode([
    'files' => $sortedFiles, 
    'folders' => $sortedFolders,
    'currentFolder' => $currentFolder,
    'parentFolder' => $parentFolder
]);
?>

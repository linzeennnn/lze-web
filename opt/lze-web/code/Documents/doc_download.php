<?php
ini_set('memory_limit', '512M'); // 临时增加内存限制
function getname($path) {
    $path = rtrim($path, '/'); // 去掉末尾的斜杠
    $lastSlashPos = strrpos($path, '/'); // 找到最后一个斜杠的位置

    if ($lastSlashPos !== false) {
        return substr($path, $lastSlashPos + 1); // 获取最后一个斜杠后面的部分
    } else {
        return $path; // 如果没有斜杠，说明整个路径就是文件夹名
    }
}

$file = $_GET['file'] ?? '';
$folder = $_GET['folder'] ?? '';
$filePath = realpath(__DIR__ . '/../../file/Documents/upload/' . ($folder ? $folder . '/' : '') . $file);

if (!file_exists($filePath) || !is_file($filePath)) {
    http_response_code(404);
    echo 'File not found.';
    exit;
}

// 设置响应头以下载文件
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . getname($filePath) . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($filePath));

// 使用流式读取文件以减少内存使用
$chunkSize = 8192; // 8KB
$handle = fopen($filePath, 'rb');
if ($handle !== false) {
    while (!feof($handle)) {
        echo fread($handle, $chunkSize);
        flush();
    }
    fclose($handle);
}
exit;
?>

<?php
ini_set('memory_limit', '512M'); // 临时增加内存限制

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
header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
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

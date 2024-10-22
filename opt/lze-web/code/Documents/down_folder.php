<?php
if (isset($_GET['file'])) {
    $zipFilePath =realpath(__DIR__ . '/../../file/temp/' . $_GET['file']);

    // 确保文件存在
    if (file_exists($zipFilePath)) {
        // 设置适当的头部信息
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $_GET['file'] . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($zipFilePath));

      // 使用流式读取文件以减少内存使用
$chunkSize = 8192; // 8KB
$handle = fopen($zipFilePath, 'rb');
if ($handle !== false) {
    while (!feof($handle)) {
        echo fread($handle, $chunkSize);
        flush();
    }
    fclose($handle);
}

        // 删除文件
        unlink($zipFilePath); // 在输出文件之后删除 ZIP 文件
        exit;
    } else {
        http_response_code(404);
        echo json_encode(['error' => '文件未找到']);
    }
}
?>
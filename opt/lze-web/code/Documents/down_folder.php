<?php
if (isset($_POST['folderPath']) && isset($_POST['zipFileName'])) {
    // 定义基础文件夹路径和临时目录
    $baseFolderPath = '../../file/Documents/upload';
    $tempDir = '../../file/temp/'; // 定义临时目录
    $folderPath = $baseFolderPath . $_POST['folderPath'];
    $zipFileName = $_POST['zipFileName'];

    // 检查临时目录是否存在，不存在则创建
    if (!is_dir($tempDir)) {
        mkdir($tempDir, 0777, true); // 创建临时目录
    }

    // 检查文件夹是否存在
    if (!is_dir($folderPath)) {
        echo '文件夹不存在';
        exit;
    }

    $zipFilePath = $tempDir . $zipFileName; // 指定 ZIP 文件的路径

    // 使用 zip 命令压缩文件夹
    $command = "zip -r " . escapeshellarg($zipFilePath) . " " . escapeshellarg($folderPath);
    exec($command, $output, $return_var);

    // 检查压缩命令是否成功
    if ($return_var !== 0) {
        echo '无法创建 ZIP 文件';
        exit;
    }

    // 设置下载头
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . basename($zipFileName) . '"');
    header('Content-Length: ' . filesize($zipFilePath));
    readfile($zipFilePath); // 读取并输出 ZIP 文件

    unlink($zipFilePath); // 删除临时 ZIP 文件
    exit;
}
?>

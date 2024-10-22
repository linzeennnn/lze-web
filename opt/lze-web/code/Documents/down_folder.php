<?php
if (isset($_POST['folderPath']) && isset($_POST['zipFileName'])) {
    // 定义基础文件夹路径和临时目录
    $baseFolderPath = '../../file/Documents/upload';
    $tempDir = '../../file/temp/';
    $folderPath = $baseFolderPath . $_POST['folderPath'];
    $zipFileName = $_POST['zipFileName'];
    $zipFilePath = $tempDir . $zipFileName;

    // 检查临时目录是否存在，不存在则创建
    if (!is_dir($tempDir)) {
        mkdir($tempDir, 0777, true);
    }

    // 检查文件夹是否存在
    if (!is_dir($folderPath)) {
        http_response_code(404);
        echo json_encode(['error' => '文件夹不存在']);
        exit;
    }

    // 使用 zip 命令压缩文件夹
    $command = "zip -r " . escapeshellarg($zipFilePath) . " " . escapeshellarg($folderPath);
    exec($command, $output, $return_var);

    // 检查压缩命令是否成功
    if ($return_var !== 0) {
        http_response_code(500);
        echo json_encode(['error' => '无法创建 ZIP 文件']);
        exit;
    }

    // 确保文件存在
    if (file_exists($zipFilePath)) {
        // 设置适当的头部信息
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $zipFileName . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($zipFilePath));

        // 清空输出缓冲区
        ob_clean();
        flush();

        // 打开文件并输出
        $handle = fopen($zipFilePath, 'rb');
        if ($handle) {
            while (!feof($handle)) {
                echo fread($handle, 8192);
                flush();
            }
            fclose($handle);
        }

        // 删除文件
        unlink($zipFilePath);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(['error' => '文件未找到']);
    }
}
?>

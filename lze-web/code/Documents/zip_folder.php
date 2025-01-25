<?php
if (isset($_POST['folderPath']) && isset($_POST['foldername'])) {
    // 定义基础文件夹路径和临时目录
    $baseFolderPath = '../../file/Documents';
    $tempDir = '../../file/temp/';
    $foldername = $_POST['foldername'];
    $folderpath = $_POST['folderPath'];
    $fullPath = $baseFolderPath.$folderpath.$foldername;
    $zipFileName = $foldername.".zip";
    $zipFilePath = $tempDir . $zipFileName;

    // 检查临时目录是否存在，不存在则创建
    if (!is_dir($tempDir)) {
        mkdir($tempDir, 0777, true);
    }

    // 检查文件夹是否存在
    if (!is_dir($fullPath)&&!is_link($fullPath)) {
        http_response_code(404);
        echo json_encode(['error' => '文件夹不存在']);
        exit;
    }
    if(is_dir($fullPath)&&!is_link($fullPath)){
    exec("cp -r ".$fullPath." ".$tempDir);
    exec("cd ".$tempDir." && zip -r -y ".$zipFileName." ".$foldername);
    exec("cd ".$tempDir." && rm -rf ".$foldername);
    }
    else {
        echo json_encode(['error' => '此文件夹不允许下载']);
        exit;
    }
    // 确保文件存在
    if (file_exists($zipFilePath)) {
        // 直接返回下载链接
        echo json_encode(['url' => '/code/Documents/down_folder.php?file=' . urlencode($zipFileName)]);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(['error' => '文件未找到']);
    }
}
?>
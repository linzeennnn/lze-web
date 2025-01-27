<?php
$tmpdir = '../../file/temp/';
$uploadDir = '../../file/temp/';


if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}


if (isset($_FILES['file'])) {
    $relativePath = $_POST['relativePath'];
    $start = $_POST['start'];
    $total = $_POST['total'];
    $filename = $_FILES['file']['name'];


    // 处理路径
    $pathParts = explode('/', $relativePath);
    $baseFolderName = $pathParts[0];
    $newRelativePath = implode('/', $pathParts);
    $destinationDir = rtrim($uploadDir, '/') . '/' . $newRelativePath;


    // 创建保存目录
    $pathInfo = pathinfo($destinationDir);
    if (!is_dir($pathInfo['dirname'])) {
        mkdir($pathInfo['dirname'], 0777, true);
    }


    // 临时块文件路径
    $chunkFile = $destinationDir . ".part";
    $tmpName = $_FILES['file']['tmp_name'];


    // 追加写入块文件
    $fp = fopen($chunkFile, $start == 0 ? 'w' : 'a');
    if ($fp === false) {
        echo "无法打开文件进行写入: $chunkFile\n";
        exit;
    }


    $chunkData = file_get_contents($tmpName);
    fwrite($fp, $chunkData);
    fclose($fp);


    // 检查是否所有分片上传完成
    if (filesize($chunkFile) >= $total) {
        // 合并完成后，重命名为最终文件名
        rename($chunkFile, $destinationDir);
        echo "文件合并完成: $filename\n";
    } else {
        echo "成功上传块: " . $start . "\n";
    }
} else {
    echo "没有文件上传";
}
?>


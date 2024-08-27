<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if (empty($_FILES) || !isset($_POST['fileName']) || !isset($_POST['currentChunk']) || !isset($_POST['totalChunks'])) {
    exit('Invalid request');
}

$uploadDirectory = '../../file/Pictures/';
$fileName = $_POST['fileName'];
$currentChunk = (int)$_POST['currentChunk'];
$totalChunks = (int)$_POST['totalChunks'];
$tempFilePath = $uploadDirectory . $fileName . '.part';

if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 0777, true);
}

// 将当前块的数据追加到临时文件
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $tmp_name = $_FILES['file']['tmp_name'];
    $out = fopen($tempFilePath, $currentChunk === 0 ? 'wb' : 'ab');
    $in = fopen($tmp_name, 'rb');
    while ($buff = fread($in, 4096)) {
        fwrite($out, $buff);
    }
    fclose($in);
    fclose($out);

    // 如果这是最后一个块，合并完成的文件
    if ($currentChunk === $totalChunks - 1) {
        $finalFilePath = $uploadDirectory . $fileName;

        // 如果文件已经存在，添加序号
        $fileInfo = pathinfo($finalFilePath);
        $baseName = $fileInfo['filename'];
        $extension = isset($fileInfo['extension']) ? '.' . $fileInfo['extension'] : '';

        $counter = 1;
        while (file_exists($finalFilePath)) {
            $finalFilePath = $uploadDirectory . $baseName . '_' . $counter . $extension;
            $counter++;
        }

        rename($tempFilePath, $finalFilePath);
        echo $finalFilePath;
    }
} else {
    exit('fail');
}
?>

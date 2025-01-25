<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();

if (empty($_FILES) || !isset($_POST['fileName']) || !isset($_POST['currentChunk']) || !isset($_POST['totalChunks']) || !isset($_POST['nowpath'])) {
    exit('Invalid request');
}
$nowpath = trim($_POST['nowpath']);
if ($nowpath === "/") {
    $uploadDirectory = '../../file/Documents/';
} else {
    $uploadDirectory = '../../file/Documents/' . $nowpath;
}
if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 0755, true);
}
$fileName = $_POST['fileName'];
$currentChunk = (int)$_POST['currentChunk'];
$totalChunks = (int)$_POST['totalChunks'];
$tempFilePath = $uploadDirectory . $fileName . '.part';
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $tmp_name = $_FILES['file']['tmp_name'];
    $out = fopen($tempFilePath, $currentChunk === 0 ? 'wb' : 'ab');
    $in = fopen($tmp_name, 'rb');

    while ($buff = fread($in, 4096)) {
        fwrite($out, $buff);
    }
    fclose($in);
    fclose($out);
    if ($currentChunk === $totalChunks - 1) {
        $finalFilePath = $uploadDirectory . '/' . $fileName;
        $fileInfo = pathinfo($finalFilePath);
        $baseName = $fileInfo['filename'];
        $extension = isset($fileInfo['extension']) ? '.' . $fileInfo['extension'] : '';
        $counter = 1;
        while (file_exists($finalFilePath)) {
            $finalFilePath = $uploadDirectory . '/' . $baseName . '_' . $counter . $extension;
            $counter++;
        }
        rename($tempFilePath, $finalFilePath);
        echo json_encode(['status' => 'success', 'filePath' => $finalFilePath]);
    }
} else {
    exit('fail');
}
?>

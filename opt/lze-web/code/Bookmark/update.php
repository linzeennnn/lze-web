<?php
header('Content-Type: application/json');

$fileName = json_decode(file_get_contents('php://input'), true); // 直接接收文件名

if ($fileName) {
    $filePath = '../../file/Bookmark/' . $fileName;
    touch($filePath);
}
?>

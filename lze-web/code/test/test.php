<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadDir = '../../file/Documents/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    foreach ($_FILES['files']['tmp_name'] as $key => $tmpName) {
        $fileName = $_FILES['files']['name'][$key];
        $destination = $uploadDir . basename($fileName);

        if (move_uploaded_file($tmpName, $destination)) {
            echo "文件 {$fileName} 上传成功。\n";
        } else {
            echo "文件 {$fileName} 上传失败。\n";
        }
    }
} else {
    echo "无效的请求。";
}
?>

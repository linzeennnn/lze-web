<?php
$tmpdir='../../file/temp/';
$uploadDir = '../../file/temp/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}
if (isset($_FILES['file'])) {
    $relativePath = $_POST['relativePath'];
    $pathParts = explode('/', $relativePath);
    $baseFolderName = $pathParts[0];
    $i = 1;
    $pathParts[0] = $baseFolderName;
    $newRelativePath = implode('/', $pathParts);
    $destination = rtrim($uploadDir, '/') . '/' . $newRelativePath;
    $pathInfo = pathinfo($destination);
    if (!is_dir($pathInfo['dirname'])) {
        mkdir($pathInfo['dirname'], 0777, true);
    }
    $tmpName = $_FILES['file']['tmp_name'];
    if (move_uploaded_file($tmpName, $destination)) {
        echo "成功上传块: " . $baseFolderName . "\n";
    } else {
        echo "上传失败: $newRelativePath\n";
    }
    if (isset($_FILES['other_files'])) {
        foreach ($_FILES['other_files']['tmp_name'] as $key => $otherTmpName) {
            $otherRelativePath = $_POST['other_files_relative_path'][$key];
            $otherDestination = rtrim($uploadDir, '/') . '/' . $newRelativePath; // 使用相同的目录
            // 移动其他块文件
            if (move_uploaded_file($otherTmpName, $otherDestination)) {
                // 只输出一次成功的消息
                if ($key == 0) {
                    echo "成功上传块: ". "\n";
                }
            } else {
                echo "上传失败: " . $otherRelativePath . "\n";
            }
        }
    }
} else {
    echo "没有文件上传";
}
?>


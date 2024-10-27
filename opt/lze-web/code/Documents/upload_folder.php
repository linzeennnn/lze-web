<?php
session_start(); // 开启会话
$nowpath = $_POST['nowpath'];
$rename = $_POST['1st'];
$folderName = isset($_POST['folderName']) ? $_POST['folderName'] : '';
$uploadDir = ($nowpath === "/") ? '../../file/Documents/upload/' : '../../file/Documents/upload/' . $nowpath;

// 检查并创建基础上传目录
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true); // 如果目录不存在则创建
}

if (isset($_FILES['file'])) {
    $relativePath = $_POST['relativePath'];
    $pathParts = explode('/', $relativePath);
    $baseFolderName = $pathParts[0];
    $i = 1;

    if ($rename) {
        while (is_dir($uploadDir . '/' . $baseFolderName)) {
            $baseFolderName = $pathParts[0] . "($i)";
            $i++;
        }
        $_SESSION['newFolderName'] = $baseFolderName; // 将文件夹名存储在会话中
    } else {
        $baseFolderName = isset($_SESSION['newFolderName']) ? $_SESSION['newFolderName'] : $baseFolderName;
    }

    // 更新第一个块的文件夹名
    $pathParts[0] = $baseFolderName;
    $newRelativePath = implode('/', $pathParts);
    $destination = rtrim($uploadDir, '/') . '/' . $newRelativePath;

    // 创建目录结构
    $pathInfo = pathinfo($destination);
    if (!is_dir($pathInfo['dirname'])) {
        mkdir($pathInfo['dirname'], 0777, true);
    }

    // 移动文件
    $tmpName = $_FILES['file']['tmp_name'];
    if (move_uploaded_file($tmpName, $destination)) {
        echo "成功上传块: " . $baseFolderName . "\n";
    } else {
        echo "上传失败: $newRelativePath\n";
    }

    // 处理其他块文件，使用相同的目录
    if (isset($_FILES['other_files'])) {
        foreach ($_FILES['other_files']['tmp_name'] as $key => $otherTmpName) {
            $otherRelativePath = $_POST['other_files_relative_path'][$key];
            $otherDestination = rtrim($uploadDir, '/') . '/' . $newRelativePath; // 使用相同的目录

            // 移动其他块文件
            if (move_uploaded_file($otherTmpName, $otherDestination)) {
                // 只输出一次成功的消息
                if ($key == 0) {
                    echo "成功上传块: " . $_SESSION['newFolderName'] . "\n";
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

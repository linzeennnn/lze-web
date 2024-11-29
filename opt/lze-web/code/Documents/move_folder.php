<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取 JSON 数据
 $name=$_POST['name'];
 $path=$_POST['path'];
    if ($path === "/") {
        $dest = '../../file/Documents/upload/';
    } else {
        $dest = '../../file/Documents/upload/' . $path;
    }
    $results = [];
        $source = '../../file/temp/' . $name;
       if (file_exists($source)) {
            $destinationPath = getUniqueName($dest . $name,$name);
            if (rename($source, $destinationPath)) {
                echo "已上传: $name";
            } else {
                echo "上传失败";
            }
        } else {
            $results[] = "源文件或文件夹不存在: $path";
        }
    }
function getUniqueName($path,$basename) {
    $info = pathinfo($path);
    $dirname = $info['dirname'];
    $extension = isset($info['extension']) ? '.' . $info['extension'] : '';
    // 保持完整的basename
    $filename = $basename;
    $counter = 1;
    while (file_exists($path)) {
        // 生成新的路径
        $path = $dirname . '/' . $filename . "($counter)" . $extension;
        $counter++;
    }
    return $path;
}
// 递归复制文件夹的函数
function copyDirectory($source, $dest) {
    if (!is_dir($source)) {
        return false;
    }
    if (!is_dir($dest)) {
        mkdir($dest, 0777, true);
    }
    $files = scandir($source);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }
        $srcFile = $source . '/' . $file;
        $destFile = $dest . '/' . $file;
        if (is_dir($srcFile)) {
            copyDirectory($srcFile, $destFile);
        } else {
            rename($srcFile, $destFile);
        }
    }
    return true;
}
?>




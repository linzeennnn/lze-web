<?php
require '../auth/auth.php';
requireAuth();


function getname($path) {
    $path = rtrim($path, '/'); // 去掉末尾的斜杠
    $lastSlashPos = strrpos($path, '/'); // 找到最后一个斜杠的位置

    if ($lastSlashPos !== false) {
        return substr($path, $lastSlashPos + 1); // 获取最后一个斜杠后面的部分
    } else {
        return $path; // 如果没有斜杠，说明整个路径就是文件夹名
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取 JSON 数据
    $data = file_get_contents("php://input");
    $decodedData = json_decode($data, true); // 转换为 PHP 数组

    $dellist = json_decode($decodedData['dellist'], true); // 获取 dellist

    // 设置目标路径
    $dest = '../../file/trash/';
    $results = [];
    $metadataFile = '../../file/data/deleted_metadata.json';
    
    // 读取已存在的元数据
    $metadata = file_exists($metadataFile) ? json_decode(file_get_contents($metadataFile), true) : [];

    foreach ($dellist as $path) {
        $source = '../../file/Documents/' . $path; // 源路径

        // 检查源路径是文件夹还是文件
        if (is_dir($source)) {
            // 移动文件夹
            $destDir = getUniqueName($dest . getname($path), getname($path));
            if (rename($source, $destDir)) {
                $results[] = "成功移动文件夹: $destDir";
                $metadata[getname($destDir)] = $source; // 记录原始路径
            } else {
                $results[] = "移动文件夹失败: $path";
            }
        } elseif (file_exists($source)) {
            // 移动文件
            $fileName = getname($path); // 获取文件名
            $destinationPath = getUniqueName($dest . $fileName, $fileName);
            if (rename($source, $destinationPath)) {
                $results[] = "成功移动文件: $destinationPath";
                $metadata[$fileName] = $source; // 记录原始路径
            } else {
                $results[] = "移动文件失败: $fileName";
            }
        } else {
            $results[] = "源文件或文件夹不存在: $path";
        }
    }

    // 保存合并后的元数据到JSON文件
    file_put_contents($metadataFile, json_encode($metadata));

    // 返回结果
    echo json_encode($results);
}

// 获取唯一名称的函数
function getUniqueName($path, $basename) {
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

    // 创建目标目录
    if (!is_dir($dest)) {
        mkdir($dest, 0777, true);
    }

    // 遍历源目录中的所有文件和文件夹
    $files = scandir($source);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue; // 跳过当前和上级目录
        }

        $srcFile = $source . '/' . $file; // 源文件路径
        $destFile = $dest . '/' . $file; // 目标文件路径

        // 如果是文件夹，递归移动
        if (is_dir($srcFile)) {
            copyDirectory($srcFile, $destFile);
        } else {
            rename($srcFile, $destFile); // 移动文件
        }
    }
    return true;
}
?>

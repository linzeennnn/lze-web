<?php
require '../auth/auth.php';
requireAuth();

function getname($path) {
    return basename(rtrim($path, '/')); // 获取文件或目录名
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取 JSON 数据
    $data = file_get_contents("php://input");
    $decodedData = json_decode($data, true); // 转换为 PHP 数组

    $recoverlist = json_decode($decodedData['recoverlist'], true); // 获取恢复列表

    // 设置目标路径
    $dest = '../../Documents/upload/';
    $results = [];

    // 读取元数据
    $metadataFile = '../../file/trash/deleted_metadata.json';
    $metadata = json_decode(file_get_contents($metadataFile), true);

    foreach ($recoverlist as $path) {
        $trashPath = '../../file/trash/' . $path; // 回收站中的路径
        $originalPath = $metadata[$trashPath] ?? null; // 获取原始路径

        if ($originalPath && file_exists($trashPath)) {
            // 检查源路径是文件夹还是文件
            if (is_dir($trashPath)) {
                // 移动文件夹
                $destDir = getUniqueName($dest . getname($originalPath), getname($originalPath));
                if (rename($trashPath, $destDir)) {
                    $results[] = "成功恢复文件夹: $destDir";
                    unset($metadata[$trashPath]); // 删除对应的 JSON 条目
                } else {
                    $results[] = "恢复文件夹失败: $path";
                }
            } elseif (file_exists($trashPath)) {
                // 移动文件
                $fileName = getname($originalPath); // 获取文件名
                $destinationPath = getUniqueName($dest . $fileName, $fileName);
                if (rename($trashPath, $destinationPath)) {
                    $results[] = "成功恢复文件: $destinationPath";
                    unset($metadata[$trashPath]); // 删除对应的 JSON 条目
                } else {
                    $results[] = "恢复文件失败: $fileName";
                }
            }
        } else {
            $results[] = "文件不存在于回收站: $path";
        }
    }

    // 保存更新后的元数据
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

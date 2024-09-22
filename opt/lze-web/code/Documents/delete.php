<?php
require '../auth/auth.php';
requireAuth();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取 JSON 数据
    $data = file_get_contents("php://input");
    $decodedData = json_decode($data, true); // 转换为 PHP 数组

    $dellist = json_decode($decodedData['dellist'], true); 
    $results = [];
    
    foreach ($dellist as $path) {
        $source = '../../file/Documents/upload/' . $path; // 源路径

        // 检查源路径是文件夹还是文件
        if (is_dir($source)) {
            // 删除文件夹
            if (deleteDirectory($source)) {
                $results[] = "成功删除文件夹: $path";
            } else {
                $results[] = "删除文件夹失败: $path";
            }
        } elseif (file_exists($source)) {
            // 删除文件
            if (unlink($source)) {
                $results[] = "成功删除文件: $path";
            } else {
                $results[] = "删除文件失败: $path";
            }
        } else {
            $results[] = "源文件或文件夹不存在: $path";
        }
    }

    // 返回结果
    echo json_encode($results);
}

// 递归删除文件夹的函数
function deleteDirectory($dir) {
    if (!is_dir($dir)) {
        return false;
    }

    // 遍历目录中的所有文件和文件夹
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue; // 跳过当前和上级目录
        }

        $filePath = $dir . '/' . $file; // 完整路径

        // 如果是文件夹，递归删除
        if (is_dir($filePath)) {
            deleteDirectory($filePath);
        } else {
            unlink($filePath); // 删除文件
        }
    }

    // 删除空目录
    return rmdir($dir);
}
?>

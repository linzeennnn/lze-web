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

    // 假设 $decodedData 直接是 pathsMap
    $pathsMap = $decodedData;

    // 设置源路径和目标路径的基础目录
    $sourceBase = '../../file/trash/';
    $destBase = '../../file/Documents/';
    
    $results = [];
    $metadataFile = '../../file/data/deleted_metadata.json';
    
    // 读取已存在的元数据
    $metadata = file_exists($metadataFile) ? json_decode(file_get_contents($metadataFile), true) : [];
    
    foreach ($pathsMap as $selectedpath => $recoverpath) {
        // 拼接完整的源路径和目的路径
        $source = $sourceBase . $selectedpath;
        $destPath = $destBase . $recoverpath;
       // 检查 selectedpath 是否在 metadata 中存在
       $fileName = getname($selectedpath);
           unset($metadata[$fileName]); // 删除对应的键
        
         
        // 检查源路径是文件夹还是文件
        if (is_dir($source)) {
            // 移动文件夹
            $destDir = getUniqueName($destPath, getname($source));
            if (rename($source, $destDir)) {
                $results[] = "成功移动文件夹: $destDir";
            } else {
                $results[] = "移动文件夹失败: $source";
            }
        } elseif (file_exists($source)) {
            // 移动文件
            $fileName = getname($source); // 获取文件名
            
            $destinationPath = getUniqueName($destPath, $fileName);
            if (rename($source, $destinationPath)) {
                $results[] = "成功移动文件: $destinationPath";
            } else {
                $results[] = "移动文件失败: $fileName";
            }
        } else {
            $results[] = "源文件或文件夹不存在: $source";
        }
    }

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
?>

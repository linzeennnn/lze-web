<?php
require '../auth/auth.php';
requireAuth();
$data = json_decode(file_get_contents('php://input'), true);

// 拼接基础路径
$baseDir = '../../file/Documents/';
$oldpath = $baseDir . $data['oldpath'];
$newpath = $baseDir . $data['newpath'];

// 尝试重命名文件或文件夹
if (rename($oldpath, $newpath)) {
    echo "已重命名";
} else {
    echo "重命名失败";
}
?>

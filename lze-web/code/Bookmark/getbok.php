<?php
$directory = '../../file/Bookmark/'; // 替换为你的目录路径
$files = scandir($directory, SCANDIR_SORT_NONE); // 获取目录下的文件
$fileData = [];
foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        $filePath = $directory . '/' . $file;
        if (is_file($filePath)) {
            // 获取文件内容
            $content = file_get_contents($filePath);
            $fileData[] = [
                'name' => $file,
                'content' => $content
            ];
        }
    }
}
// 按文件名排序（如果需要，按其他标准排序也可以）
usort($fileData, function($a, $b) {
    return $a['name'] <=> $b['name']; // 按文件名升序排序
});
// 发送 JSON 数据给 JavaScript
header('Content-Type: application/json');
echo json_encode($fileData);
?>

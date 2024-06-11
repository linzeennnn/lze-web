<?php
$uploadFolder = '../../Documents/';

if (!file_exists($uploadFolder)) {
  mkdir($uploadFolder, 0777, true);
}

$targetFile = $uploadFolder . basename($_FILES['file']['name']);

if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
  $status = 'success';
  $message = '文件上传成功！';
} else {
  $status = 'error';
  $message = '文件上传失败！ 错误信息：' . $_FILES['file']['error'];
}

// 输出弹窗的JavaScript代码
echo '<script>';
echo 'alert("' . $message . '");';
echo 'window.location.href = "doc.html";'; // 跳转回doc.html
echo '</script>';
?>

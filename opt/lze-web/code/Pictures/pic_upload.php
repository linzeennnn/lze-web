<?php
$uploadFolder = '../../Pictures/';

if (!file_exists($uploadFolder)) {
  mkdir($uploadFolder, 0777, true);
}

$originalFileName = $_FILES['file']['name'];
$targetFile = $uploadFolder . basename($originalFileName);

// 处理文件名冲突
if (file_exists($targetFile)) {
  $fileInfo = pathinfo($originalFileName);
  $fileName = $fileInfo['filename'];
  $fileExtension = $fileInfo['extension'];
  
  $counter = 1;
  $newFileName = $fileName . '_' . $counter . '.' . $fileExtension;
  
  while (file_exists($uploadFolder . $newFileName)) {
    $counter++;
    $newFileName = $fileName . '_' . $counter . '.' . $fileExtension;
  }
  
  $targetFile = $uploadFolder . $newFileName;
}

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
echo 'window.location.href = "pic.html";'; 
echo '</script>';
?>
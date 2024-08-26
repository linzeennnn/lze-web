<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if (empty($_FILES)) {
  exit('no file');
}

$uploadDirectory = '../../file/Bookmark/';

foreach ($_FILES['pic']['name'] as $key => $name) {
  if ($_FILES['pic']['error'][$key] === UPLOAD_ERR_OK) {
    $tmp_name = $_FILES['pic']['tmp_name'][$key];
    $filePath = $uploadDirectory . $name;
    
    // 如果文件已经存在，添加序号
    $fileInfo = pathinfo($filePath);
    $baseName = $fileInfo['filename'];
    $extension = isset($fileInfo['extension']) ? '.' . $fileInfo['extension'] : '';
    
    $counter = 1;
    while (file_exists($filePath)) {
      $filePath = $uploadDirectory . $baseName . '_' . $counter . $extension;
      $counter++;
    }
    
    move_uploaded_file($tmp_name, $filePath);
  } else {
    exit('fail');
  }
}
?>

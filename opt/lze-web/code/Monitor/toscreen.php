<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if (empty($_FILES)) {
  exit('no file');
}
putenv('DISPLAY=:0');
putenv('DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus');
putenv('XDG_RUNTIME_DIR=/run/user/1000');
putenv('XAUTHORITY=/run/user/1000/gdm/Xauthority');
$uploadDirectory = '../../file/Monitor/';

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
echo "done";
shell_exec("xdg-open $filePath");
    shell_exec("notify-send -t 500 $baseName");
?>


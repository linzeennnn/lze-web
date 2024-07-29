<?php
if (empty($_FILES)) {
  exit('no file');
}

$uploadDirectory = '../../file/Pictures/';

foreach ($_FILES['pic']['name'] as $key => $name) {
  if ($_FILES['pic']['error'][$key] === UPLOAD_ERR_OK) {
    $tmp_name = $_FILES['pic']['tmp_name'][$key];
    move_uploaded_file($tmp_name, $uploadDirectory . $name);
  } else {
    exit('fail');
  }
}
?>

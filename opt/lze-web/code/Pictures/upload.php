
<?php
if(empty($_FILES)){
  exit('no file');
}
if($_FILES['pic']['error'] !== 0){
  exit('fail');
}
move_uploaded_file($_FILES['pic']['tmp_name'],'../../file/Pictures/'.$_FILES['pic']['name']);
?>
<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_POST['data'] ?? '没有数据';
    shell_exec("rm -f ../../file/Monitor/*");
}
?>

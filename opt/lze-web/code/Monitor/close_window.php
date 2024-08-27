<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if (isset($_POST['windowid'])) {
    $windowid = escapeshellarg($_POST['windowid']);
    $output = shell_exec("DISPLAY=:0 wmctrl -i -c $windowid");
    echo $output;
} else {
    echo "No windowid received";
}
?>

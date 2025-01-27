<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];
    $fileName = $_POST['fileName'];
    $finalFilePath = $_POST['finalFilePath'];
    putenv('DISPLAY=:0');
    putenv('DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus');
    putenv('XDG_RUNTIME_DIR=/run/user/1000');
    putenv('XAUTHORITY=/run/user/1000/gdm/Xauthority');
    shell_exec("lze-notify $title \"$content$fileName\" \"$finalFilePath\" > /dev/null & ");
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>

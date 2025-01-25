<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    putenv('DISPLAY=:0');
    putenv('DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus');
    // 根据不同的操作执行不同的逻辑
    switch ($action) {
        case 'status':
            mediastatus();
            break;
        
        case 'title':
            mediatitle();
            break;
        case 'play':
            shell_exec('DISPLAY=:0 playerctl play');
            break;
        case 'pause':
            $output = shell_exec('DISPLAY=:0 playerctl pause');
            echo $output;
             break;
        case 'speed':
            shell_exec('DISPLAY=:0 playerctl position 10+');
            break;    
       case 'slow':
        shell_exec('DISPLAY=:0 playerctl position 10-');
           break;            
        default:
            echo "$action Invalid Operation";
            break;
    }
}

function mediastatus(){
$output = shell_exec('DISPLAY=:0 /usr/bin/playerctl status 2>&1');
echo $output;
}
function mediatitle(){
$output = shell_exec('DISPLAY=:0 playerctl metadata --format "{{ title }}"');
echo $output;
}
?>

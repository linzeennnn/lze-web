<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
 putenv('DISPLAY=:0');
 putenv('DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus');
 putenv('XDG_RUNTIME_DIR=/run/user/1000');
 putenv('XAUTHORITY=/run/user/1000/gdm/Xauthority');
// 执行命令并将输出存储到变量中
$output = shell_exec("DISPLAY=:0 wmctrl -l | awk '{print $1, substr($0, index($0,$4))}' 2>&1");

// 将输出按行拆分成数组
$lines = explode("\n", trim($output));

$data = array();

foreach ($lines as $line) {
    // 匹配十六进制和文本部分
    if (preg_match('/^(0x[0-9a-fA-F]+)\s+(.*)$/', $line, $matches)) {
        $windowid = $matches[1];
        $text = $matches[2];
        $data[] = array('windowid' => $windowid, 'text' => $text);
    }
}

// 设置响应头为JSON格式
header('Content-Type: application/json');
echo json_encode($data);
?>

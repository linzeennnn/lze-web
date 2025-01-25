<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();

$output = shell_exec("top -b -n 1 | awk 'NR>7 && \$12 !~ /[kK]ernel/ && \$12 !~ /irq/ && \$12 !~ /kworker/ {print \$1, \$12}' | sort | uniq 2>&1");

// 将输出按行拆分成数组
$lines = explode("\n", trim($output));

$data = array();
$seen = array(); // 用于跟踪已添加的进程名

foreach ($lines as $line) {
    // 匹配进程ID和进程名称部分
    if (preg_match('/^(\d+)\s+(.*)$/', $line, $matches)) {
        $windowid = $matches[1];  // 进程ID
        $text = trim($matches[2]); // 进程名称

        // 提取公共部分作为唯一标识
        $baseName = preg_replace('/\/\d+$/', '', $text);

        // 检查进程名是否已经存在
        if (!empty($baseName) && !isset($seen[$baseName])) {
            $data[] = array('windowid' => $windowid, 'text' => $baseName);
            $seen[$baseName] = true; // 记录已添加的进程名
        }
    }
}
header('Content-Type: application/json');
echo json_encode($data);
?>

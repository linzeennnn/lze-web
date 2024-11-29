<?php
header('Content-Type: application/json');

// 获取 CPU 使用率
$cpuUsagePercent = shell_exec("top -b -n1 | grep 'Cpu(s)' | awk '{print $2 + $4}'");
$cpuUsagePercent = trim($cpuUsagePercent);

// 获取内存信息
$memoryInfo = shell_exec("free -m");
preg_match_all('/\d+/', $memoryInfo, $memoryArray);
$totalMemory = $memoryArray[0][0]; // 总内存
$usedMemory = $memoryArray[0][1]; // 已使用内存

// 获取硬盘信息
$diskInfo = shell_exec("df /");
$diskLines = explode("\n", $diskInfo);
$diskArray = preg_split('/\s+/', trim($diskLines[1])); // 解析第二行数据

$totalDisk = $diskArray[1];
$usedDisk = $diskArray[2]; 

// 获取默认网卡名称
$defaultInterface = trim(shell_exec("ip route | awk '/default/ {print $5}'"));

// 获取网络流量信息
$networkInfo = file_get_contents('/proc/net/dev');
$lines = explode("\n", $networkInfo);
$rxBytes = 0;
$txBytes = 0;

foreach ($lines as $line) {
    if (strpos($line, $defaultInterface) !== false) {
        $parts = preg_split('/\s+/', trim($line));
        $rxBytes = floatval($parts[1]); // 接收流量（字节）
        $txBytes = floatval($parts[9]); // 发送流量（字节）
        break;
    }
}

// 转换为 MB
$rxMB = round($rxBytes / (1024 * 1024), 2);
$txMB = round($txBytes / (1024 * 1024), 2);

$response = [
    'cpuUsage' => round(floatval($cpuUsagePercent), 2),
    'totalMemory' => $totalMemory,
    'usedMemory' => $usedMemory,
    'totalDisk' => $totalDisk, // 确保没有单位
    'usedDisk' => $usedDisk, // 确保没有单位
    'networkRx' => $rxMB, // 接收流量（MB）
    'networkTx' => $txMB  // 发送流量（MB）
];

echo json_encode($response);
?>

<?php
$postData = file_get_contents('php://input');
$data = [];
if ($postData == 'all') {
    handleFiles('doc');  
    handleFiles('not');  
    handleFiles('bok');  
    handleFiles('pic');  
    handleFiles('tra'); 
    handleFiles('mon'); 
    handleFiles('disk'); 
    send();
} else {
    handleFiles($postData); 
    send();
}

function handleFiles($type) {
    global $data;
    $file = [];
    $uploadFolder = '';

    switch ($type) {
        case 'doc':
            $uploadFolder = '../../file/Documents/upload/';
            $keyPrefix = 'doc';
            $numFiles = 3;
            break;
        case 'not':
            $uploadFolder = '../../file/Note/';
            $keyPrefix = 'not';
            $numFiles = 3;
            break;
        case 'bok':
            $uploadFolder = '../../file/Bookmark/';
            $keyPrefix = 'bok';
            $numFiles = 1;
            break;
        case 'pic':
            $uploadFolder = '../../file/Pictures/';
            $keyPrefix = 'pic';
            $numFiles = 1;
            break;
        case 'tra':
            $uploadFolder = '../../file/trash/';
            $keyPrefix = 'tra';
            $numFiles = 1;
            break;
        case 'mon':
            $output = shell_exec("top -b -n 1 | awk 'NR>7 && \$12 !~ /[kK]ernel/ && \$12 !~ /irq/ && \$12 !~ /kworker/ {print \$12}' | sort | uniq 2>&1");
            $processes = explode("\n", trim($output));
            $topFiles = array_slice($processes, 0, 3);
            for ($i = 0; $i < count($topFiles); $i++) {
                $data["mon" . ($i + 1)] = isset($topFiles[$i]) ? $topFiles[$i] : null;
            }
            return; // 不需要继续执行下面的代码
        case 'disk':
            $diskInfo = shell_exec("df /");
            $diskLines = explode("\n", $diskInfo);
            $diskArray = preg_split('/\s+/', trim($diskLines[1])); // 解析第二行数据
            $data['total'] = $diskArray[1];
            $data['used']  = $diskArray[2];
            return; // 不需要继续执行下面的代码
        default:
            return; // 如果类型不匹配，则直接返回
    }

    $files = array_diff(scandir($uploadFolder), ['.', '..']);
    foreach ($files as $item) {
        $itemPath = $uploadFolder . $item;
        $file[$item] = filemtime($itemPath);
    }

    arsort($file);
    $topFiles = array_slice($file, 0, $numFiles, true); // 保留键名

    for ($i = 0; $i < $numFiles; $i++) {
        $key = $keyPrefix . ($i + 1);
        if ($type === 'not' || $type === 'bok') {
            $data[$key] = isset($topFiles[array_keys($topFiles)[$i]]) ? pathinfo(array_keys($topFiles)[$i], PATHINFO_FILENAME) : null; // 去除后缀名
        } else {
            $filename = isset($topFiles[array_keys($topFiles)[$i]]) ? array_keys($topFiles)[$i] : null;
            // 检查是否为文件夹
            if (is_dir($uploadFolder . $filename)) {
                $data[$key] = $filename . '/'; // 添加斜杠
            } else {
                $data[$key] = $filename; // 保留完整文件名
            }
        }
    }
}

function send() {
    global $data;
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>

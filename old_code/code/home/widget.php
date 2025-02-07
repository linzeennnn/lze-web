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
            $uploadFolder = '../../file/Documents/';
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
            return;
        case 'disk':
            $diskInfo = shell_exec("df /");
            $diskLines = explode("\n", $diskInfo);
            $diskArray = preg_split('/\s+/', trim($diskLines[1])); 
            $data['total'] = $diskArray[1];
            $data['used'] = $diskArray[2];
            return;
        default:
            return;
    }

    $files = array_diff(scandir($uploadFolder), ['.', '..']);
    foreach ($files as $item) {
        $itemPath = $uploadFolder . $item;
        // 如果是目录，在名称后添加 '/'
        $displayName = is_dir($itemPath) ? $item . '/' : $item;

        if ($type === 'pic' && !is_file($itemPath)) {
            continue; // 对于 pic 类型，跳过文件夹
        }
        $file[$displayName] = filemtime($itemPath);
    }

    arsort($file);
    $topFiles = array_slice($file, 0, $numFiles, true);

    for ($i = 0; $i < $numFiles; $i++) {
        $key = $keyPrefix . ($i + 1);
        $filename = isset($topFiles[array_keys($topFiles)[$i]]) ? array_keys($topFiles)[$i] : null;
        $data[$key] = $filename;
    }
}

function send() {
    global $data;
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>

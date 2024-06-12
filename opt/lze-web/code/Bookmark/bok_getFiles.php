<?php
$folderPath = '../../file/Bookmark';
$files = scandir($folderPath);

// Filter out non-txt files
$noteFiles = array_filter($files, function($file) {
    return pathinfo($file, PATHINFO_EXTENSION) === 'txt';
});

// Sort files by modification time in ascending order
usort($noteFiles, function($a, $b) use ($folderPath) {
    $timeA = filemtime($folderPath . $a);
    $timeB = filemtime($folderPath . $b);
    return $timeA - $timeB;
});

echo json_encode($noteFiles);
?>

<?php
header('Content-Type: application/json');
require '../auth/auth.php';
requireAuth();
$folderPath = '../../file/Note/';
$files = scandir($folderPath);

// Filter out non-txt files
$noteFiles = array_filter($files, function($file) {
    return pathinfo($file, PATHINFO_EXTENSION) === 'txt';
});

// Sort files by modification time in descending order
usort($noteFiles, function($a, $b) use ($folderPath) {
    $timeA = filemtime($folderPath . $a);
    $timeB = filemtime($folderPath . $b);
    return $timeB - $timeA;
});

echo json_encode($noteFiles);
?>

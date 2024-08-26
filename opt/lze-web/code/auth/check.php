<?php
header('Content-Type: application/json');
require 'auth.php';
requireAuth();
echo json_encode(['success' => true, 'message' => 'You have access to this resource.']);
?>

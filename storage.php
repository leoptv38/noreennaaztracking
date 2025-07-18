<?php
// Create the storage file
$ipFile = "ip_storage.txt";

// Create the file with header
$content = "IP Storage File\n";
$content .= "Created on: " . date('Y-m-d H:i:s') . "\n";
$content .= "==========================\n";

if (file_put_contents($ipFile, $content)) {
    // Set permissions
    chmod($ipFile, 0666);
    echo "Storage file created successfully!";
} else {
    echo "Error creating storage file: " . error_get_last()['message'];
}
?>
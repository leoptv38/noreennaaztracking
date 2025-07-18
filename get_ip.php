<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Our IP storage file
$ipFile = "ip_storage.txt";

// Get the IP address
$ip = $_POST['ip'] ?? '';

// Only save if IP is not empty
if (!empty($ip)) {
    // Check if IP already exists in the file
    $duplicateFound = false;
    
    if (file_exists($ipFile)) {
        $fileContent = file_get_contents($ipFile);
        $pattern = "/\b" . preg_quote($ip, '/') . "\b/";
        
        if (preg_match($pattern, $fileContent)) {
            $duplicateFound = true;
        }
    }
    
    if ($duplicateFound) {
        echo "DUPLICATE: This IP address already exists in our system";
        exit;
    }
    
    // Create log entry with date/time
    $logEntry = date('Y-m-d H:i:s') . " | IP: $ip\n";
    
    $saved = false;
    
    // Try different saving methods
    if (@file_put_contents($ipFile, $logEntry, FILE_APPEND)) {
        $saved = true;
    } else {
        // Try creating the file if it doesn't exist
        if (!file_exists($ipFile)) {
            @file_put_contents($ipFile, "");
            @chmod($ipFile, 0666);
        }
        
        // Try saving again
        if (@file_put_contents($ipFile, $logEntry, FILE_APPEND)) {
            $saved = true;
        }
    }
    
    // Send response
    if ($saved) {
        echo "IP saved successfully!";
    } else {
        echo "IP tracking succeeded but saving failed.";
    }
    exit;
}

echo "No IP to save";
?>
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$baseDir = __DIR__;
$configFile = $baseDir . '/config.json';

// Helper for recursive delete
function deleteDir($dirPath) {
    if (!is_dir($dirPath)) return;
    $files = array_diff(scandir($dirPath), array('.', '..'));
    foreach ($files as $file) {
        (is_dir("$dirPath/$file")) ? deleteDir("$dirPath/$file") : unlink("$dirPath/$file");
    }
    rmdir($dirPath);
}

// Config endpoints
if (isset($_GET['config'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (file_exists($configFile)) {
            echo file_get_contents($configFile);
        } else {
            echo json_encode(['startDate' => '', 'endDate' => '']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        file_put_contents($configFile, json_encode($input));
        echo json_encode(['success' => true]);
    }
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $posts = [];
    $dirs = array_filter(glob($baseDir . '/*'), 'is_dir');
    foreach ($dirs as $dir) {
        $jsonFile = $dir . '/data.json';
        if (file_exists($jsonFile)) {
            $data = json_decode(file_get_contents($jsonFile), true);
            if ($data) $posts[] = $data;
        }
    }
    // Sort by ID
    usort($posts, function($a, $b) {
        return $a['id'] <=> $b['id'];
    });
    echo json_encode($posts);
    exit();
}

if ($method === 'PUT') {
    // This is used by incrementClick (pure JSON update)
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $jsonFile = $baseDir . '/' . $id . '/data.json';
        if (file_exists($jsonFile)) {
            $data = json_decode(file_get_contents($jsonFile), true);
            $data = array_merge($data, $input);
            file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode($data);
            exit();
        }
    }
    http_response_code(404);
    echo json_encode(['error' => 'Post not found']);
    exit();
}

if ($method === 'POST') {
    // Used for Create and Edit (FormData)
    $isUpdate = isset($_POST['id']) && !empty($_POST['id']);
    
    if ($isUpdate) {
        $id = (int)$_POST['id'];
    } else {
        // Find max ID
        $maxId = 0;
        $dirs = array_filter(glob($baseDir . '/*'), 'is_dir');
        foreach ($dirs as $dir) {
            $folderName = basename($dir);
            if (is_numeric($folderName) && (int)$folderName > $maxId) {
                $maxId = (int)$folderName;
            }
        }
        $id = $maxId + 1;
    }
    
    $postDir = $baseDir . '/' . $id;
    if (!is_dir($postDir)) {
        mkdir($postDir, 0777, true);
    }
    
    // Load existing data if update
    $data = ['id' => $id, 'clicks' => 0];
    $jsonFile = $postDir . '/data.json';
    if ($isUpdate && file_exists($jsonFile)) {
        $data = json_decode(file_get_contents($jsonFile), true);
    }
    
    // Update fields from POST
    if (isset($_POST['title'])) $data['title'] = $_POST['title'];
    if (isset($_POST['postDate'])) $data['postDate'] = $_POST['postDate'];
    if (isset($_POST['postLink'])) $data['postLink'] = $_POST['postLink'];
    if (isset($_POST['icon'])) $data['icon'] = $_POST['icon'];
    
    // Handle File Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['image']['tmp_name'];
        $name = basename($_FILES['image']['name']);
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        // secure extension
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
            $dest = $postDir . '/image.' . $ext;
            // remove old images
            $oldImages = glob("$postDir/image.*");
            if ($oldImages) {
                foreach($oldImages as $oldImg) {
                    unlink($oldImg);
                }
            }
            
            if (move_uploaded_file($tmpName, $dest)) {
                $data['postImage'] = 'posts/' . $id . '/image.' . $ext;
            }
        }
    } elseif (isset($_POST['removeImage']) && $_POST['removeImage'] == '1') {
        // Option to remove image without replacing
        $oldImages = glob("$postDir/image.*");
        if ($oldImages) {
            foreach($oldImages as $oldImg) {
                unlink($oldImg);
            }
        }
        $data['postImage'] = '';
    }
    
    file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode($data);
    exit();
}

if ($method === 'DELETE') {
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $postDir = $baseDir . '/' . $id;
        if (is_dir($postDir)) {
            deleteDir($postDir);
            echo json_encode(['success' => true]);
            exit();
        }
    }
    http_response_code(404);
    echo json_encode(['error' => 'Post not found']);
    exit();
}

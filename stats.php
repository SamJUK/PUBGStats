<?php
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/


// Check if we have a username to check for
if (!isset($_GET['u']))
    die("{'error': 1, 'message': 'No user declared'}");

// Check if we have got stats for this user in the past hour
$data = file_get_contents('cache/users.json');
$user = strtolower($_GET['u']);

$decodedData = json_decode($data);
$return;

if (isset($decodedData->$user) && (time() - $decodedData->$user->lastUpdated) <= 3600 )
{
    $return = json_encode($decodedData->$user->stats);
}else{
    $return = getUserFromAPI($user);
};


function getUserFromAPI ($usr) {
    $useragent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36';
    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => 'TRN-Api-Key: '.file_get_contents('pubg.credential'),
            'user_agent' => $useragent
        ]
    ];
    $url = "https://pubgtracker.com/api/profile/pc/" . $usr;
    $context = stream_context_create($opts);

    $json = file_get_contents($url, false, $context);
    $decodedData->$usr->stats = json_decode($json);
    $decodedData->$usr->lastUpdated = time();

    $my_file = 'cache/users.json';
    $handle = fopen($my_file, 'w');
    if ($handle != false)
    {
        $data = json_encode($decodedData);
        fwrite($handle, $data);
        fclose($handle);
    };

    return $json;
};

echo $return;
?>
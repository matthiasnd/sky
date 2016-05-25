<?php

// create redis object
$redis = new Redis();

// connect
$redis->connect('127.0.0.1', 6379);

// get parameter
if(!empty($_GET['loc'])) {
    $loc = "q=".urlencode(stripslashes(str_replace('&', '', $_GET['loc'])));
}
else {
    // whatsmyip
    $ip = (empty($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['REMOTE_ADDR'] : $_SERVER['HTTP_X_FORWARDED_FOR'];

    // try to get ip location
    $loc = $redis->get('IP:' . $ip);

    if(!$loc) {

        // build url
        $url = "http://ip-api.com/json/" . $ip;

        // try to get that
        $json = file_get_contents($url);

        // parse json
        $data = json_decode($json, true);
        
        // this not empty or bye
        if(empty($data))
            throw new Exception("IP API returned nothing, lol.");

        // get zip
        $loc = "lon=" . $data['lon'] . "&lat=" . $data['lat'];

        // save to redis
        $redis->setEx('IP:' . $ip, 86400, $loc);    
    }
}
    
// try to get weather
$jw = $redis->get('WEATHER:'.$loc);

if(!$jw) {
    
    // load config with $weatherapikey
    require_once('config.php');
    
    // build url
    $url = "http://api.openweathermap.org/data/2.5/weather?".$loc."&APPID=".$weatherapikey;
    
    // try to get weather
    $jw = file_get_contents($url);
    
    // fatalonator
    if(empty($jw))
        throw new Exception("Weather API returned nothing, rofl.");
    
    // save to redis
    $redis->setEx('WEATHER:'.$loc, 3600, $jw);
}

// echo weather
echo $jw;







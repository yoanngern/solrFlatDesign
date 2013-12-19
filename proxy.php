<?php

$url = $_GET['url'];

header('content-type: text/xml');

echo file_get_contents($url);
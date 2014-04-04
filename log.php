<?php

$file = "/tmp/log.txt";
file_put_contents($file, file_get_contents('php://input')."\n", FILE_APPEND);



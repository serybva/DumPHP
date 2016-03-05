<?php

    $socket = fsockopen('localhost', 4242);
    var_dump($socket);
    $run = true;
    $structuredData = array();
    $i = 0;
    while ($i < 949) {
        $structuredData[] = $i;
        $i++;
    }
    $structuredData[] = "-&é=àç:;*ù$";
    $JSON = json_encode($structuredData);
    echo strlen($JSON);
    $i = 0;
    while ($i < strlen($JSON)) {
        $stdin = array(STDIN);
        $null = null;
        fwrite($socket, $JSON[$i]);
        $i++;
        /*if (stream_select($stdin, $null, $null, 0) === 1) {
            echo "Input available on STDIN
            ";
            $command = fread(STDIN, 1024*1024);
            echo strstr($command, 'exit');
            echo bin2hex(strstr($command, 'exit'));
            if ($command === "exit\r\n") {
                $run = false;
                echo "Exiting\r\n";
            } else if ($command == "\r\n") {
                //Do nothing
            } else {
                echo "Unknown command : \r\n".$command."\r\n".bin2hex($command)."\r\n";
            }
        }*/
        //usleep(1);
    }
    fwrite($socket, "\x00\x1B\x00\x00\x1B\x00\x00\x00\x1B\x1B\x00\x00\x00\x1B\x00\x00\x1B\x00");
    fclose($socket);

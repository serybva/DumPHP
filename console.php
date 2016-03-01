<?php

    $stream = fopen(__DIR__.'/debug.stream', 'w+');
    $run = true;
    while ($run) {
        while (($content = fread($stream, 1024))) {
            echo $content;
            ftruncate($stream, filesize(__DIR__.'/debug.stream') - ftell($stream));
        }
        /*$stdin = array(STDIN);
        $null = null;
        if (stream_select($stdin, $null, $null, 0) === 1) {
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
        usleep(1);
    }
    fclose($stream);

<?php

    require 'DumPHP.php';

    $date = new DateTime();

    $object = new stdClass();

    $string = 'gjjfgsrkjd';

    $array = array(1,2,3,'fsdhqkfjhjkqs', 98, 6.00, false);

    DumPHP::log($string, false, true, 15468, -574626, 0, 1,
                "è_çàé$^*ùjdfhjfjshsjh'", NULL,
                "romaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadfhuidhzghzehgzdhgvhkldfhzdfhgdfbhdzfghksdfhgslfgjsljgfgohrzegrzhihdzglsdhgzdsfjildzhgozdhlbzghjfzkljgrohbzehgherghvbgzedlzdgkjskjvhdfklhk:dfsjbjkzdgjfkghdfhgsdfjjhsfgjk:zdbgldshkjhsdfhj;ghzdfjbgvsjkbvgjksdjvgsdjknvjksdfhvl;whjdjvjkzbdfbvklzdsjk,",
                '<p class="test">HTML !</p>',
                json_encode(array('test' => 'json', 'sub' => array(1,2,3,4,5,6))));

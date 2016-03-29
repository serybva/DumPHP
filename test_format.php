<?php

    require 'DumPHP.php';

    /**
     *
     */
    class TestClass{
        private     $_private = '1';
        public     $_public = '1';
        protected     $_protected = '1';
        static protected     $_sprotected = '1';
        static protected     $_instance;

        public  function        __construct() {
            $this->count = 1;
        }

        public  static  function    getInstance() {
            self::$_instance = new self();
            return self::$_instance;
        }

        public  function        publicMethod() {}
        private  function        privateMethod() {}
        protected  function        protectedMethod() {}
    }


    $date = new DateTime();

    $object = new stdClass();

    $string = 'gjjfgsrkjd';

    $array = array(1,2,3,'fsdhqkfjhjkqs', 98, 6.00, false);
    $array2 = array('array' => $array, 0 => $array);
    DumPHP::log($array2);
    //DumPHP::log(TestClass::getInstance());
    //DumPHP::log(new TestClass());

    DumPHP::log($string, false, true, 15468, -574626, 0, 1,
                "è_çàé$^*ùjdfhjfjshsjh'", NULL,
                "romaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadfhuidhzghzehgzdhgvhkldfhzdfhgdfbhdzfghksdfhgslfgjsljgfgohrzegrzhihdzglsdhgzdsfjildzhgozdhlbzghjfzkljgrohbzehgherghvbgzedlzdgkjskjvhdfklhk:dfsjbjkzdgjfkghdfhgsdfjjhsfgjk:zdbgldshkjhsdfhj;ghzdfjbgvsjkbvgjksdjvgsdjknvjksdfhvl;whjdjvjkzbdfbvklzdsjk,",
                '<p class="test">HTML !</p>',
                json_encode(array('test' => 'json', 'sub' => array(1,2,3,4,5,6))));
    DumPHP::log(1);
    DumPHP::log(2);
    DumPHP::log(3);
    DumPHP::log(1, 2, 3);

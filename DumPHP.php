<?php

/**
 * DumPHP's purpose is to dump variables properties and send them
 * to a standalone desktop application to ease PHP applications debugging
 *
 * This class is based on the work of Craig Campbell on ChromePHP,
 * see : https://github.com/ccampbell/chromephp
 *
 * DumPHP client side class
 *
 * @package DumPHP
 * @author Sébastien Vray <sebastien@serybva.com>
 */
class       DumPHP {

    /**
     * @var string
     */
    const LOG = 'log';

    /**
     * @var string
     */
    const WARN = 'warn';

    /**
     * @var string
     */
    const ERROR = 'error';

    /**
     * @var string
     */
    const GROUP = 'group';

    /**
     * @var string
     */
    const INFO = 'info';

    /**
     * @var string
     */
    const GROUP_END = 'groupEnd';

    /**
     * @var string
     */
    const GROUP_COLLAPSED = 'groupCollapsed';

    /**
     * @var string
     */
    const TABLE = 'table';

    /**
     * @var string
     */
    const BREAK_SEQUENCE = "\x00\x1B\x00\x00\x1B\x00\x00\x00\x1B\x1B\x00\x00\x00\x1B\x00\x00\x1B\x00";

    /**
     * @var DumPHP
     */
    protected static $_instance;

    protected $_socket;

    private function        __construct() {
        $this->_socket = @fsockopen('localhost', 4242);
        if (!$this->_socket) {
            throw new Exception('Unable to join dump sever at localhost:4242');
        }
    }

    /**
     * gets instance of this class
     *
     * @return DumPHP
     */
    public static function getInstance() {
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * logs a variable to the console
     *
     * @param mixed $data,... unlimited OPTIONAL number of additional logs [...]
     * @return void
     */
    public static function log() {
        $args = func_get_args();
        return self::_log('', $args);
    }

    /**
     * logs a warning to the console
     *
     * @param mixed $data,... unlimited OPTIONAL number of additional logs [...]
     * @return void
     */
    public static function warn() {
        $args = func_get_args();
        return self::_log(self::WARN, $args);
    }

    /**
     * logs an error to the console
     *
     * @param mixed $data,... unlimited OPTIONAL number of additional logs [...]
     * @return void
     */
    public static function error() {
        $args = func_get_args();
        return self::_log(self::ERROR, $args);
    }

    /**
     * sends a group log
     *
     * @param string value
     */
    public static function group() {
        $args = func_get_args();
        return self::_log(self::GROUP, $args);
    }

    /**
     * sends an info log
     *
     * @param mixed $data,... unlimited OPTIONAL number of additional logs [...]
     * @return void
     */
    public static function info() {
        $args = func_get_args();
        return self::_log(self::INFO, $args);
    }

    /**
     * sends a collapsed group log
     *
     * @param string value
     */
    public static function groupCollapsed() {
        $args = func_get_args();
        return self::_log(self::GROUP_COLLAPSED, $args);
    }

    /**
     * ends a group log
     *
     * @param string value
     */
    public static function groupEnd() {
        $args = func_get_args();
        return self::_log(self::GROUP_END, $args);
    }

    /**
     * sends a table log
     *
     * @param string value
     */
    public static function table() {
        $args = func_get_args();
        return self::_log(self::TABLE, $args);
    }

    protected   static  function    _getCallerTrace() {
        $backtrace = debug_backtrace();
        var_dump(__FILE__);
        foreach ($backtrace as $index => $trace) {
            if ($trace['file'] != __FILE__) {
                return array_slice($backtrace, $index);
            }
        }
    }

    /**
     * internal logging call
     *
     * @param string $type
     * @return void
     */
    protected static function _log($type, array $args) {
        // nothing passed in, don't do anything
        if (count($args) == 0) {
            return;
        }
        $dumper = self::getInstance();
        $logs = array();
        var_dump(debug_backtrace());
        $backtrace = self::_getCallerTrace();
        foreach ($args as $arg) {
            $dump = array();
            if (isset($backtrace[0]['file'])) {
                $dump['call_file'] = $backtrace[0]['file'];
            }
            if (isset($backtrace[0]['line'])) {
                $dump['call_line'] = $backtrace[0]['line'];
            }
            $dump['timestamp'] = time();
            $dump['data'] = $dumper->_format($arg);
            $logs[] = $dump;
        }
        $dumper->_sendDump($logs);
    }

    /**
     * converts an object to a better format for logging
     *
     * @param Object
     * @return array
     */
    protected function      _format($var) {
        $properties = array();
        $properties['type'] = gettype($var);
        switch ($properties['type']) {
            case 'object' :
                //$properties['data'] = $this->_formatObject($var);
            break;
            case 'boolean' :
                $properties = array_merge($this->_formatBool($var), $properties);
            break;
            case 'string' :
                $properties = array_merge($this->_formatString($var), $properties);
            break;
            case 'NULL' :
                $properties = array_merge($this->_formatNull($var), $properties);
            break;
            case 'integer' :
                $properties = array_merge($this->_formatInt($var), $properties);
            break;
        }
        return $properties;
    }

    protected   function    _formatBool($bool) {
        $data['value'] = $bool?'true':'false';
        $data['hex_value'] = $bool?'01':'00';
        $data['dec_value'] = $bool?'1':'0';
        return $data;
    }

    protected   function    _formatString($string) {
        $data['value'] = $string;
        $data['html'] = htmlentities($string);
        $data['hex_value'] = bin2hex($string);
        $data['length'] = mb_strlen($string);
        $data['size'] = strlen($string);
        $data['encoding'] = mb_detect_encoding($string);
        return $data;
    }

    protected   function    _formatNull($null) {
        $data['value'] = 'null';
        return $data;
    }

    protected   function    _formatInt($int) {
        $data['value'] = $int;
        $data['hex_value'] = dechex($int);
        $data['bin_value'] = decbin($int);
        return $data;
    }

    protected   function    _formatObject($object) {
        try {
            $reflection = new \ReflectionClass($object);

            $data = array('properties' => array());
            // loop through the properties and add those
            foreach ($reflection->getProperties() as $property) {

                // if one of these properties was already added above then ignore it
                if (array_key_exists($property->getName(), $object_vars)) {
                    continue;
                }
                $type = $this->_getPropertyKey($property);

                if ($this->_php_version >= 5.3) {
                    $property->setAccessible(true);
                }

                try {
                    $value = $property->getValue($object);
                } catch (\ReflectionException $e) {
                    $value = 'only PHP 5.3 can access private/protected properties';
                }

                // same instance as parent object
                if ($value === $object || in_array($value, $this->_processed, true)) {
                    $value = 'recursion - parent object [' . get_class($value) . ']';
                }

                $object_as_array[$type] = $this->_convert($value);
            }
        } catch (Exception $e) {
            return array();
        }
    }

    protected   function        _sendDump($logs) {
        $JSON = json_encode($logs);
        $bufferSize = 1024*1024*5;
        if ($this->_socket) {
            $wrote = fwrite($this->_socket, $JSON, $bufferSize);
            while ($wrote === $bufferSize) {
                $wrote = fwrite($this->_socket, $JSON, $bufferSize);
            }
            fwrite($this->_socket, self::BREAK_SEQUENCE);
            var_dump($JSON);
        } else {
            throw new Exception('Could not connect to dumping server localhost:4242');
        }
    }

    protected   function        __destroy() {
        if ($this->_socket) {
            fclose($this->_socket);
        }
    }
}

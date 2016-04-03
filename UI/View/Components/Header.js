'use strict';

module.exports = Header;

const humanBytes = require('../Lib/HumanBytes.js');
const os = require('os');
const Events = require('events');
const Observable = require('../Lib/Observable.js');

function Header(engine) {
    this.engine = engine;

    //Init header data
    this.data = {};
    this.getSysData();
    this.data.dumps_count = 0;

    //Watch changes with observable
    this.data = new Observable(this.data, new Events());

    //Render template again on each header data change
    this.data.on('value-changed', function() {
        $('header').Mustache(this.data.originalProps());
    }.bind(this));

    //When header template have
    $('header').on('template-rendered', function() {
        $('header').unbind('template-rendered');
        setInterval(function() {
            this.getSysData();
        }.bind(this), 1000);
        setInterval(function() {
            this.data.dumps_count = this.engine.dumps.length;
        }.bind(this), 100);
    }.bind(this));
    $('header').Mustache(this.data.originalProps());
}

Header.prototype.getSysData = function() {
    var cpu = os.cpus();
    var memTotal = os.totalmem();
    var memFree = os.freemem();
    if (cpu.length > 0) {
        this.data.cores = cpu.length;
        this.data.freq = (cpu[0].speed/1000);
        this.data.memUsed = humanBytes(memTotal-memFree);
        this.data.memTotal = humanBytes(memTotal, true);
    }
};

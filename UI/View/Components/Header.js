'use strict';

module.exports = Header;

const humanBytes = require('../Lib/HumanBytes.js');
const os = require('os');

function Header(template) {
    this.template = template;
    console.log(React);
    //var component = React.createClass(this.prototype);
}

Header.prototype.render = function() {

};

Header.prototype.getSysData = function() {
    var cpu = os.cpus();
    var memTotal = os.totalmem();
    var memFree = os.freemem();
    var sysData = {};
    if (cpu.length > 0) {
        sysData.cores = cpu.length;
        sysData.freq = (cpu[0].speed/1000);
        sysData.memUsed = humanBytes(memTotal-memFree);
        sysData.memTotal = humanBytes(memTotal, true);
    }
    return sysData;
};

/*Engine.prototype.renderHeader = function() {
    var cpu = os.cpus();
    var memTotal = os.totalmem();
    var memFree = os.freemem();
    if (cpu.length > 0) {
        $('header').html(
            Mustache.render(this.templates.header, {
                cpu_cores: cpu.length+' cores',
                cpu_freq: (cpu[0].speed/1000)+' Ghz',
                mem_used: humanBytes(memTotal-memFree),
                mem_total: humanBytes(memTotal, true),
                dumps_count: this.dumps.length
            }, {
                sysInfo : this.templates.sysInfo
            })
        );
        $('header .hidden').removeClass('hidden');
    }
};*/

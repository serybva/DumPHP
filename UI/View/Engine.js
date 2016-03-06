'use strict';

module.exports = Engine;

function Engine() {
    const   ipc = require('electron').ipcRenderer;
    ipc.on('dump-available', this.listenForDumps.bind(this));
    $(document).on('ready', this.initHeader.bind(this));
};

Engine.prototype.listenForDumps = function(event, dump) {
    console.log(dump);
}

Engine.prototype.addDumps = function(event, dump) {
    console.log(dump);
}

Engine.prototype.initHeader = function() {
    const os = require('os');
    const humanBytes = require('./Lib/HumanBytes.js');
    var cpu = os.cpus();
    var memTotal = os.totalmem();
    var memFree = os.freemem();
    if (cpu.length > 0) {
        $('header').on('partial-loaded', function(e) {
            $(e.currentTarget).html(
                Mustache.render($(e.currentTarget).html(), {
                    cpu_cores: cpu.length+' cores',
                    cpu_freq: (cpu[0].speed/1000)+' Ghz',
                    mem_used: humanBytes(memTotal-memFree),
                    mem_total: humanBytes(memTotal, true)
                })
            );
        });
    }
}

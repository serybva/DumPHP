'use strict';

module.exports = DumpFormatter;

const humanBytes = require('./Lib/HumanBytes.js');
const Emitter = require('events');
const cp = require('child_process');

new DumpFormatter();

function DumpFormatter() {
    process.on('message', function(dumps) {
        for (var i = 0;i < dumps.length;i++) {
            dumps[i] = this.formatDumpData(dumps[i]);
        }
        process.send(dumps);
    }.bind(this));
}

DumpFormatter.prototype.formatDumpData = function(dump) {
    var date = new Date(dump.timestamp*1000);
    if (dump.data.type === 'string') {
        if (dump.data.hex_value.length > 10) {
            dump.data.hex_value = dump.data.hex_value.match(new RegExp("(.{1,2})", 'g')).join(' ');
        }
        try {
            dump.data.JSON = JSON.stringify(
                JSON.parse(dump.data.value),
                null,
                4
            );
            dump.data.JSON = dump.data.JSON.split(' ').join('&nbsp;').split('\n').join('<br />');
        } catch(e) {
            delete dump.data.JSON;
        }
    }
    dump.date = [
        date.getDate(), '/', date.getMonth()+1,
        '/', date.getFullYear(), ' ', date.getHours(), ':',
        date.getMinutes(), ':', date.getSeconds()
    ].join('');
    return dump;
};

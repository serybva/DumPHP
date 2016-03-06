"use strict";

const   Emitter = require('events');

class   Receiver extends Emitter {

    constructor() {
        super();
        this.DATA_BLOCK_FOUND = 'data_block_found';
        this.BREAK_SEQUENCE = '\x00\x1B\x00\x00\x1B\x00\x00\x00\x1B\x1B\x00\x00\x00\x1B\x00\x00\x1B\x00';
    }

    _searchBreak() {
        var broke = true;
        for (var i = 0;i < this.buffer.length;i++) {
            if (this.buffer.length - i <= this.BREAK_SEQUENCE.length) {
                for (var j = 0, k = i;j < this.BREAK_SEQUENCE.length;j++,k++) {
                    broke = broke && this.BREAK_SEQUENCE.charCodeAt(j) == this.buffer[k];
                }
                if (broke) {
                    this.emit(this.DATA_BLOCK_FOUND, this.buffer.slice(0, i));
                    this.buffer = this.buffer.slice(i+this.BREAK_SEQUENCE.length);
                    break;
                }
            }
        }
    }

    dataReady(data) {
        console.log('Incoming data from : '+(this.socket || {}).remoteAddress+':'+(this.socket || {}).localPort);
        if (typeof this.buffer === 'undefined') {
            this.buffer = data;
        } else {
            this.buffer = Buffer.concat([this.buffer, data]);
        }
        //console.log(data.toString()+"\r\n");
        this._searchBreak();
    }
}

exports.Receiver = Receiver;

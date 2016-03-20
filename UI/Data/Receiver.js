"use strict";

const   Emitter = require('events');
const   Util = require('util');

class   Receiver extends Emitter {

    constructor() {
        super();
        this.DATA_BLOCK_FOUND = 'data_block_found';
        this.BREAK_SEQUENCE = '\x00\x1B\x00\x00\x1B\x00\x00\x00\x1B\x1B\x00\x00\x00\x1B\x00\x00\x1B\x00';
    }

    /**
     * _subCmp Searches a substring (needle) into a greater string (haystack),
     * from given position (index).
     * This methods awaits two buffer, comparison type is binary
     * so it works with other types than string
     *
     * @method _subCmp
     * @author Sébastien Vray <sebastien@serybva.com>
     * @param  Buffer needle   The buffer to search
     * @param  Buffer haystack The buffer in which the search occurs
     * @param  int index    Position in the haystack to start search from
     * @return bool          Wether the needle has been found in the haystack or not
    */
    _subCmp(needle, haystack, index) {
        if (index >= 0 && index < haystack.length) {//Make sure specified start remains within the buffer
            var match = true;
            for (var i = 0;i < needle.length;i++) {//Start comparison
                //If current needle index plus start position don't take us after haystack end
                if (index + i < haystack.length) {
                    //Did the previous indexes match and the current ones too?
                    match = match && needle[i] == haystack[index+i];
                } else {
                    match = false;
                }
            }
            return match;
        }
        return false;
    }

    /**
     * _searchBreak Searches the buffer of received data for the break sequence
     * and emits an event when found.
     *
     * @method _searchBreak
     * @author Sébastien Vray <sebastien@serybva.com>
     */
    _searchBreak() {
        for (var i = 0;i < this.buffer.length;i++) {
            if (this._subCmp(new Buffer(this.BREAK_SEQUENCE), this.buffer, i)) {
                //console.log('On break found');
                //console.log(this.buffer.slice(0, i).toString('hex'));
                //console.log(this.buffer.slice(0, i).toString('utf-8'));
                /*console.log('\n'+getTime()+'Found break at '+i);
                console.log('\n'+getTime()+'Block '+this.buffer.slice(0, i).toString('hex'));
                console.log('\n'+getTime()+'Block '+this.buffer.slice(0, i).toString('utf-8'));*/
                this.emit(this.DATA_BLOCK_FOUND, this.buffer.slice(0, i));
                //console.log('Data block found event emitted');
                this.buffer = this.buffer.slice(i+this.BREAK_SEQUENCE.length);
                i = 0;
                //console.log('Stripped data entity from buffer');
            }
        }
    }

    dataReady(data) {
        console.log(getTime()+'Incoming data from : '+(this.socket || {}).remoteAddress+':'+(this.socket || {}).localPort);
        /*console.log("\n"+data.toString('utf-8'));
        console.log("\n"+data.toString('hex'));*/
        if (typeof this.buffer === 'undefined') {
            this.buffer = data;
        } else {
            this.buffer = Buffer.concat([this.buffer, data]);
        }
        /*console.log("\nBuffer \n"+this.buffer.toString('utf-8'));
        console.log("\nBuffer \n"+this.buffer.toString('hex'));*/
        this._searchBreak();
    }
}

exports.Receiver = Receiver;

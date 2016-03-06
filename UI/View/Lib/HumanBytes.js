'use strict';

module.exports = humanBytes;

function humanBytes(bytes, wUnits, units) {
    var divider = 1024;

    if (typeof(units) === 'undefined') {
        units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    }
    var i = 0;
    while (bytes / divider > 1) {
        bytes /= divider;
        i++;
    }
    bytes = parseInt(bytes*100)/100;
    if (typeof(wUnits) !== 'undefined' && wUnits) {
        return bytes+units[i];
    } else {
        return bytes;
    }
}

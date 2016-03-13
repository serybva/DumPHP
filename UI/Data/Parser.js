"use strict";


class   Parser {

    constructor(view) {
        if (typeof(view) === 'undefined') {
            throw new Error("View argument is undefined");
        }
        if (typeof(view.webContents) === 'undefined') {
            throw new Error("Invalid view argument");
        }
        this.view = view;
    }

    _parse(data) {
        var json = JSON.parse(data.toString('UTF-8'));
        var util = require('util');
        console.log(getTime()+data.toString('UTF-8'));
        console.log(util.inspect(json, false, null));
        this.view.webContents.send('dump-available', json);
        //console.log(data.toJSON());
        //console.log(data);
    }
}

exports.Parser = Parser;

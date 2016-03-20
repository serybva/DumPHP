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
        console.log(getTime()+'Parser received data');
        //console.log(data.toString('UTF-8'));
        try {
            var json = JSON.parse(data.toString('UTF-8'));
            //console.log(getTime()+'Parsed json');
            var util = require('util');
            //console.log(getTime()+data.toString('UTF-8'));
            //console.log(util.inspect(json, false, null));
            this.view.webContents.send('dump-available', json);
            //console.log(data.toJSON());
            //console.log(data);
        } catch (e) {
            //console.log("\n"+data.toString('hex'));
            //console.log("\n"+data.toString('UTF-8'));
            console.log("\n"+e);
        }
    }
}

exports.Parser = Parser;

'use strict';

module.exports = Engine;

const humanBytes = require('./Lib/HumanBytes.js');
const Tabs = require('./Lib/jQuery.tabs.js');
const Header = require('./Components/Header.js');
const Emitter = require('events');
const cp = require('child_process');

function Engine() {
    const   ipc = require('electron').ipcRenderer;
    this.templates = {};//Init templates container
    this.dumps = [];//Init dump container
    new Header(this);//Init header

    $.get('Partials/dump-placeholder.html').done(function(template) {
        this.templates.dumpPlaceholder = template;
    }.bind(this));//Load dump placeholder template
    ipc.on('dump-available', this.onDumpAvailable.bind(this));//And wait for dump
    this.formatterWorker = cp.fork('./View/DumpFormatter.js');
}

Engine.prototype = new Emitter(Engine.prototype);

Engine.prototype.sizeFormatCallback = function(text, render) {
    return humanBytes(render(text), true);
};

Engine.prototype.onDumpAvailable = function(event, dumps) {
    var placeholders = [this.templates.dumpPlaceholder];
    for (var i = 0;i < dumps.length;i++) {
        placeholders.push(this.templates.dumpPlaceholder);
    }
    $('.dumps-wrapper').prepend(placeholders.join(''));
    //console.log("Dumps received "+new Date().getMilliseconds());
    this.formatterWorker.on('message', function(formattedDumps) {
        this.formatterWorker.removeAllListeners('message');
        this.dumps = formattedDumps.concat(this.dumps);
        this.render();
    }.bind(this));
    this.formatterWorker.send(dumps);
};

Engine.prototype.render = function() {
    //console.log("Render starts "+new Date().getMilliseconds());
    $('.dumps-wrapper').Mustache({
        dumps: this.dumps,
        sizeFormat: function() {
            return this.sizeFormatCallback;
        }.bind(this)
    });
    //console.log("Template rendered "+new Date().getMilliseconds());
    $('.dumps-wrapper').removeClass('hidden');
    $('.dumps-wrapper .dump').collapse({
        query: "button"
    }).slice(0, 5).trigger('open');
    $('.dumps-wrapper div.tabbed-content').tabs();
};

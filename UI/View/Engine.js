'use strict';

module.exports = Engine;

const humanBytes = require('./Lib/HumanBytes.js');
const Tabs = require('./Lib/jQuery.tabs.js');
const Header = require('./Components/Header.js');
const Emitter = require('events');
const os = require('os');

function Engine() {
    const   ipc = require('electron').ipcRenderer;
    this.templates = {};//Init templates container
    this.dumps = [];//Init dump container
    $('header').Mustache();
    new Header();
    this.on('templates-loaded', function() {//Wait until all templates are loaded
        //this.renderHeader();//Initialize header when templates are loaded
        ipc.on('dump-available', this.listenForDumps.bind(this));//And wait for dump
    }.bind(this));
    this.on('templates-loading-failed', function() {
        throw "Could not load a template, check your paths";
    }.bind(this));
    this.loadTemplates();//Load templates
}

Engine.prototype = new Emitter(Engine.prototype);

Engine.prototype.loadTemplates = function() {
    this.templates.dumpsWrapper = $('.dumps-wrapper').text();
    var promisePool = [
        $.get('Partials/dump.mustache').done(function(template) {
            this.templates.dump = template;
            Mustache.parse(this.templates.dump);
        }.bind(this)),
        $.get('Partials/system-info.mustache').done(function(template) {
            this.templates.sysInfo = template;
            Mustache.parse(this.templates.sysInfo);
        }.bind(this)),
        $.get('Partials/dump-placeholder.html').done(function(template) {
            this.templates.dumpPlaceholder = template;
        }.bind(this))
    ];
    var watcher = setInterval(function() {
        var resolved = 0;
        for (var i = 0;i < promisePool.length;i++) {
            if (promisePool[i].state() === 'resolved') {
                resolved++;
            } else if (promisePool[i].state() === 'rejected') {
                this.emit('templates-loading-failed');
            }
        }
        if (resolved === promisePool.length) {
            this.emit('templates-loaded');
            clearInterval(watcher);
        }
    }.bind(this), 100);
    Mustache.parse(this.templates.dumpsWrapper);
};

Engine.prototype.sizeFormatCallback = function(text, render) {
    return humanBytes(render(text), true);
};

Engine.prototype.formatDumpData = function(dump) {
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

Engine.prototype.listenForDumps = function(event, dumps) {
    for (var i = 0;i < dumps.length;i++) {
        $('.dumps-wrapper').prepend(this.templates.dumpPlaceholder);
    }
    for (var i = 0;i < dumps.length;i++) {
        dumps[i] = this.formatDumpData(dumps[i]);
    }
    this.dumps = dumps.concat(this.dumps);
    this.render();
    console.log(this.dumps, dumps);
};

Engine.prototype.render = function() {
    if (typeof(this.templates.dumpsWrapper) !== "undefined" &&
        typeof(this.templates.dump) !== "undefined") {
        $('.dumps-wrapper').html(
            Mustache.render(
                this.templates.dumpsWrapper,
                {
                    dumps: this.dumps,
                    sizeFormat: function() {
                        return this.sizeFormatCallback;
                    }.bind(this)
                },
                {dump: this.templates.dump}
            )
        );
        $('.dumps-wrapper').removeClass('hidden');
        $('.dumps-wrapper .dump').collapse({
            query: "button"
        }).slice(0, 5).trigger('open');
        $('.dumps-wrapper div.tabbed-content').tabs();
    }
};

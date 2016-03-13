"use strict";

const net = require('net');

class Server {

    constructor(handler) {
        if (typeof(handler) !== 'object') {
            throw new Error("You have to pass an handler object containing callback functions to the Server constructor !");
        }
        if (typeof(handler.dataReady) !== 'function') {
            throw new Error("Server handler must define a handler function named dataReady");
        }
        this.handler = handler;
        this.callbacks = {
            dataAvailable : handler.dataReady
        };
        this._listen();
    }

    _newConnection(socket) {
        this.handler.socket = socket;
        socket.on('data', this.callbacks.dataAvailable.bind(this.handler));
        console.log(getTime()+'Incoming connection from : '+socket.remoteAddress+':'+socket.localPort);
    }

    _listen() {
        this.server = new net.createServer();
        this.server.listen({port: 4242}, function() {
            this.server.on('connection', this._newConnection.bind(this));
        }.bind(this)).on('error', function(error) {
            console.log(error);
            throw error;
        });
    }
}

exports.Server = Server;

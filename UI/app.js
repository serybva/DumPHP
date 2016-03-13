'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

const DumPHP = require('./DumPHP').DumPHP;
const Server = DumPHP.Server;
const Receiver = DumPHP.Receiver;
const Parser = DumPHP.Parser;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

global.getTime = function() {
    var date = new Date();
    return date.toLocaleTimeString()+':'+date.getMilliseconds()+' : ';
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  //mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow = new BrowserWindow();
  //mainWindow.minimize();
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/view/index.html');

  var   dataReceiver = new Receiver();
  var   dataParser = new Parser(mainWindow);
  dataReceiver.on(dataReceiver.DATA_BLOCK_FOUND, dataParser._parse.bind(dataParser));
  new Server(dataReceiver);

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

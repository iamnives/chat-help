var express = require('express');
var http = require('http')
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var websocket = socketio(server);

var messageExchange = websocket
    .of('/chat')
    .on('connection', function (socket) {
        // Set the initial channel for the socket
        // Just like you set the property of any
        // other object in javascript
        socket.channel = "";

        // When the client joins a channel, save it to the socket
        socket.on("joinChannel", function (data) {
            socket.channel = data.channel;
        });

        // When the client sends a message...
        socket.on("message", function (data) {
            // ...emit a "message" event to every other socket
            socket.broadcast.emit("message", {
                channel: socket.channel,
                message: data.message
            });
        });
     });

server.listen(3000, () => console.log('listening on *:3000'));
var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongojs = require('mongojs');

var ObjectID = mongojs.ObjectID;
var db = mongojs(process.env.MONGO_URL || 'mongodb://localhost:27017/local');
var app = express();
var server = http.Server(app);
var websocket = socketio(server);
server.listen(3000, () => console.log('listening on *:3000'));


// This represents a unique chatroom.
// For this example purpose, there is only one chatroom;
var chatId = 1;

websocket.on('connection', (socket) => {
    
});

var messageExchange = websocket
    .of('/chat')
    .on('connection', function (socket) {


        socket.on('message', (message) => onMessageReceived(message, socket));

        socket.on('get-helper', (message) => onHelperReceived(message, socket));


        socket.on('join', function (data) {
            socket.join(data.from); // We are using room of socket io
            onUserJoined(data.from, data.to, socket)
        });
     });
// Event listeners.
// When a user joins the chatroom.
function onUserJoined(from, to, socket) {
 
    _sendExistingMessages(from, to, socket);
}

// When a user sends a message in the chatroom.
function onMessageReceived(message, senderSocket) {

  _sendAndSaveMessage(message, senderSocket);
}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingMessages(from, to, socket) {
    var query = { 
        from: from,
        to: too    
    };
  var messages = db.collection('messages')
    .find(query)
    .sort({ createdAt: 1 })
    .toArray((err, messages) => {
      // If there aren't any messages, then return.
      if (!messages.length) return;
      io.sockets.in('user1@example.com').emit('new_msg',  messages.reverse());
  });
}

// Save the message to the db and send all sockets but the sender.
function _sendAndSaveMessage(message, socket) {
  var messageData = {
    text: message.text,
    from: message.from,
    to: message.to,
    createdAt: new Date(message.createdAt),
  };

  db.collection('messages').insert(messageData, (err, message) => {
    
    io.sockets.in(message.to).emit('new_msg',  [message]);

  });
}

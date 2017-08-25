var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

app.get('/drag', function(req, res){
res.sendFile(__dirname + '/drag.html');
});

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

// io.on('connection', function(socket){
//   console.log('a user connected');
//
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });  
// });

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);
//   });
// });

var users = [];
  
io.on('connection', function(socket){

  //listen for: socket.emit('gameupdate', draggable_obj.attr("id"));
  socket.on('gameupdate', function(draggableObjId, snapPoint){
    io.emit('gameupdate', draggableObjId, snapPoint);
    console.log('game piece was moved: ' + draggableObjId);
  });
  
  socket.on('login', function(username){
    socket.username = username;
    users.push(username);
    io.emit('chat message', socket.username + " has joined");
    console.log('user registered');
  });

  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', socket.username + ": " + msg);
    // io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

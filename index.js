var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var ready = false;
var id;
var numPlayers = 0;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket){

	socket.on('disconnect', function(){
		console.log('user disconnected')

		if(numPlayers == 1){
			ready = false;
		}
		else{ // send disconnect to partner, who calls ready
			io.in(socket.room).emit('disconnected','');
		}
		numPlayers--;

	})
	socket.on('newPlayer',function(notUsed){
		numPlayers++;
		console.log(numPlayers);
	});
	socket.on('message',function(msg){
		console.log('message: ' + msg);
		console.log(socket.room);
		// socket.id is default room
		socket.broadcast.to(socket.room).emit('message',msg);
	})
	socket.on('ready',function(notUsed){
		if(ready){
			ready = false;
			socket.join(id);
			socket.room = id;
			io.in(id).emit('connected',id);
			console.log(socket.id + 'joined room ' + id);
		}
		else{
			ready = true;
			id = 'r' + socket.id; // random ID that changes every connection
			console.log('waiting');	
			socket.join(id);
			socket.room = id;		
		}
	})
})

http.listen(3000, function(){
	console.log('listening on *:3000');
});

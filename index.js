var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var ready = false;
var id;

var possibilities = ['cat\nbat\nsat\nlat\nrat\nmat\nfat\nzat',
'123\n1231254215134234234243.\nwhy.\nlol.','dude@gmail.com\nbobalex@yahoo.com duh\nwhat is the flight speed of an african ostrich?']
var goals = [['cat','bat','sat','lat','rat','mat','fat'],
['123','1231254215134234234243'],
['dude@gmail.com','bobalex@yahoo.com']];
var index = 0;
var challenge = {
	'stringToMatch':'',
	'goal':'',
}
function randomChallenge(){
	index = Math.floor(Math.random()*goals.length);
	challenge.stringToMatch = possibilities[index];
	challenge.goal = goals[index];
	return challenge;
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html')
});

app.get('/practice', function(req,res){
	res.sendFile(__dirname + '/practice/index.html')
});

app.get('/play', function(req,res){
	res.sendFile(__dirname + '/play/index.html')
});

io.on('connection', function(socket){

	socket.on('disconnect', function(){
		console.log('user disconnected')
		if(io.engine.clientsCount%2 == 0) ready = false;
		else{ // send disconnect to partner, who reloads page
			ready = true;
			socket.broadcast.to(socket.room).emit('disconnected','');
		}

	})
	socket.on('newPlayer',function(notUsed){
		console.log(io.engine.clientsCount);
	});
	socket.on('message',function(msg){
		// socket.id is default room
		socket.broadcast.to(socket.room).emit('message',msg);
	})
	socket.on('ready',function(notUsed){
		if(ready){
			ready = false;
			socket.join(id);
			socket.room = id;

			socket.gamePair = id.slice(1)
			io.sockets.connected[id.slice(1)].gamePair = socket.id;

			io.in(id).emit('connected',randomChallenge());
			console.log(socket.id + 'joined room ' + id);
		}
		else{
			ready = true;
			id = 'r' + socket.id; // random ID that changes every connection
			console.log('waiting');	
			socket.join(id);
			socket.room = id;		
		}
	});
	socket.on('won',function(score){
		console.log(socket.room + ' won with score ' + score)
		socket.broadcast.to(socket.room).emit('loss','');
		
		io.sockets.connected[socket.gamePair].disconnect();
		socket.disconnect();
		
	});
})

http.listen(8080, function(){
	console.log('listening on *:8080');
});

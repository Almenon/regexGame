var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var ready = false;
var id;
var numPlayers = 0;

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
	socket.on('won',function(notUsed){
		console.log(socket.room + ' lost')
		socket.broadcast.to(socket.room).emit('loss','');
	});
})

http.listen(8080, function(){
	console.log('listening on *:8080');
});

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var ready = false;
var id;

var possibilities = ['cat\nbat\nsat\nlat\nrat\nmat\nfat\nzat',
'123\n1231254215134234234243.\nwhy.\nlol.','dude@gmail.com\nbobalex@yahoo.com duh\nwhat is the flight speed of an african ostrich?']
var goals = [[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19,21,22,23,25,26,27],[1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]]
var index = 0;
var challenge = {
	'stringToMatch':'',
	'goal':'',
	'id':0,
}
function randomChallenge(){
	index = Math.floor(Math.random()*goals.length);
	challenge.stringToMatch = possibilities[index];
	challenge.goal = goals[index];
	challenge.id = index;
	return challenge;
}

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) { 
      return index + start;  
  });
//http://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-an-array-based-on-suppl
}

function iswin(matches,challengeId){
		var i = 0;
		var goal = goals[challengeId];
		if(matches == null || matches.length == 0 || matches.length == 1 && matches[0] == '') return false;
		charsMatch = matches.every(function(match){
			nums = range(match.index+1,match[0].length) // add 1 because goal uses 1-based indexing
			return nums.every(function(num){
				return num == goal[i++];
			})
		})
		return i == goal.length && charsMatch
		// make sure all chars have been tested and that chars match
}

function applyRegex(regexString,challengeId){
	var regexText = regexString.slice(0,regexString.lastIndexOf('/'));
	var flagText = regexString.split('/').pop();
	try{
		var re = new RegExp(regexText, flagText);
	}
	catch(SyntaxError){ return; }
	matches = [];
	stringToMatch = possibilities[challengeId];

	if(re.flags.search('g') > -1){
		while((match = re.exec(stringToMatch)) != null && match != ''){
			matches.push(match);
		}
	}
	else{
		match = re.exec(stringToMatch)
		if(match == null){return;}
		matches.push(match);
	}
	return matches;
}

function addToSocketPair(socket,property,value){
	// adds a property to the socket and its pair
	socket[property] = value;
	io.sockets.connected[socket.gamePair][property] = value;
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
	socket.on('message',function(regex){
		var challengeId = socket.challengeId;
		var matches = applyRegex(regex,challengeId)
		if(iswin(matches,challengeId)){
			console.log(socket.room + ' won')
			socket.broadcast.to(socket.room).emit('loss','');
			socket.emit('won','')
			io.sockets.connected[socket.gamePair].disconnect();
			socket.disconnect();
		}
		// socket.id is default room
		socket.broadcast.to(socket.room).emit('message',regex);
	})
	socket.on('ready',function(notUsed){
		if(ready){
			ready = false;
			socket.join(id);
			socket.room = id;

			socket.gamePair = id.slice(1)
			io.sockets.connected[id.slice(1)].gamePair = socket.id;

			challenge = randomChallenge()
			addToSocketPair(socket,'challengeId',challenge.id)
			io.in(id).emit('connected',challenge);
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
})

http.listen(8080, function(){
	console.log('listening on *:8080');
});

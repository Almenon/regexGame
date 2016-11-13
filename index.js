var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var ready = false;
var id;


var easy = [{
	"text": "cat\nbat\nsat\nlat\nrat\nmat\nfat\nzat",
	"goal": [1,5,9,13,17,21,25]
},
{
	"text": "123\n1231254215134234234243.\nwhy.\nlol.",
	"goal": [1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
},
{"text":"cat\nbat\nsat\nlat\nrat\nmat\nfat\nzat","goal":[2,3,6,7,10,11,14,15,18,19,22,23,26,27,30,31]},
{
	"text": "dudethisisASUPERLONGEMAILOHMYGOD@gmail.com\nwhat is the flight speed of an african ostrich?",
	"goal": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]
},
{"text":"d.de.a.b.c.d.e.f.fa.","goal":[3,4,18,19]},
{"text":"Some flaGs might come in handy...\nggggggGGgggGGGggggGGGGgggggGGGGGggggg\nGggggGGGGGgggGGGGgggGGGgggGGggggGGg\ngggGGggGgggGGGggGgGGgGgGgGGGGGgGgGg\n","goal":[9,14,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143]},
];
var hard = [
{
	"text": "dude@gmail.com\nbobalex@yahoo.com duh\nwhat is the flight speed of an african ostrich?",
	"goal": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]
},
{"text":":) :):)a woeifjoewi2-394 :):):) :)\n:):):) :) :):):):) :):) :):):)\n: ) ): :)))","goal":[26,27,28,29,30,31,36,37,38,39,40,41,46,47,48,49,50,51,52,53,60,61,62,63,64,65]},
{"text":"السلام والمحبة والازدهار.\npeace, love, and prosperity.","goal":[1,2,3,4,5,6,8,9,10,11,12,13,14,16,17,18,19,20,21,22,23,24]},
{"text":"\\(.^$[{ you will never escape\n you will never escape \\(.^$[{\nyou will \\(.^$[{ never escape","goal":[1,2,3,4,5,6,7,54,55,56,57,58,59,60,71,72,73,74,75,76,77]},
];
var allChallenges = easy.concat(hard);
var index = 0;
var challenge = {
	'stringToMatch':'',
	'goal':'',
	'id':0,
}
function randomChallenge(){
	index = Math.floor(Math.random()*allChallenges.length);
	challenge.stringToMatch = allChallenges[index]['text'];
	challenge.goal = allChallenges[index]['goal'];
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
		var goal = allChallenges[index]['goal'];
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
	stringToMatch = allChallenges[challengeId]['text'];

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
app.get('/create', function(req,res){
	res.sendFile(__dirname + '/create/index.html')
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

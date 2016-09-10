var socket = io();

var stringToMatch = "testing";
var goal = ['e'];
var myText;
var opponentText;


function onInput(element) {

	if(event.keyCode == 13) {
		regexString = element.value;
		socket.emit('message',regexString);
		try{
			var re = new RegExp(regexString);
		}
		catch(SyntaxError){
			$('#regexinput').effect('shake');
			return;
		}

		myText.unmark().markRegExp(re,{className: 'highlight'});
		element.value = '';

		matches = re.exec(stringToMatch);
		if(matches == null || matches.length == 1) return;
		matches.shift(); // get rid of useless first result
		var i = 0;
		if(matches.every(function(x){
			return x == goal[i++];
		})){
			socket.emit('won','');
			// go to win page w/ score
			// or pop up alert
			alert('you won! ' + String(1000-regexString.length) + " points");			
		}
    }
}

socket.emit('newPlayer','');

function waitForChallenger(){
	socket.emit('ready','');
	console.log('waiting');
	$('#status').text('waiting for another player to connect');
}
waitForChallenger();

socket.on('connected', function(msg){
	console.log(msg);
	$('.status').replaceWith("<p id='good'>"+stringToMatch+"</p><p id='text'>"+stringToMatch+"</p>")
	var good  = new Mark(document.querySelector('#good'))
	myText  = new Mark(document.querySelector('#mine #text'))
	opponentText  = new Mark(document.querySelector('#opponent #text'))
	// have to use document.querySelector
	// unless you use mark.js jquery plugin
})

socket.on('message', function(msg){
		try{
			var re = new RegExp(msg);
		}
		catch(SyntaxError){
			return;
		}
		opponentText.unmark().markRegExp(re,{className: 'highlight'});
})

socket.on('disconnected', function(notUsed){
	console.log('opponent disconnected');
	waitForChallenger();
});

socket.on('loss', function(notUsed){
	alert('You lost! Better luck next time');
	waitForChallenger(); // if loss is called before p2 connects this is a problem!
});
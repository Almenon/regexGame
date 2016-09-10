var socket = io();

var stringToMatch = "testing";
var good  = new Mark(document.querySelector('#good'));
var text  = new Mark(document.querySelector('#mine #text'))
var opponentText  = new Mark(document.querySelector('#opponent #text'))
// have to use document.querySelector
// unless you use mark.js jquery plugin
good.mark('e',{className:'goodHighlight'});


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
	
		text.unmark().markRegExp(re,{className: 'highlight'});
		//$('p').highlightRegex(); // clear old highlight
		//$('p').highlightRegex(re);
		element.value = '';

		if(re.test(stringToMatch)){
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
	$('#status').text('player 2 connected');
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
});
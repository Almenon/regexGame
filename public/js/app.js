var socket = io();

var good  = new Mark(document.querySelector('#good'))
var text  = new Mark(document.querySelector('#mine #text'))
var opponentText  = new Mark(document.querySelector('#opponent #text'))
// have to use document.querySelector
// unless you use mark.js jquery plugin
good.mark('e',{className:'goodHighlight'});


function onInput(element) {

	if(event.keyCode == 13) {
		socket.emit('message',element.value);
		try{
			var re = new RegExp(element.value);
		}
		catch(SyntaxError){
			$('#regexinput').effect('shake');
			return;
		}
	
		text.unmark().markRegExp(re,{className: 'highlight'});
		//$('p').highlightRegex(); // clear old highlight
		//$('p').highlightRegex(re);
		element.value = '';
    }
}

socket.emit('newPlayer','');

function waitForChallenger(){
	socket.emit('ready','');
	console.log('waiting');
}
waitForChallenger();

socket.on('connected', function(msg){
	console.log(msg);
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
var socket = io();

var possibilities = ['cat\nbat\nsat\nlat\nrat\nmat\nfat\nzat','what the heck.  dude omg.  why. lol.']
var goals = [['cat','bat','sat','lat','rat','mat','fat'],['what']];
// var index = ath.floor(Math.random()*goals.length)
// ^ to get random choice
var index = 0
var stringToMatch = possibilities[index]
var goal = goals[index];
var myText;
var opponentText;
var flags = ''
var enter = $.Event( 'keypress', { keyCode: 13, which: 13 } );

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) { 
      return index + start;  
  });
//http://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-an-array-based-on-suppl
}

$('#regexInput').on('keypress',function(event) {

	if(event.keyCode == 13) { // enter key
		var regexString = $('#regexInput').val();
		socket.emit('message',regexString + '/' + flags)

		try{
			var re = new RegExp(regexString,flags);
		}
		catch(SyntaxError){
			$('#regexInput').effect('shake');
			return;
		}

		matches = highlightRegExp(re,'#mine .text')

		if(iswin(matches)){
			socket.emit('won','')
			// go to win page w/ score
			// or pop up alert
			alert('you won! ' + String(1000-regexString.length) + " points");			
		}
    }
});

function highlightRegExp(re,element){
	$(element + ' span').removeClass('highlight');
	matches = [];

	if(re.flags.search('g') > -1){
		while((match = re.exec(stringToMatch)) != null && match != ''){
			highlightMatch(match,element);
			matches.push(match);
		}
	}
	else{
		match = re.exec(stringToMatch)
		if(match == null){return;}
		highlightMatch(match,element);
		matches.push(match);
	}
	return matches;
}

function highlightMatch(match, element){
	letters = range(match.index+1, match[0].length)
	letters.forEach(function(letterNum){
		$(element + ' span.char'+ letterNum.toString()).addClass('highlight');
	})	
}

function iswin(matches){
		var i = 0;
		if(matches.length == 0) return false;
		return matches.every(function(x){
			return x == goal[i++];
		})
}


function onFlags(element){
	if(event.keyCode == 13) {
		var input = element.value;
		try{
			var re = new RegExp('',input);
		}
		catch(SyntaxError){
			$('#flagsInput').css({"border": '#FF0000 2px solid'});
			return;
		}
		$('#flagsInput').css({"border": ''});
		flags = input;
		$('#regexInput').trigger(enter);
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
	$('.status').replaceWith("<p class='good'>"+stringToMatch+"</p><p class='text'>"+stringToMatch+"</p>")
	$(".good").lettering();
	$(".text").lettering();
	// var good  = new Mark(document.querySelector('.good'))
	// myText  = new Mark(document.querySelector('#mine .text'))
	// opponentText  = new Mark(document.querySelector('#opponent .text'))
	// good.mark(goal[0],{className:'goodHighlight'});
})

socket.on('message', function(regexString){
		// input is 'regex/flags'
		var regexText = regexString.slice(0,regexString.lastIndexOf('/'));
		var flagText = regexString.split('/').pop();
		try{
			var re = new RegExp(regexText, flagText);
		}
		catch(SyntaxError){ return; }
		highlightRegExp(re, '#opponent .text');
})

socket.on('disconnected', function(notUsed){
	console.log('opponent disconnected');
	waitForChallenger();
});

socket.on('loss', function(notUsed){
	alert('You lost! Better luck next time');
	waitForChallenger(); // if loss is called before p2 connects this is a problem!
});
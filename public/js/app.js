var socket = io();

var stringToMatch;
var goal;
var myText;
var opponentText;
var flags = ''
var enter = $.Event( 'keyup', { keyCode: 13, which: 13 } );

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) { 
      return index + start;  
  });
//http://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-an-array-based-on-suppl
}

$('#regexInput').on('keyup',function(event) {
	var regexString = $('#regexInput').val();

	try{
		var re = new RegExp(regexString,flags);
	}
	catch(SyntaxError){
		$('#regexInput').css({"border": '#FF0000 2px solid'});
		return;
	}
	$('#regexInput').css({"border": ''})
	matches = highlightRegExp(re,'#mine .text')

	if(iswin(matches)){
		// go to win page w/ score
		// or pop up alert
		if(confirm('you won! ' + String(1000-regexString.length) + ' points')){
			location.reload();
		}
		else{
			window.location = '/';
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
		if(matches == null || matches.length == 0 || matches.length != goal.length) return false;
		return matches.every(function(x){
			return x == goal[i++];
		})
}


function onFlags(event){
	var input = $('#flagsInput').val();
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

function waitForChallenger(){
	$('#status').text('waiting for another player to connect');
	socket.emit('ready','');
	console.log('waiting');
}

socket.emit('newPlayer','');
$('#flagsInput').on('keyup',onFlags);
waitForChallenger();

socket.on('connected', function(challenge){
	console.log(challenge);
	stringToMatch = challenge.stringToMatch;
	goal = challenge.goal;
	$('.status').replaceWith("<p class='good'>"+goal.join('\n')+"</p><p class='text'>"+stringToMatch+"</p>")
	$(".good").lettering();
	$(".text").lettering();
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
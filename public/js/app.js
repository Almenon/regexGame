var socket = io();

var stringToMatch;
var goal;
var myText;
var opponentText;
var flags = ''
var enter = $.Event( 'keyup', { keyCode: 13, which: 13 } );
var startTime;

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) { 
      return index + start;  
  });
//http://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-an-array-based-on-suppl
}

$('#regexInput').on('keyup',function(event) {
	var regexString = $('#regexInput').val();
	socket.emit('message',regexString + '/' + flags)

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
		var endTime = new Date();
		var numSeconds = Math.floor((endTime - startTime)/1000);
		var score = 500-regexString.length-numSeconds
		socket.emit('won',String(score))
		$('#winModal').modal();
		$('#score').text(String(score) + ' points');
		$('#playAgain').on('click',function(){
			location.reload();
		});
	}
});

function highlightRegExp(re,element){
	// highlights lettering.js expanded element according to regex
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
	//highlights lettering.js expanded element according to indices of regex match
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
	$('.status').text('Waiting for another player to connect...');
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
	startTime = new Date();
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
	alert('opponent disconnected!')
	location.reload();
});

socket.on('loss', function(notUsed){
	alert('You lost! Better luck next time');
	location.reload();
});
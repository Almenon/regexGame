var socket = io();

var stringToMatch;
var goal;
var myText;
var opponentText;
var flags = ''
var enter = $.Event( 'keyup', { keyCode: 13, which: 13 } );
var startTime;
var regexString;

function range(start, count) {
  return Array.apply(0, Array(count))
	.map(function (element, index) { 
	  return index + start;  
  });
//http://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-an-array-based-on-suppl
}

$('#regexInput').on('keyup',function(event) {
	regexString = $('#regexInput').val();
	try{
		var re = new RegExp(regexString,flags);
	}
	catch(SyntaxError){
		$('#regexInput').css({"border": '#FF0000 2px solid'});
		return;
	}
	socket.emit('message',regexString + '/' + flags)

	$('#regexInput').css({"border": ''})
	highlightRegExp(re,'#mine .text')
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

socket.emit('joinRoom','');
$('#flagsInput').on('keyup',onFlags);
waitForChallenger();

function highlightByNums(nums){
	nums.forEach(function(num){
		$('.char'+num).addClass('good')
	})
}

socket.on('connected', function(challenge){
	console.log(challenge);
	stringToMatch = challenge.stringToMatch;
	goal = challenge.goal;
	startTime = new Date();
	$('.status').replaceWith("<p class='goal'>"+stringToMatch+"</p><p class='text'>"+stringToMatch+"</p>")
	$(".good").lettering();
	$(".text").lettering();
	highlightByNums(goal)
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

socket.on('won', function(notUsed){
	// go to win page w/ score
	// or pop up alert
	var endTime = new Date();
	var numSeconds = Math.floor((endTime - startTime)/1000);
	var score = 500-regexString.length-numSeconds
	socket.emit('won',String(score))
	$('#winModal').modal();
	$('#score').html('<p>You solved the challenge in <b>' + String(numSeconds) + '</b> seconds using <b>' + String(regexString.length) + '</b> characters for a total of <b>' + String(score) + '</b> points!</p>');
	$('#playAgain').on('click',function(){
		location.reload();
	});
})
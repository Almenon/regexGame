
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
var challenges = hard.concat(easy);
var index = Math.floor(Math.random()*challenges.length)
var stringToMatch = challenges[index].text
var goal = challenges[index].goal
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
//http://stackoverflow.com/questions/3895478
}

$('#regexInput').on('keyup',function(event) {
	regexString = $('#regexInput').val();
	handleInput(regexString,flags)
});

function handleInput(regexString,flags){
	try{
		var re = new RegExp(regexString,flags);
	}
	catch(SyntaxError){
		$('#regexInput').css({"border": '#FF0000 2px solid'});
		return false;
	}
	$('#regexInput').css({"border": ''})
	matches = highlightRegExp(re,'#mine .text')

	if(iswin(matches)){
		// go to win page w/ score
		// or pop up alert
		var endTime = new Date();
		var numSeconds = Math.floor((endTime - startTime)/1000);
		var score = 500-regexString.length-numSeconds
		$('#winModal').modal();
		$('#score').text(String(score) + ' points');
		$('#playAgain').on('click',function(){
			location.reload();
		});
		return "win";
	}
	else return "noWin";	
}



function highlightRegExp(re,element){
	$(element + ' span').removeClass('highlight');
	matches = [];

	if(flags.search('g') > -1){ // when IE supports re.flags use that instead
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

$('#flagsInput').on('keyup',function(event){
	changeFlags($('#flagsInput').val());
});

function changeFlags(input){
	try{
		var re = new RegExp('',input);
	}
	catch(SyntaxError){
		$('#flagsInput').css({"border": '#FF0000 2px solid'});
		return false;
	}
	$('#flagsInput').css({"border": ''});
	flags = input;
	handleInput(regexString,flags);
}

function highlightByNums(nums){
	nums.forEach(function(num){
		$('.char'+num).addClass('good')
	})
}

$('.status').replaceWith("<p class='text'></p>")
$('.text').text(stringToMatch)
$(".text").lettering();
startTime = new Date();
highlightByNums(goal)


function y(){
	var challenge = {
		'text':stringToMatch,
		'goal':[]
	}
	for(x of $('.highlight')){
		charClass = x.getAttribute('class')
		numberString = charClass.replace(/[^\d]/g,'')
		number = parseInt(numberString)
		challenge.goal.push(number)
	}

	return JSON.stringify(challenge)
}
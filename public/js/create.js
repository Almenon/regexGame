var stringToMatch;
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

$('textarea').on('keyup',function(event) {
	stringToMatch = $('textarea').val()
	$('#fe').text(stringToMatch); // put input in span for lettering
	$('#fe').lettering();
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
	highlightRegExp(re,'#af')	
}



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

$('#flagsInput').on('keyup',function(event){
	changeFlags($('#flagsInput').val());
});

$('#textInput').on('keyup',function(event){
	handleInput(regexString,flags);
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
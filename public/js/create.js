var stringToMatch;
var flags = ''
var enter = $.Event( 'keyup', { keyCode: 13, which: 13 } );
var regexString;

$('textarea').on('keyup',function(event) {
	stringToMatch = $('textarea').val()
	$('#text').text(stringToMatch); // put input in span for lettering
	$('#text').lettering();
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
	highlightRegExp(re,'#textContainer')	
}

$('#textInput').on('keyup',function(event){
	handleInput(regexString,flags);
});

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
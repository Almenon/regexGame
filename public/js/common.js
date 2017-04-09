regexString = '';
flags = ''
enter = $.Event( 'keyup', { keyCode: 13, which: 13 } );

//methods common to create.js and practice.js

function changeFlags(input){
	try{
		RegExp('',input);
	}
	catch(SyntaxError){
		$('#flagsInput').css({"border": '#FF0000 2px solid'});
		return false;
	}
	$('#flagsInput').css({"border": ''});
	flags = input;
	handleInput(regexString,flags);
}

function highlightRegExp(re,element){
	$(element + ' span').removeClass('highlight');
	var matches = []; var match;

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
	var letters = range(match.index+1, match[0].length)
	letters.forEach(function(letterNum){
		$(element + ' span.char'+ letterNum.toString()).addClass('highlight');
	})	
}

function range(start, count) {
  return Array.apply(0, Array(count))
	.map(function (element, index) { 
		return index + start;  
  });
//http://stackoverflow.com/questions/3895478
}

$('#flagsInput').on('keyup',function(event){
	changeFlags($('#flagsInput').val());
});

$('#regexInput').on('keyup',function(event) {
	regexString = $('#regexInput').val();
	handleInput(regexString,flags)
});
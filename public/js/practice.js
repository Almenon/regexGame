var possibilities = ['cat\nbat\nsat\nlat\nrat\nmat\nfat\nzat',
'123\n1231254215134234234243.\nwhy.\nlol.','dude@gmail.com\nbobalex@yahoo.com duh\nwhat is the flight speed of an african ostrich?']
var goals = [['cat','bat','sat','lat','rat','mat','fat'],
['123','1231254215134234234243'],
['dude@gmail.com','bobalex@yahoo.com']];
var index = Math.floor(Math.random()*goals.length)
var stringToMatch = possibilities[index]
var goal = goals[index];
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
			return x[0] == goal[i++];
		})
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

$('.status').replaceWith("<p class='good'>"+goal.join('\n')+"</p><p class='text'>"+stringToMatch+"</p>")
$(".good").lettering();
$(".text").lettering();
startTime = new Date();

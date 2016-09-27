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

function range(start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) { 
      return index + start;  
  });
//http://stackoverflow.com/questions/3895478
}

function onInput(element) {

	if(event.keyCode == 13) {
		var regexString = element.value;

		try{
			var re = new RegExp(regexString,flags);
		}
		catch(SyntaxError){
			$('#regexinput').effect('shake');
			return;
		}

		matches = highlightRegExp(re,'#mine .text')


		if(iswin(matches)){
			// go to win page w/ score
			// or pop up alert
			alert('you won! ' + String(1000-regexString.length) + " points");			
		}
    }
}

function highlightRegExp(re,element){
	$(element + ' span').removeClass('highlight');
	matches = [];

	if(re.flags.search('g') > -1){
		while((match = re.exec(stringToMatch)) != null){
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
	}
}

$('.status').replaceWith("<p class='good'>"+stringToMatch+"</p><p class='text'>"+stringToMatch+"</p>")
$(".good").lettering();
$(".text").lettering();
//var good  = new Mark(document.querySelector('.good'))
//myText  = new Mark(document.querySelector('#mine .text'))
//opponentText  = new Mark(document.querySelector('#opponent .text'))
//good.mark(goal[0],{className:'goodHighlight'});
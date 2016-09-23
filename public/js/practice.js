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


function onInput(element) {

	if(event.keyCode == 13) {
		var regexString = element.value;

		if(regexString == ''){ // another edge case
			myText.unmark();
			return;
		}

		try{
			var re = new RegExp(regexString,flags);
		}
		catch(SyntaxError){
			$('#regexinput').effect('shake');
			return;
		}
		if(flags.search('g') > -1){
			myText.unmark().markRegExp(re,{className: 'highlight',debug: true});	
		}
		else{
			myText.unmark().markRegExp(re,
				{className: 'highlight',
				debug: true,
				});			
		}


		if(iswin(regexString)){
			// go to win page w/ score
			// or pop up alert
			alert('you won! ' + String(1000-regexString.length) + " points");			
		}
    }
}

function iswin(regexString){
		if(flags.search('g') == -1){
			re = new RegExp(regexString,flags+'g')
		}
		matches = re.exec(stringToMatch);
		if(matches == null || matches.length == 1) return;
		matches.shift(); // get rid of useless first result
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
var good  = new Mark(document.querySelector('.good'))
myText  = new Mark(document.querySelector('#mine .text'))
opponentText  = new Mark(document.querySelector('#opponent .text'))
// have to use document.querySelector
// unless you use mark.js jquery plugin
good.mark(goal[0],{className:'goodHighlight'});
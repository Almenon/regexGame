
var good  = new Mark(document.querySelector('#good'))
var text  = new Mark(document.querySelector('#text'))
// have to use document.querySelector
// unless you use mark.js jquery plugin
good.mark('e',{className:'goodHighlight'});


function onInput(element) {

	if(event.keyCode == 13) {
		try{
			var re = new RegExp(element.value);
		}
		catch(SyntaxError){
			$('#regexinput').effect('shake');
			return;
		}
		
		text.unmark().markRegExp(re,{className: 'highlight'});
		//$('p').highlightRegex(); // clear old highlight
		//$('p').highlightRegex(re);
		element.value = '';
    }
}

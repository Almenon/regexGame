
var good  = new Mark($('#good'))
var text  = new Mark($('#text'))
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

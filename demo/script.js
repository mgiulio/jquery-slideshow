var
	ssElem = $('#slideshow'),
	ssInstance = ssElem.slideshow().data('slideshow'),
	enableDisable = $('#frame button')
;

(function() {
	var
		out = '',
		transitions = ssInstance.getTransitions(),
		numTransitions = transitions.length,
		currTrans = ssInstance.option('transition'),
		i = 0, 
		tn
	;
	for (; i < numTransitions; ++i) {
		tn = transitions[i];
		out += '<li><input type="radio" name="curr-trans" id="' + tn + '" value="' + 
		tn + '"' + 
		(tn === currTrans? ' checked="checked"' : '') + 
		'>' +
		'<label for="' + tn + '">' + tn + '</label></li>';
	}
	$('#transitions').append(out);
})();

enableDisable = enableDisable.add('#frame input[type="radio"]');

$('#frame #controls').delegate('button', 'click', function(e) {
	enableDisable.attr('disabled', 'disabled');
	ssInstance[$(e.target).text().toLowerCase()]();
	e.stopPropagation();
});
		
ssElem.bind('slideshowaftertransition', function() {
	//transBtns.attr('disabled', '');
	enableDisable.removeAttr('disabled');
});

$('#frame #transitions').delegate('input', 'click', function(e) {
	ssInstance.option('transition', e.target.value.toLowerCase());
});
var
	ssElem = $('#slideshow'),
	ssInstance = ssElem.slideshow({current: 2}).data('slideshow'),
	enableDisable = $('#frame button')
;

// Generate markup for transitions UI elements
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
	
	$('#transitions')
		.append(out)
		.delegate('input', 'click', function(e) {
			ssInstance.option('transition', e.target.value.toLowerCase());
			e.stopPropagation();
		});
	
	enableDisable = enableDisable.add('#frame input[type="radio"]');
})();

// Generate markup for images goto
(function() {
	var
		numImages = ssElem.find('> img').length,
		out = '',
		i
	;
	
	for (i = 0; i < numImages; ++i)
		out += '<input type="radio" name="goto" value="' + i + '">';
		
	$('#goto')
		.append(out)
		.delegate('input', 'change', function(e) {
			enableDisable.attr('disabled', 'disabled');
			ssInstance.option('current', e.target.value);
			e.stopPropagation();
		});
	
	enableDisable = enableDisable.add('#frame #goto input[type="radio"]');
	
	$('#goto > input').get(ssInstance.option('current')).checked="checked";
})();


$('#frame #controls').delegate('button', 'click', function(e) {
	enableDisable.attr('disabled', 'disabled');
	ssInstance[$(e.target).text().toLowerCase()]();
	e.stopPropagation();
});

ssElem.bind('slideshownewimage', function(e, data) {
	//transBtns.attr('disabled', '');
	enableDisable.removeAttr('disabled');
	$('#goto > input').get(data.imageIndex).checked="checked";
});
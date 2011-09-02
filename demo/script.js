var
	ss = $('#slideshow').slideshow(),
	buttons = $('#frame #control button')
;

(function() {
	var
		out = '',
		transitions = ss.slideshow('getTransitions'),
		numTransitions = transitions.length,
		currTrans = ss.slideshow('option', 'transition'),
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

$('#frame #controls').delegate('button', 'click', function(e) {
	buttons.attr('disabled', 'disabled');
	ss.slideshow($(e.target).text().toLowerCase());
	e.stopPropagation();
});
		
ss.bind('slideshowaftertransition', function() {
	//transBtns.attr('disabled', '');
	buttons.removeAttr('disabled');
});

$('#frame #transitions').delegate('input', 'click', function(e) {
	ss.slideshow('option', 'transition', e.target.value.toLowerCase());
});


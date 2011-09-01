var
	ss = $('#slideshow').slideshow(),
	buttons = $('#frame #control button')
;

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


var
	ss = $('#slideshow').slideshow(),
	buttons = $('#gui button')
;
		
ss.bind('slideshowaftertransition', function() {
	//transBtns.attr('disabled', '');
	buttons.removeAttr('disabled');
});

$('#gui').delegate('button', 'click', function(e) {
	buttons.attr('disabled', 'disabled');
	e.stopPropagation();
});

$('#sliding-door').delegate('button', 'click', function(e) {
	ss.slideshow('option', 'transition', 'sliding door ' + $(e.target).text());
	ss.slideshow('play');
});

/* $('#sliding-doors').delegate('button', 'click', function(e) {
	ss.slideshow('option', 'transition', 'sliding doors + $(e.target).text());
	ss.slideshow('play');
}); */

/* $('#slide').delegate('button', 'click', function(e) {
	play('slide');
}); */

/* $('#none').click(function() {
	play('none');
	return false;
}); */

/* $('#cross-fade').click(function() {
	play('cross-fade');
}); */

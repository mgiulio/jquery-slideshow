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
	ss.slideshow('next');
});

$('#sliding-doors').delegate('button', 'click', function(e) {
	ss.slideshow('option', 'transition', 'sliding doors ' + $(e.target).text());
	ss.slideshow('next');
});

$('#slide').delegate('button', 'click', function(e) {
	ss.slideshow('option', 'transition', 'slide ' + $(e.target).text());
	ss.slideshow('next');
});

$('#none').click(function() {
	ss.slideshow('option', 'transition', 'none');
	ss.slideshow('next');
	return false;
});

$('#cross-fade').click(function() {
	ss.slideshow('option', 'transition', 'cross fade');
	ss.slideshow('next');
});

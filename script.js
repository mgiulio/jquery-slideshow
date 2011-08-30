var
	slideshow = new Slideshow({
		node: '#slideshow'
	}),
	buttons = $('#gui button')
;
		
$('#slideshow').bind('afterTransition', function() {
	//transBtns.attr('disabled', '');
	buttons.removeAttr('disabled');
});

$('#gui').delegate('button', 'click', function(e) {
	buttons.attr('disabled', 'disabled');
	e.stopPropagation();
});

$('#sliding-door').delegate('button', 'click', function(e) {
	slideshow.setTransition('sliding door', {dir: $(e.target).text()});
	slideShow.play();
});

$('#sliding-doors').delegate('button', 'click', function(e) {
	setTransition('sliding doors', {axis: $(e.target).text()});
	slideshow.play();
});

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

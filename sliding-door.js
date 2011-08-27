(function() {

transitions['slidingDoor'] = css3Transitions;

function css3Transitions(dir) {
	var
		front = buff[visibleBuff],
		duration = 3000
	;
	
	front
		.css({
			'-webkit-transition-property': 'left',
			'-webkit-transition-duration': duration + 'ms',
		})
		.css('left', -frameWidth +'px')
	;
	
	front.bind('webkitTransitionEnd', function() {
		front.css('-webkit-transition-property', 'none');
		transitions._afterTransition();
	});
	
	/* -moz-transition-property: padding;
			-moz-transition-duration: 250ms;
			-o-transition-property: padding;
			-o-transition-duration: 250ms;
			transition-property: padding;
			transition-duration: 250ms; */
}

function jQueryAnimate(dir) {
	var
		front = buff[visibleBuff],
		duration = 3000,
		prop = {},
		axis,
		sgn,
		offset
	;
	switch (dir) {
		case 'top':
			axis = 'top';
			sgn = -1;
			offset = frameHeight;
			break;
		case 'right':
			axis = 'left';
			sgn = 1;
			offset = frameWidth;
			break;
		case 'bottom':
			axis = 'top';
			sgn = 1;
			offset = frameHeight;
			break;
		case 'left':
			axis = 'left';
			sgn = -1;
			offset = frameWidth;
			break;
	}
	
	prop[axis] = sgn * offset + 'px';
	
	front.animate(
		prop,
		duration,
		'easeOutQuad',
		transitions._afterTransition
	);
}
		
})();

(function() {

transitions['sliding door'] = Object.create(transition, {
	play: {
		value: Modernizr.csstransitions ? css3Transitions : jQueryAnimate
	}
});

function css3Transitions(dir, done) {
	this.front
		.css({
			'-webkit-transition-property': 'left',
			'-webkit-transition-duration': this.duration + 'ms',
		})
		.css('left', -this.frameWidth +'px')
	;
	
	this.front.bind('webkitTransitionEnd', function() {
		$(this).css('-webkit-transition-property', 'none');
		done();
	});
	
	/* -moz-transition-property: padding;
			-moz-transition-duration: 250ms;
			-o-transition-property: padding;
			-o-transition-duration: 250ms;
			transition-property: padding;
			transition-duration: 250ms; */
}

function jQueryAnimate(dir, done) {
	var
		prop = {},
		axis,
		sgn,
		offset
	;
	
	switch (dir) {
		case 'top':
			axis = 'top';
			sgn = -1;
			offset = this.frameHeight;
			break;
		case 'right':
			axis = 'left';
			sgn = 1;
			offset = this.frameWidth;
			break;
		case 'bottom':
			axis = 'top';
			sgn = 1;
			offset = this.frameHeight;
			break;
		case 'left':
			axis = 'left';
			sgn = -1;
			offset = this.frameWidth;
			break;
	}
	
	prop[axis] = sgn * offset + 'px';
	
	this.front.animate(
		prop,
		this.duration,
		'easeOutQuad',
		done
	);
}
		
})();

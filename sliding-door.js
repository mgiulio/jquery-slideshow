(function() {

transitions['sliding door'] = Object.create(transition, {
	play: {
		value: $.support['transitionProperty'] ? css3Transitions : jQueryAnimate
	}
});

function css3Transitions(dir, done) {
	this.front
		.css({
			'transition-property': 'left',
			'transition-duration': this.duration + 'ms',
		})
		.one($.support['transitionend'], function() {
			$(this).css('transition-property', 'none');
			done();
		})
		.css('left', -this.frameWidth +'px')
	;
}

function jQueryAnimate(dir, done) {
	var
		prop = {},
		axis,
		sgn,
		offset
	;
	
	dir = 'left'; // TODO
	
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

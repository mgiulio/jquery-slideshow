(function() {

transitions['sliding door'] = $.extend(Object.create(transition), {
	play: $.support['transitionProperty'] ? css3Transitions : jQueryAnimate,
	dir: 'left',
	cfg: function(cfg) {
		if ('dir' in cfg)
			this.dir = cfg.dir;
	}
});

function css3Transitions() {
	var self = this;
	
	this.front
		.css({
			'transition-property': 'left',
			'transition-duration': this.duration + 'ms',
		})
		.one($.support['transitionend'], function() {
			$(this).css('transition-property', 'none');
			self.done();
		})
		.css('left', -this.frameWidth +'px')
	;
}

function jQueryAnimate() {
	var
		prop = {},
		axis,
		sgn,
		offset
	;

	switch (this.dir) {
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
		this.done
	);
}
		
})();

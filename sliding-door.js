transitions['sliding door'] = $.extend(Object.create(transition), {
	dir: 'left',
	cfg: function(cfg) {
		if ('dir' in cfg)
			this.dir = cfg.dir;
	},
	play: function() {
		var 
			self = this,
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
		
		if ($.support['transitionProperty']) {
			this.front
				.css({
					'transition-property': axis,
					'transition-duration': this.duration + 'ms',
				})
				.one($.support['transitionend'], function() {
					$(this).css('transition-property', 'none');
					self.done();
				})
				.css(axis, prop[axis])
			;
		}
		else
			this.front.animate(
				prop,
				this.duration,
				'easeOutQuad',
				this.done
			);
	}
});
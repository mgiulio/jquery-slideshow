Slideshow.prototype.transitions['sliding doors'] = $.extend(Object.create(Slideshow.prototype.transition), {
	axis: 'horizontal',
	cfg: function(cfg) {
		if ('axis' in cfg)
			this.axis = cfg.axis;
	},
	play: function() {
		var 
			self = this,
			zIndex = this.front.css('zIndex'),
			doorCss = {
				position: 'absolute',
				backgroundImage: 'url(' + this.front.attr('src') + ')',
				zIndex: zIndex
			},
			doors = [
				{
					node: $('<div class="left-door"></div>'), // FIXME
					css: $.extend({}, doorCss, this.axis === 'horizontal' ?
						{
							width: this.frameWidth / 2 + 'px',
							height: this.frameHeight + 'px',
							left: 0,
							top: 0,
							backgroundPosition: 'left top'
						}
						:
						{
							width: this.frameWidth + 'px',
							height:  this.frameHeight / 2 + 'px',
							left: 0,
							top: 0,
							backgroundPosition: 'left top'
						}),
					animCss: this.axis === 'horizontal' ? 
						{left: -this.frameWidth/2 + 'px'} :
						{top: -this.frameHeight + 'px'}
				},
				{
					node: $('<div class="right-door"></div>'), //FIXME
					css: $.extend({}, doorCss, this.axis === 'horizontal' ?
						{
							width: this.frameWidth / 2 + 'px',
							height: this.frameHeight + 'px',
							right: 0,
							top: 0,
							backgroundPosition: 'right top'
						}
						:
						{
							width: this.frameWidth + 'px',
							height:  this.frameHeight / 2 + 'px',
							left: 0,
							bottom: 0,
							backgroundPosition: 'left bottom'
						}),
					animCss: this.axis === 'horizontal' ? 
						{right: -this.frameWidth/2 + 'px'} :
						{bottom: -this.frameHeight + 'px'}
				}
			],
			d0 = doors[0],
			d1 = doors[1]
		;
		
		slideshow.append(
			d0.node.css(d0.css),
			d1.node.css(d1.css)
		);
	
		this.front.hide();

		$.when(
			d0.node.animate(
				d0.animCss,
				this.duration,
				'easeOutQuad'
			),
			d1.node.animate(
				d1.animCss,
				this.duration,
				'easeOutQuad'
			)
		).then(function() {
			d0.node.remove();
			d1.node.remove();
			self.done();
		});
	}
});
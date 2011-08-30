function Slideshow(cfg) {
	this.node = $(cfg.node);
	
	this.buff = [$(new Image()), $(new Image())];
	
	this.backIndex = 1;
	this.frontIndex = 2;
	
	this.preloadImages(function() {
		this.node.css({
			position: 'relative',
			overflow: 'hidden'
		});
		
		this.frameWidth = this.node.width();
		this.frameHeight = this.node.height();
		
		this.transition.frameWidth = this.frameWidth;
		this.transition.frameHeight = this.frameHeight;
		this.transition.duration = 1000;
		var self = this;
		this.transition.done = function() {
			// Adjust the new front buffer
			self.buff[1-this.visibleBuff].css({zIndex: self.frontIndex});
			
			// Adjust the new back buffer
			self.buff[self.visibleBuff]
				.css({
					zIndex: self.backIndex
				})
				.css({
					left: 0,
					top: 0
				})
				.show()
			;
			
			self.visibleBuff = 1 - self.visibleBuff;
			
			node.trigger('afterTransition');
		};
		
		this.buff[0]
			.css({
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: this.backIndex
			})
			.attr('src', this.images[0].src)
			//.width(frameWidth)
			//.height(frameHeight)
		;
		
		this.buff[1]
			.css({
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: this.frontIndex
			})
			.attr('src', this.images[1].src)
			//.width(frameWidth)
			//.height(frameHeight)
		;
		
		this.node.append(buff[0], buff[1]);
		
		this.visibleBuff = 1;
		
		this.currTrans = null
	});
}

$.extend(Slideshow.prototype, {
	transitions: {
	},
	transition = {},
	setTransition: function(name, cfg) {
		currTrans = transitions[name];
		if (cfg)
			currTrans.cfg(cfg);
	},
	play: function() {
		transition.front = buff[visibleBuff];
		transition.back = buff[1-visibleBuff];
		currTrans.play(); 
	},
	_preloadImages: function(done) {
		var count, img;
		
		this.images = this.node.find('img');
		count = images.length;
		
		images.each(function(index, element) {
			img = new Image();
			img.onload = function() {
				if (--count === 0)
					done();
			};
			img.src = element.src;
		});
	}
});
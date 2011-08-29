var
	slideshow = $('#slideshow'),
	buff = [$(new Image()), $(new Image())],
	visibleBuff,
	backIndex = 1,
	frontIndex = 2,
	frameWidth, frameHeight,
	transitions = {},
	transition = {},
	currTrans = null
;

function initSlideshow() {
	slideshow.css({
		position: 'relative',
		overflow: 'hidden'
	});
	
	frameWidth = slideshow.width();
	frameHeight = slideshow.height();
	
	transition.frameWidth = frameWidth;
	transition.frameHeight = frameHeight;
	transition.duration = 1000;
	transition.done = function() {
		// Adjust the new front buffer
		buff[1-visibleBuff].css({zIndex: frontIndex});
		
		// Adjust the new back buffer
		buff[visibleBuff]
			.css({
				zIndex: backIndex
			})
			.css({
				left: 0,
				top: 0
			})
			.show()
		;
		
		visibleBuff = 1 - visibleBuff;
		
		$('#slideshow').trigger('afterTransition');
	};
	
	buff[0]
		.css({
			position: 'absolute',
			left: 0,
			top: 0,
			zIndex: backIndex
		})
		.attr('src', images[0])
		//.width(frameWidth)
		//.height(frameHeight)
	;
	
	buff[1]
		.css({
			position: 'absolute',
			left: 0,
			top: 0,
			zIndex: frontIndex
		})
		.attr('src', images[1])
		//.width(frameWidth)
		//.height(frameHeight)
	;
	
	slideshow.append(buff[0], buff[1]);
	
	visibleBuff = 1;
}

function setTransition(name, cfg) {
	currTrans = transitions[name];
	if (cfg)
		currTrans.cfg(cfg);
}

function play() {
	transition.front = buff[visibleBuff];
	transition.back = buff[1-visibleBuff];
	currTrans.play(); 
}
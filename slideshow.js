var
	slideshow = $('#slideshow'),
	buff = [$(new Image()), $(new Image())],
	visibleBuff,
	backIndex = 1,
	frontIndex = 2,
	frameWidth, frameHeight
;

function initSlideshow() {
	slideshow.css({
		position: 'relative',
		overflow: 'hidden'
	});
	
	frameWidth = slideshow.width();
	frameHeight = slideshow.height();
	
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

function slidingDoor(dir) {
	var
		front = buff[visibleBuff],
		back = buff[1-visibleBuff],
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
		afterTransition
	); // 100% works?
}

function slidingDoors(axis) {
	var
		front = buff[visibleBuff],
		back = buff[1-visibleBuff],
		duration = 3000,
		zIndex = front.css('zIndex'),
		doorCss = {
			position: 'absolute',
			backgroundImage: 'url(' + front.attr('src') + ')',
			zIndex: zIndex
		},
		doors = [
			{
				node: $('<div class="left-door"></div>'), // FIXME
				css: $.extend({}, doorCss, axis === 'horizontal' ?
					{
						width: frameWidth / 2 + 'px',
						height: frameHeight + 'px',
						left: 0,
						top: 0,
						backgroundPosition: 'left top'
					}
					:
					{
						width: frameWidth + 'px',
						height:  frameHeight / 2 + 'px',
						left: 0,
						top: 0,
						backgroundPosition: 'left top'
					}),
				animCss: axis === 'horizontal' ? 
					{left: -frameWidth/2 + 'px'} :
					{top: -frameHeight + 'px'}
			},
			{
				node: $('<div class="right-door"></div>'), //FIXME
				css: $.extend({}, doorCss, axis === 'horizontal' ?
					{
						width: frameWidth / 2 + 'px',
						height: frameHeight + 'px',
						right: 0,
						top: 0,
						backgroundPosition: 'right top'
					}
					:
					{
						width: frameWidth + 'px',
						height:  frameHeight / 2 + 'px',
						left: 0,
						bottom: 0,
						backgroundPosition: 'left bottom'
					}),
				animCss: axis === 'horizontal' ? 
					{right: -frameWidth/2 + 'px'} :
					{bottom: -frameHeight + 'px'}
			}
		],
		d0 = doors[0],
		d1 = doors[1]
	;
	
	slideshow.append(
		d0.node.css(d0.css),
		d1.node.css(d1.css)
	);
	front.hide();

	$.when(
		d0.node.animate(
			d0.animCss,
			duration,
			'easeOutQuad'
		),
		d1.node.animate(
			d1.animCss,
			duration,
			'easeOutQuad'
		)
	).then(function() {
		d0.node.remove();
		d1.node.remove();
		afterTransition();
	});
}

function none() {
	afterTransition();
}

// Called by every transition to set the stage for the next one
function afterTransition() {
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
	
	slideshow.trigger('afterTransition');
}
transitions.slidingDoors = function (axis) {
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
		transitions._afterTransition();
	});
};
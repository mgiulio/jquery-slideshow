transitions['slide'] = function(dir) {
	var
		front = buff[visibleBuff],
		back = buff[1-visibleBuff],
		duration = 1000
	;
	
	switch (dir) {
		case 'left':
			back.css({
				left: frameWidth + 'px',
			});
			
			$.when(
				front.animate(
					{left: -frameWidth + 'px'}, 
					duration, 
					'linear'
				),
				back.animate(
					{left: 0}, 
					duration, 
					'linear'
				)
			).then(transitions._afterTransition());
			break;
		case 'right':
			back.css({
				left: -frameWidth + 'px',
			});
			
			$.when(
				front.animate(
					{left: frameWidth + 'px'}, 
					duration, 
					'linear'
				),
				back.animate(
					{left: 0}, 
					duration, 
					'linear'
				)
			).then(transitions._afterTransition());
			break;
		default:
	}
};
	
	
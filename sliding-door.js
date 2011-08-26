transitions.slidingDoor = function(dir) {
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
		transitions._afterTransition
	); // 100% works?
};
	
	
transitions['cross fade'] = function() {
	var
		front = buff[visibleBuff],
		back = buff[1-visibleBuff],
		duration = 3000
	;
	
	$.when(
		front.fadeOut(duration),
		back.fadeIn(duration)
	).done(function() {
		transitions._afterTransition();
	});
};
	
	
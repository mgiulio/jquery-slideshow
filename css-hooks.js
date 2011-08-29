(function($) {

if (!$.cssHooks) {
	throw("jQuery 1.4.3+ is needed for this plugin to work");
	return;
}

function styleSupport(prop) {
	var 
		vendorProp, 
		supportedProp,
		capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
		prefixes = [ "Moz", "Webkit", "O", "ms" ],
		div = document.createElement( "div" );

	if ( prop in div.style )
		supportedProp = prop;
	else
		for ( var i = 0; i < prefixes.length; i++ ) {
			vendorProp = prefixes[i] + capProp;
			if ( vendorProp in div.style ) {
				supportedProp = vendorProp;
				break;
			}
		}

	div = null;
 
	$.support[prop] = supportedProp
	return supportedProp;
}

/*
 * border-radius
 */
var borderRadius = styleSupport('borderRadius');
// Set cssHooks only for browsers that
// support a vendor-prefixed border radius
if (borderRadius && borderRadius !== 'borderRadius')
	$.cssHooks.borderRadius = {
		get: function(elem, computed, extra ) {
			return $.css(elem, borderRadius);
		},
		set: function(elem, value) {
			elem.style[borderRadius] = value;
		}
	};
  
/*
 * CSS3 Transitions
 */
var transitionProperty = styleSupport('transitionProperty');
if (transitionProperty && transitionProperty !== 'transitionProperty' )
	$.cssHooks.transitionProperty = {
		get: function( elem, computed, extra ) {
			return $.css( elem, transitionProperty);
		},
		set: function( elem, value) {
			elem.style[transitionProperty] = value;
		}
	};

var transitionDuration = styleSupport('transitionDuration');
if (transitionDuration && transitionDuration !== 'transitionDuration' )
	$.cssHooks.transitionDuration = {
		get: function(elem, computed, extra) {
			return $.css(elem, transitionDuration);
		},
		set: function(elem, value) {
			elem.style[transitionDuration] = value;
		}
	};
	
$.support['transitionend'] = 'webkitTransitionEnd'; // FIXME

// var transition-timing

//var ...	
})(jQuery);
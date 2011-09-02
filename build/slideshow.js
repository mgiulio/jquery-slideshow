/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

var slice = Array.prototype.slice;

var _cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	// create the constructor using $.extend() so we can carry over any
	// static properties stored on the existing constructor (if there is one)
	$[ namespace ][ name ] = $.extend( function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new $[ namespace ][ name ]( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	}, $[ namespace ][ name ], { version: prototype.version } );

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( $.isFunction( value ) ) {
			prototype[ prop ] = (function() {
				var _super = function( method ) {
					return base.prototype[ method ].apply( this, slice.call( arguments, 1 ) );
				};
				var _superApply = function( method, args ) {
					return base.prototype[ method ].apply( this, args );
				};
				return function() {
					var __super = this._super,
						__superApply = this._superApply,
						returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply( this, arguments );

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			}());
		}
	});
	$[ namespace ][ name ].prototype = $.widget.extend( basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if (input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				target[ key ] = $.isPlainObject( value ) ? $.widget.extend( {}, target[ key ], value ) : value;
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					object( options, this );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without "new" keyword
	if ( !this._createWidget ) {
		return new $[ namespace ][ name ]( options, element );
	}

	// allow instantiation without initializing for simple inheritance
	// must use "new" keyword (the code above always passes args)
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetName, this );
			this._bind({ remove: "destroy" });
		}

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._bind()
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( "." + this.widgetName );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetBaseClass + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_bind: function( element, handlers ) {
		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
		} else {
			// accept selectors, DOM elements
			element = $( element );
			this.bindings = this.bindings.add( element );
		}

		var instance = this;
		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( instance.options.disabled === true ||
						$( this ).hasClass( "ui-state-disabled" ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}
			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + "." + instance.widgetName,
				selector = match[2];
			if ( selector ) {
				instance.widget().delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._bind( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._bind( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var callback = this.options[ type ],
			args;

		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		data = data || {};

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if ( event.originalEvent ) {
			for ( var i = $.event.props.length, prop; i; ) {
				prop = $.event.props[ --i ];
				event[ prop ] = event.originalEvent[ prop ];
			}
		}

		this.element.trigger( event, data );

		args = $.isArray( data ) ?
			[ event ].concat( data ) :
			[ event, data ];

		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], args ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	$.Widget.prototype._getCreateOptions = function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	};
}

})( jQuery );


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
 
 
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

(function($) {

$.widget('mgiulio.slideshow', {
	options: {
		transition: 'sliding door left',
		duration: 1000
	},
	_create: function() {
		var 
			count, 
			img,
			self = this
		;
		
		this.buff = [$(new Image()), $(new Image())];
		
		this.images = this.element.find('img');
		
		this.element.css({
			position: 'relative',
			overflow: 'hidden'
		});
		
		this.frameWidth = this.element.width();
		this.frameHeight = this.element.height();
		
		this.backIndex = 1;
		this.frontIndex = 2;
		
		this.buff[0]
			.css({
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: this.backIndex
			})
			.appendTo(this.element);
			
		this.buff[1]
			.css({
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: this.frontIndex
			})
			.attr('src', this.images[0].src)
			.appendTo(this.element);
			
		this.visibleBuff = 1;
		
		this.currImgIndex = 0;
	},
	next: function() {
		if (++this.currImgIndex === this.images.length)
			this.currImgIndex = 0;
		this._changeImage();
	},
	prev: function() {
		if (--this.currImgIndex < 0)
			this.currImgIndex = this.images.length - 1;
		this._changeImage();
	},
	goto: function(i) {
		if (this.currImgIndex >= this.images.length)
			this.currImgIndex = this.currImgIndex % this.images.length;
		this._changeImage();
	},
	_changeImage: function() {
		this.front = this.buff[this.visibleBuff];
		this.back = this.buff[1-this.visibleBuff];
		
		this.back.attr('src', this.images[this.currImgIndex].src);

		this._transitions[this.options.transition].call(this);
	},
	_afterTransition: function() {
		// Adjust the new front buffer
		this.buff[1-this.visibleBuff].css({zIndex: this.frontIndex});
		
		// Adjust the new back buffer
		this.buff[this.visibleBuff]
			.css({
				zIndex: this.backIndex
			})
			.css({
				left: 0,
				top: 0
			})
			.show()
		;
		
		this.visibleBuff = 1 - this.visibleBuff;
		
		this._trigger('afterTransition');
	},
	getTransitions: function() {
		var t = [], k;
		for (k in this._transitions)
			if (this._transitions.hasOwnProperty(k) && k.charAt(0) !== '_')
				t.push(k);
		t.sort();
		return t;
	},
	_transitions: {
		'_sliding door': function(dir) {
			var 
				self = this,
				prop = {},
				axis,
				sgn,
				offset
			;
			
			switch (dir) {
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
						'transition-duration': this.options.duration + 'ms',
					})
					.one($.support['transitionend'], function() {
						$(this).css('transition-property', 'none');
						self._afterTransition();
					})
					.css(axis, prop[axis])
				;
			}
			else
				this.front.animate(
					prop,
					this.options.duration,
					'easeOutQuad',
					$.proxy(this, '_afterTransition') 
				);
		},
		'sliding door left': function() {
			this._transitions['_sliding door'].call(this, 'left');
		},
		'sliding door right': function() {
			this._transitions['_sliding door'].call(this, 'right');
		},
		'sliding door top': function() {
			this._transitions['_sliding door'].call(this, 'top');
		},
		'sliding door bottom': function() {
			this._transitions['_sliding door'].call(this, 'bottom');
		},
		'_sliding doors': function(axis) {
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
						css: $.extend({}, doorCss, axis === 'horizontal' ?
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
						animCss: axis === 'horizontal' ? 
							{left: -this.frameWidth/2 + 'px'} :
							{top: -this.frameHeight + 'px'}
					},
					{
						node: $('<div class="right-door"></div>'), //FIXME
						css: $.extend({}, doorCss, axis === 'horizontal' ?
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
						animCss: axis === 'horizontal' ? 
							{right: -this.frameWidth/2 + 'px'} :
							{bottom: -this.frameHeight + 'px'}
					}
				],
				d0 = doors[0],
				d1 = doors[1]
			;
			
			this.element.append(
				d0.node.css(d0.css),
				d1.node.css(d1.css)
			);
		
			this.front.hide();

			$.when(
				d0.node.animate(
					d0.animCss,
					this.options.duration,
					'easeOutQuad'
				),
				d1.node.animate(
					d1.animCss,
					this.options.duration,
					'easeOutQuad'
				)
			).then(function() {
				d0.node.remove();
				d1.node.remove();
				self._afterTransition();
			});
		},
		'sliding doors horizontal': function() {
			this._transitions['_sliding doors'].call(this, 'horizontal');
		},
		'sliding doors vertical': function() {
			this._transitions['_sliding doors'].call(this, 'vertical');
		},
		'cross fade': function() {
			$.when(
				this.front.fadeOut(this.options.duration),
				this.back.fadeIn(this.options.duration)
			).done($.proxy(this, '_afterTransition'));
		},
		'_slide': function(dir) {
			switch (dir) {
				case 'left':
					this.back.css({
						left: this.frameWidth + 'px',
					});
					
					$.when(
						this.front.animate(
							{left: -this.frameWidth + 'px'}, 
							this.options.duration, 
							'linear'
						),
						this.back.animate(
							{left: 0}, 
							this.options.duration, 
							'linear'
						)
					).then($.proxy(this, '_afterTransition'))
					break;
				case 'right':
					this.back.css({
						left: -this.frameWidth + 'px',
					});
					
					$.when(
						this.front.animate(
							{left: this.frameWidth + 'px'}, 
							this.options.duration, 
							'linear'
						),
						this.back.animate(
							{left: 0}, 
							this.options.duration, 
							'linear'
						)
					).then($.proxy(this, '_afterTransition'))
					break;
				default:
			}
		},
		'slide left': function() {
			this._transitions['_slide'].call(this, 'left');
		},
		'slide right': function() {
			this._transitions['_slide'].call(this, 'right');
		},
		'none': function() {
			this._afterTransition();
		}
	}
});

})(jQuery);
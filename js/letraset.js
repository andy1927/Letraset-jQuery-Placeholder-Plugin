// Author: Andrew Jones @andyj1927
// Version: 1.0 10th September 2012
// Licence: Free to use and modify
// About: Letraset enhances and makes available to older browsers input and textarea placeholder text.

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, undefined ) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variables rather than globals
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'letraset',
      document = window.document,
      defaults = {
      	defaultCursor:		'text',
        defaultColor:		"#000",
        defaultOpacity:		.4,
        focusColor:			"#000",
        focusOpacity:		.15,
        focusAnim:			'fade',
        focusAnimTime:		300,
        blurAnim:			'fade',
        blurAnimTime:		500,
        vanishColor:		"#000",
        vanishOpacity:		0,
        vanishAnim:			'fade',
        vanishAnimTime:		300
      };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;

    // jQuery has an extend method which merges the contents of two or 
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.init = function () {
    // Place initialization logic here
    // You already have access to the DOM element and the options via the instance, 
    // e.g., this.element and this.options
    
    var self = $(this.element);
    
    // wrapper properties match element's properties
    var el_width			= self.css('width');
    var el_height			= self.css('height');
    var el_fontsize			= self.css('font-size');
    var el_lineheight		= self.css('line-height');
    var el_float			= self.css('float');
    var el_padding			= self.css('padding-top') + ' ' + self.css('padding-right') + ' ' + self.css('padding-bottom') + ' ' + self.css('padding-left');
    
    // placeholder may need some positioning if element has borders
    //var el_top				= self.parent().css('padding-top');
    //var el_left				= self.parent().css('padding-left');
    var el_top				= self.css('border-top-width');
    var el_left				= self.css('border-left-width');
    
    var el_placeholdler		= self.attr('placeholder');
    
    // create wrapper
    var el_wrap				= '<div style="position:relative' +
    							';width:'			+ el_width +
    							';float:'			+ el_float +
    							';" />';
    
    // create placeholder
    var el_span				= '<span style="position:absolute' +
    							';width:'			+ el_width +
    							';height:'			+ el_height +
    							';padding:'			+ el_padding +
    							';top:'				+ el_top +
    							';left:'			+ el_left +
    							';font-size:'		+ el_fontsize +
    							';line-height:'		+ (el_lineheight == 1 ? 'normal' : el_lineheight) +
    							';cursor:'			+ this.options.defaultCursor +
    							';color:'			+ this.options.defaultColor +
    							';-ms-filter:'		+ '\'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + this.options.defaultOpacity * 100 + ')\'' +
    							';filter:'			+ 'alpha(opacity=' + this.options.defaultOpacity * 100 + ')' +
    							';-moz-opacity:'	+ this.options.defaultOpacity +
    							';-khtml-opacity:'	+ this.options.defaultOpacity +
    							';opacity:'			+ this.options.defaultOpacity +
    							';pointer-events:none' +
    							';background:none' +
    							';">'				+ el_placeholdler +
    							'</span>';
    
    // wraps a div around the original element and positions the placeholder text on top
    self.wrap(el_wrap);
    self.after(el_span);
    
    // remove default placeholder
    self.attr('placeholder', '');
    
    // listener options
    var defaultColor	= this.options.defaultColor;
    var defaultOpacity	= this.options.defaultOpacity;
    
    var focusColor		= this.options.focusColor;
    var focusOpacity	= this.options.focusOpacity;
    var focusAnim		= this.options.focusAnim;
    var focusAnimTime	= this.options.focusAnimTime;
    
    var blurAnim		= this.options.blurAnim;
    var blurAnimTime	= this.options.blurAnimTime;
    
    var vanishColor		= this.options.vanishColor;
    var vanishOpacity	= this.options.vanishOpacity;
    var vanishAnim		= this.options.vanishAnim;
    var vanishAnimTime	= this.options.vanishAnimTime;
    
    // listeners
    self.parent().click(function() {
    	
    	var el_input	= $(this).find('input') || $(this).find('textarea');
    	
    	el_input.focus();
    	
    });
    
    self.keyup(function() {
    	var el_span		= $(this).parent().find('span')
    	var el_input	= $(this);
    	
    	var length		= $(this).val().length;
    	
    	if(length > 0) {
	    	clear_element(el_input, el_span, vanishColor, vanishOpacity, vanishAnim, vanishAnimTime);
    	}
    	else {
	    	focus_element(el_input, el_span, focusColor, focusOpacity, focusAnim, focusAnimTime);
    	}
    	
    });
    
    self.bind('input', function() {
    	var el_span		= $(this).parent().find('span')
    	var el_input	= $(this);
    	
    	var length		= $(this).val().length;
    	
    	if(length > 0) {
	    	clear_element(el_input, el_span, vanishColor, vanishOpacity, vanishAnim, vanishAnimTime);
    	}
    	else {
	    	focus_element(el_input, el_span, focusColor, focusOpacity, focusAnim, focusAnimTime);
    	}
    	
    });
    
    self.focus(function() {
	    
	    var el_span		= $(this).parent().find('span')
    	var el_input	= $(this);
    	
	    if(el_input.val() == '') {
	    	focus_element(el_input, el_span, focusColor, focusOpacity, focusAnim, focusAnimTime)
    	}
	    
    });
    self.blur(function() {
    	
    	var el_span		= $(this).parent().find('span');
    	var el_input	= $(this);
    	
    	if(el_input.val() == '') {
    		blur_element(el_input, el_span, defaultColor, defaultOpacity, blurAnim, blurAnimTime);
    	}
    	
    });
    
  };
  
  function clear_element(el_input, el_span, vanishColor, vanishOpacity, vanishAnim, vanishAnimTime) {
	  
	  switch(vanishAnim) {
	  	case 'fade':
	  		el_span.css('color', vanishColor).animate({ 'opacity':vanishOpacity }, vanishAnimTime);
	  		break;
	  	default:
	  		el_span.css('color', vanishColor).css('opacity', vanishOpacity);
	  }
	  
  }
  
  function focus_element(el_input, el_span, focusColor, focusOpacity, focusAnim, focusAnimTime) {
	  
	  el_span.css('color', focusColor);
	  
	  switch(focusAnim) {
	  	case 'fade':
	  		el_span.animate({ 'opacity':focusOpacity }, focusAnimTime);
	  		break;
	  	default:
	  		el_span.css('opacity', focusOpacity);
	  	break;
	  }
	  
  }
  function blur_element(el_input, el_span, defaultColor, defaultOpacity, blurAnim, blurAnimTime) {
	  
	  el_span.css('color', defaultColor);
	  
	  switch(blurAnim) {
	  	case 'fade':
	  		el_span.animate({ 'opacity':defaultOpacity }, blurAnimTime);
	  		break;
	  	default:
	  		el_span.css('opacity', defaultOpacity);
	  	break;
	  }
	  
  }

  // A really lightweight plugin wrapper around the constructor, 
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
    });
  }

}(jQuery, window));
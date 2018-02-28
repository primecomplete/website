/**
 * Coin Slider - Unique jQuery Image Slider
 * @version: 1.0 - (2010/04/04)
 * @requires jQuery v1.2.2 or later
 * @author Ivan Lazarevic
 * Examples and documentation at: http://workshop.rs/projects/coin-slider/
 * Licensed under MIT licence:
 *   http://www.opensource.org/licenses/mit-license.php

* Updated responsive 2018/01/31
**/

(function ($) {
	var	params		= [],
		order		= [],	// order of square appearance, based on effect (ex: straight is 11, 12, 13, etc)
		images		= [],	// background img src
		resolutions	= [],	// background img resolutions
		loaded		= [],	// how many loaded
		links		= [],	// anchor link (if applicable)
		linksTarget	= [],	// anchor target (if applicable)
		titles		= [],	// img title (text located in next <span>)
		imagePos	= [],	// current i for images (ex: 0-4)
		squarePos	= [],	// current i for order square appearance (ex: 0-34)
		reverse		= [],	//+/-1 for reverse order array
		interval	= [],	//image transition cancel handles (ex. timeout=4050ms=3000+35*30)
		appInterval	= [],	//square appearance cancel handles (ex. timeout=30ms)
		uniqueIDPrefix	= "coinsliderUniqueID",//if no #id present on container
		uniqueIDCounter	= 0;

	$.fn.coinslider = $.fn.CoinSlider = function (options) {
		var fillOrder = function(el){
			var counter	= 0,
				i,
				j;
			for (i = 1; i <=params[el.id].sph; i++) {
				for (j = 1; j <= params[el.id].spw; j++) {
					order[el.id][counter] = i + "" + j;
					counter++;
				}
			}
		};
		// create and append squares
		var setFields = function (el) {
			var	sWidth	= Math.floor(100 / params[el.id].spw),
				sHeight	= Math.floor(100 / params[el.id].sph),
				i,
				j;
			for (i = 1; i <= params[el.id].sph; i++) {
				for (j = 1; j <= params[el.id].spw; j++) {
					if (params[el.id].links) {
						$('#' + el.id).append("<a href='" + links[el.id][0] + "' class='cs-" + el.id + "' id='cs-" + el.id + i + j + "' style='width:" + sWidth + "%; height:" + sHeight + "%;'></a>");
					} else {
						$('#' + el.id).append("<div class='cs-" + el.id + "' id='cs-" + el.id + i + j + "' style='width:" + sWidth + "%; height:" + sHeight + "%;'></div>");
					}
				}
			}
		};

		var transitionCall = function (el) {

			clearInterval(interval[el.id]);
			var delay = params[el.id].delay + params[el.id].spw * params[el.id].sph * params[el.id].sDelay;
			interval[el.id] = setInterval(function() { transition(el);  }, delay);

		};

		// transitions
		var transition = function (el, direction) {

			if(params[el.id].pause === true){
				return;
			}

			effect(el);

			squarePos[el.id] = 0;
			appInterval[el.id] = setInterval(function() { appearance(el,order[el.id][squarePos[el.id]]);  },params[el.id].sDelay);
			var url =images[el.id][imagePos[el.id]];
			$(el).css({ 
				'background-image': 'url("' + url + '")'
			});

			if (typeof(direction) == "undefined") {
				imagePos[el.id]++;
			} else {
				if (direction == 'prev') {
					imagePos[el.id]--;
				} else {
					imagePos[el.id] = direction;
				}
			}

			if (imagePos[el.id] == images[el.id].length) {
				imagePos[el.id] = 0;
			}

			if (imagePos[el.id] == -1) {
				imagePos[el.id] = images[el.id].length-1;
			}

			$('.cs-button-' + el.id).removeClass('cs-active');
			$('#cs-button-' + el.id + "-" + (imagePos[el.id] + 1)).addClass('cs-active');

			if (titles[el.id][imagePos[el.id]]) {
				$('#cs-title-' + el.id).css({ 'opacity' : 0 }).animate({ 'opacity' : params[el.id].opacity }, params[el.id].titleSpeed);
				$('#cs-title-' + el.id).html(titles[el.id][imagePos[el.id]]);
			} else {
				$('#cs-title-' + el.id).css('opacity',0);
			}

		};
		//get background position of current square
		var getPosition = function (el,imageResolution) {
			var position =  order[el.id][squarePos[el.id]];
			var left = parseInt(position[1])-1;
			var top = parseInt(position[0])-1;
			
			var containerWidth = $(el).width(),
			containerHeight=$(el).height();
			
			var lgap = ((imageResolution.width - containerWidth)/2)/imageResolution.width;
			var tgap = ((imageResolution.height - containerHeight)/2)/imageResolution.height;
			//var left = (position %params[el.id].spw)/params[el.id].spw;
			left *= containerWidth/(imageResolution.width*params[el.id].spw);
			//var top = (Math.floor(position /params[el.id].spw))/params[el.id].sph;
			top *= containerHeight/(imageResolution.height*params[el.id].sph);
			return {left:lgap+left,top:tgap+top};
		}
		// set background
		var appearance = function (el, sid) {

			$('.cs-' + el.id).attr('href',links[el.id][imagePos[el.id]]).attr('target',linksTarget[el.id][imagePos[el.id]]);

			if (squarePos[el.id] == params[el.id].spw * params[el.id].sph) {
				clearInterval(appInterval[el.id]);
				return;
			}
			var url =images[el.id][imagePos[el.id]];
			var imageResolution = resolutions[el.id][imagePos[el.id]];
			var position = getPosition(el,imageResolution);
			//note that just using percentage position is wrong here, not sure why.
			$('#cs-' + el.id + sid).css({ 
				opacity: 0, 
				'background-image': 'url("' + url + '")',
				'background-position': -1*imageResolution.width*position.left + 'px ' + -1*imageResolution.height*position.top + 'px',
				'background-size': imageResolution.width+'px' + ' '+imageResolution.height+'px',
			});
			$('#cs-' + el.id + sid).animate({ opacity: 1 }, 300);
			squarePos[el.id]++;

		};


		// effects
		var effect = function (el) {
			var effA = ['random','swirl','rain','straight'],
				i,
				j,
				counter,
				eff;

			if (params[el.id].effect === '') {
				eff = effA[Math.floor(Math.random() * (effA.length))];
			} else {
				eff = params[el.id].effect;
			}

			order[el.id] = [];

			if (eff == 'random') {
				counter = 0;
				for (i = 1; i <= params[el.id].sph; i++) {
					for (j = 1; j <= params[el.id].spw; j++) {
						order[el.id][counter] = i + "" + j;
						counter++;
					}
				}
				randomEffect(order[el.id]);
			}

			if (eff == 'rain') {
				rainEffect(el);
			}

			if (eff == 'swirl') {
				swirlEffect(el);
			}

			if (eff == 'straight') {
				straightEffect(el);
			}
			
			reverse[el.id] *= -1;

			if (reverse[el.id] > 0) {
				order[el.id].reverse();
			}

		};

		// random effect
		var randomEffect = function (arr) {

			var i = arr.length,
				j,
				tempi,
				tempj;

			if ( i === 0 ) {
				return false;
			}

			while ( --i ) {
				j = Math.floor( Math.random() * ( i + 1 ) );
				tempi = arr[i];
				tempj = arr[j];
				arr[i] = tempj;
				arr[j] = tempi;
			}
		};

		//swirl effect by milos popovic

		var min = function (n,m) {
			if (n > m) {
				return m;
			} else {
				return n;
			}
		};

		var max = function (n,m) {
			if (n < m) {
				return m;
			} else {
				return n;
			}
		};
		var swirlEffect = function (el) {

			var n = params[el.id].sph,
				m = params[el.id].spw,
				x = 1,
				y = 1,
				going = 0,
				num = 0,
				c = 0,
				check,
				dowhile = true,
				i;

			while (dowhile) {

				num = (going === 0 || going === 2) ? m : n;

				for (i = 1; i <= num; i++){

					order[el.id][c] = x + "" + y;
					c++;

					if (i != num) {
						switch(going){
							case 0 : y++; break;
							case 1 : x++; break;
							case 2 : y--; break;
							case 3 : x--; break;

						}
					}
				}

				going = (going + 1) % 4;

				switch (going) {
					case 0 : m--; y++; break;
					case 1 : n--; x++; break;
					case 2 : m--; y--; break;
					case 3 : n--; x--; break;
				}

				check = max(n,m) - min(n,m);
				if (m <= check && n <= check) {
					dowhile = false;
				}

			}
		};

		// rain effect
		var rainEffect = function (el) {

			var n = params[el.id].sph,
				m = params[el.id].spw,
				c = 0,
				to = 1,
				to2 = 1,
				from = 1,
				dowhile = true;

			while (dowhile) {

				for (i = from; i <= to; i++) {
					order[el.id][c] = i + '' + parseInt(to2 - i + 1);
					c++;
			}

				to2++;

				if (to < n && to2 < m && n < m) {
					to++;
				}

				if (to < n && n >= m) {
					to++;
				}

				if (to2 > m) {
					from++;
				}

				if (from > to) {
					dowhile= false;
				}

			}

		};

		// straight effect
		var straightEffect = function (el) {
			var counter = 0,
				i,
				j;

			for (i = 1; i <= params[el.id].sph; i++) {
				for (j = 1; j <= params[el.id].spw; j++) {
					order[el.id][counter] = i + '' + j;
					counter++;
				}
			}
		};
		var tryStart = function(el){
			if(loaded[el.id] == images[el.id].length)
			{
				transition(el,0);
				transitionCall(el);
			}
		}
	    //get dimensions of background img (background-size:cover, img may extend beyond container borders)
		var getResolution = function (container, img) {
		    var imgWidth = (img.hasOwnProperty('naturalWidth') ? img.naturalWidth : img.width || 1440),
			imgHeight = (img.hasOwnProperty('naturalHeight') ? img.naturalHeight : img.height || 810);

		    var containerWidth = $(container).width(),
			containerHeight = $(container).height();

		    var imgRatio = (imgHeight / imgWidth),
			containerRatio = (containerHeight / containerWidth);

		    var finalWidth = 0, finalHeight = 0;
		    if (containerRatio > imgRatio) {
		        finalHeight = containerHeight;
		        //finalWidth = (containerHeight / imgRatio);
		        finalWidth = containerHeight * imgWidth / imgHeight;
		    }
		    else {
		        finalWidth = containerWidth;
		        //finalHeight = (imgHeight / containerRatio);
		        finalHeight = containerWidth * imgHeight / imgWidth;
		    }
		    return { width: finalWidth, height: finalHeight };
		};
		var loadImage = function(el,i,img) {
			resolutions[el.id][i] = getResolution(el,img);
			loaded[el.id]++;
			tryStart(el);
		};
		
		var init = function (el) {

			if( el.id === '' ){
				el.id = uniqueIDPrefix + uniqueIDCounter++;
			}

			order[el.id]		= [];	// order of square appearance, based on effect (ex: straight is 11, 12, 13, etc)
			images[el.id]		= [];	// background img src
			resolutions[el.id]=[];
			loaded[el.id]=0;
			links[el.id]		= [];	// anchor link (if applicable)
			linksTarget[el.id]	= [];	// anchor target (if applicable)
			titles[el.id]		= [];	// img title (text located in next <span>)
			imagePos[el.id]		= 0;	// current i for images
			squarePos[el.id]	= 0;	// current i for square order
			reverse[el.id]		= 1;

			params[el.id] = $.extend({}, $.fn.coinslider.defaults, options);

			params[el.id].width=$(el).width();
			params[el.id].height=$(el).height();
			
			// fill arrays
			fillOrder(el);//note: this initial fill is overridden later if not "straight" effect
			$.each($('#' + el.id + ' img'), function (i, item) {
				images[el.id][i]		= $(item).attr('src') || item.src; // ios fix
				links[el.id][i]			= $(item).parent().is('a') ? $(item).parent().attr('href') : '';
				linksTarget[el.id][i]	= $(item).parent().is('a') ? $(item).parent().attr('target') : '';
				titles[el.id][i]		= $(item).next().is('span') ? $(item).next().html() : '';
				$(item).hide();
				$(item).next().hide();
			});
			
			// set initial frame
			$(el).css({
				'background-image': 'url("' + images[el.id][0] + '")',
				'background-position': '50% 50%',
				'background-size': 'cover'
			}).wrap("<div class='coin-slider' id='coin-slider-" + el.id + "' />");

			// create title bar
			if(params[el.id].titleBar){
				$('#' + el.id).append("<div class='cs-title' id='cs-title-" + el.id + "' style='position: absolute; bottom:0; left: 0; z-index: 1000;'></div>");
			}
			//add empty squares
			setFields(el);

			//TODO: skip any images that don't load after a set interval
			//TODO: skip any images that error (complete/onload will trigger but 0width/0height)
			images[el.id].forEach(function(item,i){
			    var img = new Image();
			    img.onload = loadImage(el, i, img);
				img.src = item;
				if (img.complete) {
					loadImage(el,i,img);
				}
			});

		};

		this.each (
			function () {
				init(this);
			}
		);
	};

	// default values
	$.fn.coinslider.defaults = {
		width: 565, // width of slider panel
		height: 290, // height of slider panel
		spw: 7, // squares per width
		sph: 5, // squares per height
		delay: 3000, // delay between images in ms
		sDelay: 30, // delay beetwen squares in ms
		opacity: 0.7, // opacity of title and navigation
		titleBar: false, // show title bar
		titleSpeed: 500, // speed of title appearance in ms
		effect: '', // random, swirl, rain, straight
		links : true, // show images as links
		hoverPause: true, // pause on hover
		prevText: 'prev',
		nextText: 'next',
		navigation: true, // show/hide prev, next and buttons
		showNavigationPrevNext: true,
		showNavigationButtons: true,
		navigationPrevNextAlwaysShown: false
	};

})(jQuery);
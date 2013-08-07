// Global variables
var crocObjectConnected = false;
var isFullscreen = false; 
var isDurationTimerSet = false;
var setCallDuration = null;
var crocObject, orientationOfClick2Call, mediaWidget;
var ringtoneToUse;
var isClicked = false;

// The function to set up a click to call tab
var croc_click2call = function(userConfig) {	
	
	// Override default configuration with user configuration if present
	var defaultConfig = $.extend({
		apiKey: 'FIXME',
		addressToCall: 'FIXME@crocodilertc.net',
		appendClick2callTo: 'body',
		click2callPosition: 'absolute',
		click2callOrientation: 'right',
		click2callMediaWidget: 'audio',
		countryRingtoneCode: 'gb'
	}, userConfig||{});
	
	orientationOfClick2Call = defaultConfig.click2callOrientation;
	
	/*
	 * Setup event handlers for the audio widget
	 */
	var setupAudioWidgetHandlers = function () {
		/*
		 * Setup tab event handlers
		 */		
		$('.side-tab').click(function() {
			
			if (!isClicked) {
				
				switch (orientationOfClick2Call) {
				case 'top':
					// Expand tab.
					$('.tab-container').animate({
						top: '200px'
					});
					break;
				case 'bottom':
					break;
				case 'left':
					// Expand tab.
					$('.tab-container').animate({
						left: '400px'
					});
					break;
				default:
					// Expand tab.
					$('.tab-container').animate({
						right: '400px'
					});
					break;
				}
			
				// Show tab content
				$('.side-tab-content').show(600);
				
				// Make a call if not already making a call
				if (!crocObjectConnected) {
					requestAudio(defaultConfig.apiKey, defaultConfig.addressToCall);
				}
				
				isClicked = true;
			} else if (isClicked) {
				
				switch (orientationOfClick2Call) {
				case 'top':
					// Collapse tab.
					$('.tab-container').animate({
						top: '0px'
					});					
					break;
				case 'bottom':
					
					break;
				case 'left':
					// Collapse tab.
					$('.tab-container').animate({
						left: '0px'
					});
					break;
				default:
					// Collapse tab.
					$('.tab-container').animate({
						right: '0px'
					});
					break;
				}
				
				// Show tab content
				$('.side-tab-content').hide(1000);
				
				isClicked = false;
			}
			
		});
		
		/*
		 * Setup audio widget buttons
		 */
		var toggleOnMute = false;
		
		// End audio session when clicked
		$('.btn_close').click(function(){
			// End the audio call
			endAudio();
		});
		
		// End audio session when clicked
		$('.btn_endcall_s').click(function() {
			// End the audio call
			endAudio();
		});
		
		// Set mute call button
		$('.mute_audio').click(function () {
			if (!toggleOnMute) {
				toggleOnMute = true;
				muteAudioCall();
			} else {
				toggleOnMute = false;
				unmuteAudioCall();
			}
		});

		// Setup keypad popout
		$('.ui_popout').click(function(evt){
			$('body').click(function(evt2){
				// Dont close if popout content is pressed
				var currentTarget = $(evt.target);
				while(currentTarget[0]){
					if(currentTarget[0] === evt.target[0])
						return;
					currentTarget = currentTarget.parent();
				}

				$('body').off('click');

				$('.ui_popout').removeClass('ui_popout_open');
				$('.tpl_titlebar').removeClass('ui_shown');
				$('.tpl_actions').removeClass('ui_shown');
			});

			evt.stopPropagation();
			$('.ui_popout').addClass('ui_popout_open');
			$('.tpl_titlebar').addClass('ui_shown');
			$('.tpl_actions').addClass('ui_shown');
		});

		$('.ui_popout').removeClass('ui_popout_open');
		$('.tpl_titlebar').removeClass('ui_shown');
		$('.tpl_actions').removeClass('ui_shown');

		// Setup keypad buttons
		var keypad = $('.ui_keypad');
		keypad.find('.tpl_key').click(function(){
			var value = $(this).find('.tpl_main').text();
			audioSession.sendDTMF(value);
		});
	};
	
	/*
	 * Setup event handlers for the video widget
	 */
	var setupVideoWidgetHandlers = function () {
		
		$('.side-tab').click(function() {
			
			if (!isClicked) {
				
				switch (orientationOfClick2Call) {
				case 'top':
					// Expand tab.
					$('.tab-container').animate({
						top: '372px'
					});
					break;
				case 'bottom':
					break;
				case 'left':
					// Expand tab.
					$('.tab-container').animate({
						left: '532px'
					});
					break;
				default:
					// Expand tab.
					$('.tab-container').animate({
						right: '532px'
					});
					break;
				}
			
				// Show tab content
				$('.side-tab-content-video').show(600);
				
				// Make a call if not already making a call
				if (!crocObjectConnected) {
					requestVideo(defaultConfig.apiKey, defaultConfig.addressToCall);
				}
				
				isClicked = true;
			} else if (isClicked) {
				
				switch (orientationOfClick2Call) {
				case 'top':
					// Collapse tab.
					$('.tab-container').animate({
						top: '0px'
					});					
					break;
				case 'bottom':
					
					break;
				case 'left':
					// Collapse tab.
					$('.tab-container').animate({
						left: '0px'
					});
					break;
				default:
					// Collapse tab.
					$('.tab-container').animate({
						right: '0px'
					});
					break;
				}
				
				// Show tab content
				$('.side-tab-content-video').hide(1000);
				
				isClicked = false;
			}
			
		});
		
		// Setup close button
		$('.btn_close').click(function(){
			// End the video call
			endVideo();
		});
		
		// Setup end call button
		$('.btn_endcall_s').click(function() {
			// End the video call
			endVideo();
		});
		
		var togglePauseVideo = false;
		
		// Set pause video button
		$('.btn_pausevideo_s').click(function () {
			if (!togglePauseVideo) {
				togglePauseVideo = true;
				pauseVideo();
			} else {
				togglePauseVideo = false;
				resumeVideo();
			}
		});
		
		var toggleOnMute = false;
		
		// Set mute audio button
		$('.mute_video_audio').click(function () {
			if (!toggleOnMute) {
				toggleOnMute = true;
				muteAudio();
			} else {
				toggleOnMute = false;
				unmuteAudio();
			}
		});
		
		var toggleLocalVideo = true;
		
		// Setup click event for local video button to display/hide local video
		$('.btn_localvideo').click(function () {
			if (toggleLocalVideo) {
				toggleLocalVideo = false;
				$('.tpl_controls').removeClass("ui_localvideoshown");
			} else {
				toggleLocalVideo = true;
				$('.tpl_controls').addClass("ui_localvideoshown");
			}
		});
		
		// Setup full screen button
		$('.btn_fullscreen').click(function() {
			if (!isFullscreen) {
				isFullscreen = true;
				setVideoToFullscreen(true);
			} else {
				isFullscreen = false;
				setVideoToFullscreen(false);
			}
		});
		
		// Setup keypad popout
		$('.ui_popout').click(function(evt){
			$('body').click(function(evt2){
				// Dont close if popout content is pressed
				var currentTarget = $(evt.target);
				while(currentTarget[0]){
					if(currentTarget[0] === evt.target[0])
						return;
					currentTarget = currentTarget.parent();
				}

				$('body').off('click');

				$('.ui_popout').removeClass('ui_popout_open');
				$('.tpl_titlebar').removeClass('ui_shown');
				$('.tpl_actions').removeClass('ui_shown');
			});

			evt.stopPropagation();
			$('.ui_popout').addClass('ui_popout_open');
			$('.tpl_titlebar').addClass('ui_shown');
			$('.tpl_actions').addClass('ui_shown');
		});

		$('.ui_popout').removeClass('ui_popout_open');
		$('.tpl_titlebar').removeClass('ui_shown');
		$('.tpl_actions').removeClass('ui_shown');

		// Setup keypad buttons
		var keypad = $('.ui_keypad');
		keypad.find('.tpl_key').click(function(){
			var value = $(this).find('.tpl_main').text();
			videoSession.sendDTMF(value);
		});
	};
	
	// Get the HTML element to append to
	var htmlElement = $(defaultConfig.appendClick2callTo);
	var i;
	
	/* 
	 * Add HTML for widget based on the configuration.
	 * By default it will insert the audio widget.
	 */
	switch (defaultConfig.click2callMediaWidget) {
	default:
	case 'audio':
		
		// Add the HTML as a child of the element specified in the configuration if the element exists.
		if (htmlElement.length !== 0) {
			
			// For every HTML element of that kind, add audio tab
			for (i=0; i < htmlElement.length; i++) {
				
				// Check that document contains HTML element
				if ($.contains(document, htmlElement[i])) {
					
					// Add audio tab
					$(defaultConfig.appendClick2callTo).append(audioWidgetHtml);
				} else  {
					
					// If the HTML element specified doesn't exist, add to HTML
					$('html').append(audioWidgetHtml);
				}
			}
		} else {
			// If the HTML element specified doesn't exist, add to HTML
			$('html').append(audioWidgetHtml);
		}
		
		// Add audio widget event handlers
		setupAudioWidgetHandlers();
		break;
	case 'video':
		
		// Add the HTML as a child of the element specified in the configuration if the element exists.
		if (htmlElement.length !== 0) {
			
			// For every HTML element of that kind, add video tab
			for (i=0; i < htmlElement.length; i++) {
				
				// Check that document contains HTML element
				if ($.contains(document, htmlElement[i])) {
					
					// Add video tab
					$(defaultConfig.appendClick2callTo).append(videoWidgetHtml);
				} else  {
					
					// If the HTML element specified doesn't exist, add to HTML
					$('html').append(videoWidgetHtml);
				}
			}
		} else {
			// If the HTML element specified doesn't exist, add to HTML
			$('html').append(videoWidgetHtml);
		}
		
		// Add video widget event handlers
		setupVideoWidgetHandlers();
		break;
	}
	
	/*
	 * Setup the position of the click to call tab; fixed or absolute
	 */
	var positionOfClick2Call = defaultConfig.click2callPosition;
	mediaWidget = defaultConfig.click2callMediaWidget;
	
	// Add to correct widget only if value is absolute or fixed
	if (mediaWidget === 'video' && positionOfClick2Call === 'absolute' || positionOfClick2Call === 'fixed') {
		
		// Change css position to user defined/default position
		$('.tab-wrapper-video').css('position', defaultConfig.click2callPosition);	
	}
	
	if (mediaWidget === 'audio' && positionOfClick2Call === 'absolute' || positionOfClick2Call === 'fixed')  {
		
		// Change css position to user defined/default position
		$('.tab-wrapper').css('position', defaultConfig.click2callPosition);
	}
	
	/*
	 * Setup the tab orientation on screen; top, right, bottom or left
	 */	
	switch (orientationOfClick2Call) {
	case 'top':
		if (mediaWidget === 'video' && orientationOfClick2Call === 'top') {
			$('.tab-container').removeClass('tab-wrapper-video');
			$('.tab-container').addClass('video-top-tab');
			$('.warning-light').addClass('top-light-horizontal');
			$('.tab-logo').addClass('horizontal-tab-align');
			$('.side-tab').removeClass('rotate-vertical');
			$('.side-tab').addClass('video-top-side-tab');
			$('.side-tab-content-video').addClass('video-top-content');
		}
		if (mediaWidget === 'audio' && orientationOfClick2Call === 'top') {
			$('.tab-container').removeClass('tab-wrapper');
			$('.tab-container').addClass('audio-top-tab');
			$('.warning-light').addClass('top-light-horizontal');
			$('.tab-logo').addClass('horizontal-tab-align');
			$('.side-tab').removeClass('rotate-vertical');
			$('.side-tab').addClass('audio-side-tab-top');
			$('.side-tab-content').addClass('audio-top-content');
		}
		break;
	case 'bottom':
		if (mediaWidget === 'video' && orientationOfClick2Call === 'bottom') {
			$('.tab-container').removeClass('tab-wrapper-video');
			$('.tab-container').addClass('video-bottom-tab');
			$('.warning-light').addClass('bottom-light-horizontal');
			$('.tab-logo').addClass('horizontal-tab-align-bottom');
			$('.side-tab').removeClass('rotate-vertical');
			$('.side-tab').addClass('video-side-tab-bottom');
			$('.side-tab-content-video').addClass('video-bottom-content');
		}
		if (mediaWidget === 'audio' && orientationOfClick2Call === 'bottom') {
			$('.tab-container').removeClass('tab-wrapper');
			$('.tab-container').addClass('audio-bottom-tab');
			$('.warning-light').addClass('bottom-light-horizontal');
			$('.tab-logo').addClass('horizontal-tab-align-bottom');
			$('.side-tab').removeClass('rotate-vertical');
			$('.side-tab').addClass('rotate-horizontal');
			$('.side-tab-content').addClass('audio-bottom-content');
		}
		break;
	case 'left':
		if (mediaWidget === 'video' && orientationOfClick2Call === 'left') {
			$('.tab-container').addClass('video-left-tab');
			$('.side-tab-content-video').addClass('video-left-content');
		}
		if (mediaWidget === 'audio' && orientationOfClick2Call === 'left') {
			$('.tab-container').addClass('audio-left-tab');
			$('.side-tab-content').addClass('audio-left-content');
		}
		break;
	default:
		break;
	}
	
	/*
	 * Configure ringtone to use. Can be set using country codes such as 'gb' 
	 * for Great Britain.
	 */
	var getUserDefinedRingtone = defaultConfig.countryRingtoneCode;
	ringtoneToUse = getUserDefinedRingtone||'gb'; 
};

// Format the timer for widget
function formatDuration(time1, time2, format) {
	var duration = ((time1 < time2)?(time2 - time1):(time1 - time2))/1000;

	var hours = parseInt(duration / 3600, 10);
	var minutes = parseInt(duration / 60, 10);
	var seconds = parseInt(duration, 10);

	if(minutes >= 1) {
		seconds -= minutes*60;
	}
	
	if(hours >= 1) {
		minutes -= hours*60;
	}

	var string = format.replace('%H', (((""+hours).length > 1)?hours:('0' + hours)));
	string = string.replace('%i', (((""+minutes).length > 1)?minutes:('0' + minutes)));
	string = string.replace('%s', (((""+seconds).length > 1)?seconds:('0' + seconds)));

	return string;
}

// Set a timer to update the length of the call
function setDuration(callStartDate) {
	
		if (setCallDuration !== null) {
			clearInterval(setCallDuration);
			setCallDuration = null;
		}
	
		// Start call duration
		setCallDuration = setInterval(function() {
			
			// Set the format to display the length of the call
			var durationTimerFormat = "%H:%i:%s";
			
			// Get the current date in milliseconds
			var currentDate = new Date().getTime();
			
			// Format the date using the method formatDuration
			var formattedCallDuration = formatDuration(callStartDate, currentDate, durationTimerFormat);
			
			// Set the duration element text to the current duration after formatting 
			$('.ui_duration').html(formattedCallDuration);
			
		}, 1000);
}
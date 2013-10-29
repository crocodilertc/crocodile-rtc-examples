// Global variables
var crocObjectConnected = false, isClicked = false, isDurationTimerSet = false, isFullscreen = false; 
var setCallDuration = null;
var crocObject, mediaWidget, orientationOfClick2Call, ringtoneToUse;

// The function to set up a click to call tab
var croc_click2call = function(userConfig) {	
	
	// Override default configuration with user configuration if present
	var defaultConfig = $.extend({
		apiKey: 'FIXME',
		addressToCall: 'FIXME@crocodilertc.net',
		appendClick2callTo: 'body',
		click2callDisplayName: null,
		click2callMediaWidget: 'audio',
		click2callOrientation: 'right',
		click2callPosition: 'absolute',
		countryRingtoneCode: 'gb'
	}, userConfig||{});
	
	orientationOfClick2Call = defaultConfig.click2callOrientation;
	
	// Check for a display name
	if (!defaultConfig.click2callDisplayName) {
		throw new TypeError("Please set a display name");
	}
	
	/*
	 * Setup event handlers for the audio widget
	 */
	var setupAudioWidgetHandlers = function () {
		/*
		 * Setup tab event handlers
		 */		
		$('.croc_side-tab').click(function() {
			
			if (!isClicked) {
				
				switch (orientationOfClick2Call) {
				case 'top':
					// Expand tab.
					$('.croc_tab-container').animate({
						top: '185px'
					});
					break;
				case 'bottom':
					$('.croc_audio-bottom-tab').animate({
						bottom: '10px'
					});
					break;
				case 'left':
					// Expand tab.
					$('.croc_tab-container').animate({
						left: '379px'
					});
					break;
				default:
					// Expand tab.
					$('.croc_tab-container').animate({
						right: '379px'
					});
					break;
				}
			
				// Show tab content
				$('.croc_side-tab-content').show(600);
				
				// Make a call if not already making a call
				if (!crocObjectConnected) {
					requestAudio(defaultConfig.apiKey, defaultConfig.addressToCall, defaultConfig.click2callDisplayName);
				}
				
				isClicked = true;
			} else if (isClicked) {
				
				switch (orientationOfClick2Call) {
				case 'top':
					// Collapse tab.
					$('.croc_tab-container').animate({
						top: '0px'
					});					
					break;
				case 'bottom':
					$('.croc_audio-bottom-tab').animate({
						bottom: '0px'
					});
					break;
				case 'left':
					// Collapse tab.
					$('.croc_tab-container').animate({
						left: '0px'
					});
					break;
				default:
					// Collapse tab.
					$('.croc_tab-container').animate({
						right: '0px'
					});
					break;
				}
				
				// Hide tab content
				$('.croc_side-tab-content').hide(1000);
				
				isClicked = false;
			}
			
		});
		
		/*
		 * Setup audio widget buttons
		 */
		var toggleOnMute = false;
		
		// End audio session when clicked
		$('.croc_btn_close').click(function(){

			// End the audio call
			endAudio();
		});
		
		// End audio session when clicked
		$('.croc_btn_endcall_s').click(function() {
			
			// End the audio call
			endAudio();
		});
		
		// Set mute call button
		$('.croc_mute_audio').click(function () {
			if (!toggleOnMute) {
				toggleOnMute = true;
				muteAudioCall();
			} else {
				toggleOnMute = false;
				unmuteAudioCall();
			}
		});

		// Setup keypad popout
		$('.croc_ui_popout').click(function(evt){
			$('body').click(function(evt2){
				// Dont close if popout content is pressed
				var currentTarget = $(evt.target);
				while(currentTarget[0]){
					if(currentTarget[0] === evt.target[0]) {
						return;
					}
					
					currentTarget = currentTarget.parent();
				}

				$('body').off('click');

				$('.croc_ui_popout').removeClass('croc_ui_popout_open');
				$('.croc_tpl_titlebar').removeClass('croc_ui_shown');
				$('.croc_tpl_actions').removeClass('croc_ui_shown');
			});

			evt.stopPropagation();
			$('.croc_ui_popout').addClass('croc_ui_popout_open');
			$('.croc_tpl_titlebar').addClass('croc_ui_shown');
			$('.croc_tpl_actions').addClass('croc_ui_shown');
		});

		// Make sure keypad and tool bars aren't displayed
		$('.croc_ui_popout').removeClass('croc_ui_popout_open');
		$('.croc_tpl_titlebar').removeClass('croc_ui_shown');
		$('.croc_tpl_actions').removeClass('croc_ui_shown');

		// Setup keypad buttons
		var keypad = $('.croc_ui_keypad');
		keypad.find('.croc_tpl_key').click(function(){
			var value = $(this).find('.croc_tpl_main').text();
			audioSession.sendDTMF(value);
		});
	};
	
	/*
	 * Setup event handlers for the video widget
	 */
	var setupVideoWidgetHandlers = function () {
		
		$('.croc_side-tab').click(function() {
			
			if (!isClicked) {
				
				switch (orientationOfClick2Call) {
				case 'top':
					// Expand tab.
					$('.croc_tab-container').animate({
						top: '343px'
					});
					break;
				case 'bottom':
					$('.croc_video-bottom-tab').animate({
						bottom: '10px'
					});
					break;
				case 'left':
					// Expand tab.
					$('.croc_tab-container').animate({
						left: '511px'
					});
					break;
				default:
					// Expand tab.
					$('.croc_tab-container').animate({
						right: '511px'
					});
					break;
				}
			
				// Show tab content
				$('.croc_side-tab-content-video').show(600);
				
				// Make a call if not already making a call
				if (!crocObjectConnected) {
					requestVideo(defaultConfig.apiKey, defaultConfig.addressToCall, defaultConfig.click2callDisplayName);
				}
				
				isClicked = true;
			} else if (isClicked) {
				
				switch (orientationOfClick2Call) {
				case 'top':
					// Collapse tab.
					$('.croc_tab-container').animate({
						top: '0px'
					});
					break;
				case 'bottom':
					$('.croc_video-bottom-tab').animate({
						bottom: '0px'
					});
					break;
				case 'left':
					// Collapse tab.
					$('.croc_tab-container').animate({
						left: '0px'
					});
					break;
				default:
					// Collapse tab.
					$('.croc_tab-container').animate({
						right: '0px'
					});
					break;
				}
				
				// Show tab content
				$('.croc_side-tab-content-video').hide(1000);
				
				isClicked = false;
			}
			
		});
		
		// Setup close button
		$('.croc_btn_close').click(function(){
			// End the video call
			endVideo();
		});
		
		// Setup end call button
		$('.croc_btn_endcall_s').click(function() {
			// End the video call
			endVideo();
		});
		
		var togglePauseVideo = false;
		
		// Set pause video button
		$('.croc_btn_pausevideo_s').click(function () {
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
		$('.croc_mute_video_audio').click(function () {
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
		$('.croc_btn_localvideo').click(function () {
			if (toggleLocalVideo) {
				toggleLocalVideo = false;
				$('.croc_tpl_controls').removeClass("croc_ui_localvideoshown");
			} else {
				toggleLocalVideo = true;
				$('.croc_tpl_controls').addClass("croc_ui_localvideoshown");
			}
		});
		
		// Setup full screen button
		$('.croc_btn_fullscreen').click(function() {
			if (!isFullscreen) {
				isFullscreen = true;
				setVideoToFullscreen(true);
			} else {
				isFullscreen = false;
				setVideoToFullscreen(false);
			}
		});
		
		// Setup keypad popout
		$('.croc_ui_popout').click(function(evt){
			$('body').click(function(evt2){
				// Dont close if popout content is pressed
				var currentTarget = $(evt.target);
				while(currentTarget[0]){
					if(currentTarget[0] === evt.target[0]) {
						return;
					}
					
					currentTarget = currentTarget.parent();
				}

				$('body').off('click');

				$('.croc_ui_popout').removeClass('croc_ui_popout_open');
				$('.croc_tpl_titlebar').removeClass('croc_ui_shown');
				$('.croc_tpl_actions').removeClass('croc_ui_shown');
			});

			evt.stopPropagation();
			$('.croc_ui_popout').addClass('croc_ui_popout_open');
			$('.croc_tpl_titlebar').addClass('croc_ui_shown');
			$('.croc_tpl_actions').addClass('croc_ui_shown');
		});

		// Make sure keypad and tool bars aren't displayed
		$('.croc_ui_popout').removeClass('croc_ui_popout_open');
		$('.croc_tpl_titlebar').removeClass('croc_ui_shown');
		$('.croc_tpl_actions').removeClass('croc_ui_shown');

		// Setup keypad buttons
		var keypad = $('.croc_ui_keypad');
		keypad.find('.croc_tpl_key').click(function(){
			var value = $(this).find('.croc_tpl_main').text();
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
		$('.croc_tab-wrapper-video').css('position', defaultConfig.click2callPosition);	
	}
	
	if (mediaWidget === 'audio' && positionOfClick2Call === 'absolute' || positionOfClick2Call === 'fixed')  {
		
		// Change css position to user defined/default position
		$('.croc_tab-wrapper').css('position', defaultConfig.click2callPosition);
	}
	
	/*
	 * Setup the tab orientation on screen; top, right, bottom or left
	 */	
	switch (orientationOfClick2Call) {
	case 'top':
		if (mediaWidget === 'video' && orientationOfClick2Call === 'top') {
			$('.croc_tab-container').removeClass('croc_tab-wrapper-video');
			$('.croc_tab-container').addClass('croc_video-top-tab');
			$('.croc_side-tab').removeClass('croc_rotate-vertical');
			$('.croc_side-tab').addClass('croc_video-top-side-tab');
			$('.croc_side-tab-content-video').addClass('croc_video-top-content');
			$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
		}
		if (mediaWidget === 'audio' && orientationOfClick2Call === 'top') {
			$('.croc_tab-container').removeClass('croc_tab-wrapper');
			$('.croc_tab-container').addClass('croc_audio-top-tab');
			$('.croc_side-tab').removeClass('croc_rotate-vertical');
			$('.croc_side-tab').addClass('croc_audio-side-tab-top');
			$('.croc_side-tab-content').addClass('croc_audio-top-content');
			$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
		}
		break;
	case 'bottom':
		if (mediaWidget === 'video' && orientationOfClick2Call === 'bottom') {
			$('.croc_tab-container').removeClass('croc_tab-wrapper-video');
			$('.croc_tab-container').addClass('croc_video-bottom-tab');
			$('.croc_side-tab').removeClass('croc_rotate-vertical');
			$('.croc_side-tab').addClass('croc_video-side-tab-bottom');
			$('.croc_side-tab-content-video').addClass('croc_video-bottom-content');
		}
		if (mediaWidget === 'audio' && orientationOfClick2Call === 'bottom') {
			$('.croc_tab-container').removeClass('croc_tab-wrapper');
			$('.croc_tab-container').addClass('croc_audio-bottom-tab');
			$('.croc_side-tab').removeClass('croc_rotate-vertical');
			$('.croc_side-tab').addClass('croc_rotate-horizontal');
			$('.croc_side-tab-content').addClass('croc_audio-bottom-content');
		}
		break;
	case 'left':
		if (mediaWidget === 'video' && orientationOfClick2Call === 'left') {
			$('.croc_tab-container').addClass('croc_video-left-tab');
			$('.croc_side-tab-content-video').addClass('croc_video-left-content');
			$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
		}
		if (mediaWidget === 'audio' && orientationOfClick2Call === 'left') {
			$('.croc_tab-container').addClass('croc_audio-left-tab');
			$('.croc_side-tab-content').addClass('croc_audio-left-content');
			$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
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
			$('.croc_ui_duration').html(formattedCallDuration);
			
		}, 1000);
}
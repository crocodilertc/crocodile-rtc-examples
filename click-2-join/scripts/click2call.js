// Global variables
var crocObjectConnected = false, isClicked = false, isDurationTimerSet = false, isFullscreen = false; 
var setCallDuration = null;
var crocObject, mediaWidget, orientationOfClick2Call, ringtoneToUse;

/*
 * Croc Object connection, check for capabilities
 */
function connectCrocObject(crocApiKey, crocDisplayName) {
	// CrocSDK API Configuration
	crocConfig = {
		// The API Key registered to the Crocodile RTC SDK Network
		apiKey: crocApiKey,
		
		// The text to display to call recipient
		displayName: crocDisplayName,
		
		// The features that the application will implement
		features: ['audio', 'transfer'],
		
		// The event handler to fire when connected to the network
		onConnected: function() {
			// Set remote party's address
			$('.croc_ui_uri').html(crocDisplayName);
			
			var hasAudio = crocObject.capabilities["sip.audio"];
			var hasDTMF = crocObject.capabilities["croc.dtmf"];
			
			// Test for audio capabilities
			if (!hasAudio) {
				alert("Unable to detect audio capabilities. Please connect and enable an audio device.");
			}
			
			// Test for DTMF capabilities
			if (!hasDTMF) {
				alert("This browser does not support Dual Tone Multi Frequency signalling; you will not be able to un-mute.");
			}
		}
	};
	
	// Instantiation of croc object with non-default configuration
	crocObject = $.croc(crocConfig);
}

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
		click2callPosition: 'fixed',
		click2callFromAddress: null,
		countryRingtoneCode: 'gb'
	}, userConfig||{});
	
	// Check for a display name
	if (!defaultConfig.click2callDisplayName) {
		throw new TypeError("Please set a display name");
	}
	
	orientationOfClick2Call = defaultConfig.click2callOrientation;
	
	// Connect to the Network and check capabilities
	connectCrocObject(defaultConfig.apiKey, defaultConfig.click2callDisplayName);
	
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
					requestAudio(defaultConfig.addressToCall);
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
		
		var toggleOnMute = true;
		
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
		
		// Make sure tool bars aren't displayed
		$('.croc_tpl_titlebar').removeClass('croc_ui_shown');
		$('.croc_tpl_actions').removeClass('croc_ui_shown');
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
	}
	
	/*
	 * Setup the position of the click to call tab; fixed or absolute
	 */
	var positionOfClick2Call = defaultConfig.click2callPosition;
	mediaWidget = defaultConfig.click2callMediaWidget;
	
	// Add to correct widget only if value is absolute or fixed
	if (mediaWidget === 'audio' && positionOfClick2Call === 'absolute' || positionOfClick2Call === 'fixed') {
		// Change css position to user defined/default position
		$('.croc_tab-wrapper').css('position', defaultConfig.click2callPosition);
	}
	
	/*
	 * Setup the tab orientation on screen; top, right, bottom or left
	 */
	switch (orientationOfClick2Call) {
	case 'top':
		if (mediaWidget === 'audio' && orientationOfClick2Call === 'top') {
			$('.croc_tab-container').removeClass('croc_tab-wrapper');
			$('.croc_tab-container').addClass('croc_audio-top-tab');
			$('.croc_side-tab').removeClass('croc_rotate-vertical');
			$('.croc_side-tab').addClass('croc_audio-side-tab-top');
			$('.croc_side-tab-content').addClass('croc_audio-top-content');
			$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
			$('.croc_powered_by_audio').addClass('croc_top');
		}
		break;
	case 'bottom':
		if (mediaWidget === 'audio' && orientationOfClick2Call === 'bottom') {
			$('.croc_tab-container').removeClass('croc_tab-wrapper');
			$('.croc_tab-container').addClass('croc_audio-bottom-tab');
			$('.croc_side-tab').removeClass('croc_rotate-vertical');
			$('.croc_side-tab').addClass('croc_rotate-horizontal');
			$('.croc_side-tab-content').addClass('croc_audio-bottom-content');
		}
		break;
	case 'left':
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

	if (minutes >= 1) {
		seconds -= minutes*60;
	}
	
	if (hours >= 1) {
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
// Global variables
var crocObjectConnected = false, isClicked = false, isDurationTimerSet = false, isFullscreen = false;
var setCallDuration = null;
var crocObject, mediaWidget, orientationOfClick2Call, ringtoneToUse;

/* 
 * Load icons.png to make sure image is retrieved before widget is used. 
 */
window.onload = function() {
	if (document.images) {
		var img1 = new Image();
		img1.src = "dist/images/icons.png";
	}
};
 
/*
 * Croc Object connection, check for capabilities
 */
function connectCrocObject(crocApiKey, crocDisplayName, click2callMediaWidget) {
	// CrocSDK API Configuration
	crocConfig = {
		// The API Key registered to the Crocodile RTC SDK Network
		apiKey: crocApiKey,
		
		// The text to display to call recipient
		displayName: crocDisplayName,
		
		// The features that the application will implement
		features: ['audio', 'video', 'transfer'],
		
		// The event handler to fire when connected to the network
		onConnected: function() {
			var hasAudio = crocObject.capabilities["sip.audio"];
			var hasVideo = crocObject.capabilities["sip.video"];
			var hasDTMF = crocObject.capabilities["croc.dtmf"];
			
			// Test for audio capabilities
			if (!hasAudio) {
				alert("Unable to detect audio capabilities. Please connect and enable an audio device.");
			}
			
			// Test for video capabilities
			if (!hasVideo && click2callMediaWidget === "video") {
				alert("Unable to detect video capabilities. Please connect and enable an imaging device.");
			}
			
			// Test for DTMF capabilities
			if (!hasDTMF) {
				$(".croc_btn_keypad").hide();
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
		countryRingtoneCode: 'gb'
	}, userConfig||{});
	
	// Check for a display name
	if (!defaultConfig.click2callDisplayName) {
		throw new TypeError("Please set a display name");
	}
	
	// Connect to the Network and check capabilities
	connectCrocObject(defaultConfig.apiKey, defaultConfig.click2callDisplayName, defaultConfig.click2callMediaWidget);
	
	/*
	 * Configure ringtone to use. Can be set using country codes such as 'gb' 
	 * for Great Britain.
	 */
	var getUserDefinedRingtone = defaultConfig.countryRingtoneCode;
	ringtoneToUse = getUserDefinedRingtone||'gb';
	
	// Configure appropriate widget
	var widgetChoice = defaultConfig.click2callMediaWidget;
	if (widgetChoice === 'video') {
		// Setup video widget
		try {
			setClick2CallVideoWidget(defaultConfig);
		} catch(err) {
			throw new TypeError("Cannot build click-2-call tab. Please build Click-2-Call configured for video.");
		}
	} else {
		// Setup audio widget
		try {
			setClick2CallAudioWidget(defaultConfig);
		} catch(err) {
			throw new TypeError("Cannot build click-2-call tab. Please build Click-2-Call configured for audio.");
		}
	}
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
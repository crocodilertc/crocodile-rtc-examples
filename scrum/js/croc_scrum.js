/*
 * Object Containing Global Variables
 */
var crocScrum = {
	crocApiKey: "tNODq61JhUM5gSqhHlVg",
	crocObject: null,
	crocObjectConnected: false,
	inConference: false,
	videoSession: null,
	scrumURL: null,
	isFullscreen: false
};

/*
 * Check for URL Parameters
 */
window.onload = function() {
	// Connect to the Network and check capabilities
	connectCrocObject(crocScrum.crocApiKey, "Scrum");

	// Get url parameters
	var urlParameters = {};
	crocScrum.scrumURL = window.location.href;

	crocScrum.scrumURL.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(match, key, value) {
		urlParameters[key] = value;
	});
	
	if (urlParameters.scrum) {
		// Populate text box
		var addressElem = $('.chat_room');
		addressElem.val(urlParameters.scrum);
		
		// Connect to Scrum
		window.setTimeout(function(){
			$('.join_chat').click();
		}, 2000);
	}
}

/*
 * Setup Event Handlers
 */
function doOnOrientationChange() {
	var width = $(document).width();
	var height = $(document).height();
	var videoWidth = 640;
	var videoHeight = 480;
	if (width / height > 4 / 3) {
		// Restrict height
		if (height <= 480) {
			videoWidth = height * 4 / 3;
			videoHeight = height;
		}
	} else {
		// Restrict width
		if (width <= 640) {
			videoWidth  = width;
			videoHeight  = width * 3 / 4;
		}
	}
	var leaveFormLeftMargin = (width - videoWidth) / 2;
	$('.form_leave').css('margin-left', leaveFormLeftMargin);
	$('.form_leave').width(videoWidth);
	$('.video_chat').width(videoWidth);
	$('.video_chat').height(videoHeight);
	$('.controls-container').width(videoWidth);
	$('.controls-container').height(videoHeight);
	$('.controls-container').css('margin-left', leaveFormLeftMargin);
	
	switch(window.orientation) {
		case -90:
		case 90:
		$('.video_content').addClass('video_content_fullscreen');
		$('.controls-container').addClass('controls_container_fullscreen');
		$('.croc_widget_videocall').addClass('video_widget_videocall_fullscreen');
		$('.video_chat').addClass('video_chat_fullscreen');
		$('.form_leave').addClass('form_leave_landscape');
		break;
		default:
		$('.video_content').removeClass('video_content_fullscreen');
		$('.controls-container').removeClass('controls_container_fullscreen');
		$('.croc_widget_videocall').removeClass('video_widget_videocall_fullscreen');
		$('.video_chat').removeClass('video_chat_fullscreen');
		$('.form_leave').removeClass('form_leave_landscape');
		break;
	}
}
window.addEventListener('orientationchange', doOnOrientationChange);

$(window).resize(function(){
	var width = $(window).width();
	var height = $(window).height();
	var videoWidth = 640;
	var videoHeight = 480;
	if (width / height > 4 / 3) {
		// Restrict height
		if (height <= 480) {
			var desktopHeight = height - 90 - 15;
			videoWidth = desktopHeight * 4 / 3;
			videoHeight = desktopHeight;
		}
	} else {
		// Restrict width
		if (width <= 640) {
			var desktopWidth = width - 16;
			videoWidth  = width;
			videoHeight  = width * 3 / 4;
		}
	}
	var leaveFormWidth = Math.round(videoWidth); // fix to stop leave button wrapping on window downsize to 480 x 320
	leaveFormWidth ++;
	var leaveFormLeftMargin = (width - videoWidth) / 2;
	$('.form_leave').css('margin-left', leaveFormLeftMargin);
	$('.form_leave').width(leaveFormWidth);
	$('.video_chat').width(videoWidth);
	$('.video_chat').height(videoHeight);
	$('.controls-container').width(videoWidth);
	$('.controls-container').height(videoHeight);
	$('.controls-container').css('margin-left', leaveFormLeftMargin);
});

$('.join_chat').click(function(){
	// Get value from text box
	var address = $('.chat_room').val();
	
	if (crocScrum.crocObjectConnected) {
		return;
	}
	
	// Make sure there is a value
	if (!address || typeof address === "undefined") {
		$('.error').html("Please enter a scrum name.");
		$('.error_container').removeClass('disabled');
		return;
	}
	
	var alphaNumeric = /^([a-z0-9]+)$/i;
	
	// Make sure value is alpha numeric
	if (!alphaNumeric.test(address)) {
		$('.error').html("Please enter numbers and letters only.");
		$('.error_container').removeClass('disabled');
		return;
	}
	
	$('.error_container').addClass('disabled');
	$('.error').html("");
	$('.form_join').addClass('disabled');
	$('.form_status').removeClass('disabled');
	
	// Make sure URL parameter is up to date
	crocScrum.scrumURL = window.location.origin + window.location.pathname + "?scrum=" + address;
	
	$('.display_name').val(crocScrum.scrumURL);
	
	doOnOrientationChange();
	
	address += "@click2conference.crocodilertc.net";
	
	// Disable button bar before connect
	$('.croc_tpl_bar').addClass('disabled');
	
	// Request video for chat
	requestVideo(address);
});

$(document).keypress(function(event){
	if (event.which == 13) {
		$('.join_chat').click();
	}
});

$('.croc_btn_fullscreen').click(function () {
	if (!crocScrum.isFullscreen) {
		crocScrum.isFullscreen = true;
		setVideoToFullscreen(true);
	} else {
		crocScrum.isFullscreen = false;
		setVideoToFullscreen(false);
	}
});

$('.display_name').click(function() {
	$(this).select();
});

$('.display_name').focus(function() {
	$(this).select();
});

$('.leave_chat').click(function(){
	crocScrum.videoSession.close();
});

// Determine whether to go full screen or not
function setVideoToFullscreen(enabled) {
	var initial = true;
	var uiElement = $('.video_content')[0]; // jQuery element to make full screen

	// Listen for fullscreen change, ignore initial change
	uiElement.onmozfullscreenchange = uiElement.onwebkitfullscreenchange = function(){
		if (crocScrum.isFullscreen && !initial) {
			setVideoToFullscreen(false);
		}

		initial = false;
	};

	if (enabled && !$('.video_content').hasClass('video_content_fullscreen')) {
		// Set fullscreen
		crocScrum.isFullscreen = true;
		$('.video_content').addClass('video_content_fullscreen');
		$('.controls-container').addClass('controls_container_fullscreen');
		$('.croc_widget_videocall').addClass('video_widget_videocall_fullscreen');
		$('.video_chat').addClass('video_chat_fullscreen');
		$('.croc_tpl_actions').addClass('croc_tpl_actions_fullscreen');
		$('.form_leave').addClass('form_leave_fullscreen');
		if (uiElement.requestFullscreen) {
			uiElement.requestFullscreen();
		} else if (uiElement.msRequestFullscreen) {
			uiElement.msRequestFullscreen();
		} else if (uiElement.mozRequestFullScreen) {
			uiElement.mozRequestFullScreen();
		} else if (uiElement.webkitRequestFullscreen) {
			uiElement.webkitRequestFullscreen();
		}
	} else {
		// Exit fullscreen
		crocScrum.isFullscreen = false;
		$('.video_content').removeClass('video_content_fullscreen');
		$('.controls-container').removeClass('controls_container_fullscreen');
		$('.croc_widget_videocall').removeClass('video_widget_videocall_fullscreen');
		$('.video_chat').removeClass('video_chat_fullscreen');
		$('.croc_tpl_actions').removeClass('croc_tpl_actions_fullscreen');
		$('.form_leave').removeClass('form_leave_fullscreen');
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}

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
		features: ['audio', 'video'],
		
		// The event handler to fire when connected to the network
		onConnected: function() {
			var hasAudio = crocScrum.crocObject.capabilities["sip.audio"];
			var hasVideo = crocScrum.crocObject.capabilities["sip.video"];
			var hasConferencing = crocScrum.crocObject.capabilities["croc.conference"];
			
			// Test for audio capabilities
			if (!hasAudio) {
				alert("Unable to detect audio capabilities. Please connect and enable an audio device to receive audio from Scrum.");
			}
			
			// Test for video capabilities
			if (!hasVideo) {
				alert("Unable to detect video capabilities. Scrum requires a video device to be connected and enabled.");
				$('.chat_room').attr("disabled", "disabled");
				$('.join_chat').attr("disabled", "disabled");
			}
			
			// Test for conferencing capabilities
			if (!hasConferencing) {
				alert("Scrum is not supported with this web browser; please use another web browser.");
				$('.chat_room').attr("disabled", "disabled");
				$('.join_chat').attr("disabled", "disabled");
			}
		}
	}
	
	// Instantiation of croc object with non-default configuration
	crocScrum.crocObject = $.croc(crocConfig);
}
 
/*
 * Video session set-up
 */
function requestVideo(addressToCall) {
	// Check to make sure fullscreen styling is applied if still in fullscreen
	if (document.webkitFullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.fullScreenElement) {
		$('.video_content').addClass('video_content_fullscreen');
		$('.controls-container').addClass('controls_container_fullscreen');
		$('.croc_widget_videocall').addClass('video_widget_videocall_fullscreen');
		$('.video_chat').addClass('video_chat_fullscreen');
		$('.croc_tpl_actions').addClass('croc_tpl_actions_fullscreen');
		$('.form_leave').addClass('form_leave_fullscreen');
	}
	
	// Set UI to connecting status
	$('.status').html('Connecting...');
	$('.chat_container').removeClass('disabled');
	$('.form_join').addClass('disabled');
	$('.form_status').removeClass('disabled');
	$('.spin').removeClass('disabled');
	
	// Get the address of the user to call
	var address = addressToCall;
	
	// Set up stream to be able to send and receive video and audio
	var callConfig = {
		audio: {
			send: true, receive: true
		},
		video: {
			send: true, receive: true
		}
	};
	
	// media.connect requests a media session and returns the session object
	crocScrum.videoSession = crocScrum.crocObject.media.connect(address, {
		streamConfig: callConfig
	});
	
	// The DOM video element used for playing the remote party's video
	crocScrum.videoSession.remoteVideoElement = $('.video_chat')[0];
	
	/*
	 * The event handler to fire when a session request has been accepted.
	 */
	crocScrum.videoSession.onConnect = function () {
		// Disable full screen button for hand held devices
		if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			// Enable the button bar
			$('.croc_tpl_bar').removeClass('disabled');
			$('.croc_tpl_actions').animate({
				bottom: '0px'
			});
			setTimeout(function () {
				$('.croc_tpl_actions').animate({
					bottom: '-42px'
				});
			}, 3000);
		}
		
		// Connection has been established; don't connect on click
		crocScrum.crocObjectConnected = true;
		
		// Joined Conference
		crocScrum.inConference = true;
		
		// Update UI
		$('.status').html('Connected');
		$('.form_status').addClass('disabled');
		$('.spin').addClass('disabled');
		$('.form_leave').removeClass('disabled');
	};
	
	/*
	 * The event handler to fire when a session has been closed by the 
	 * remote party or the network.
	 */
	crocScrum.videoSession.onClose = function () {
		// If never joined conference then display error
		if (!crocScrum.inConference) {
			$('.error').html("You have been disconnected.<br/> The scrum may have reached its maximum of 9 participants");
			$('.error_container').removeClass('disabled');
		}
		
		// Update Status
		$('.status').html('Disconnecting...');
		
		// Reset UI
		$('.form_leave').addClass('disabled');
		$('.video_chat').attr('src', "");
		$('.form_status').removeClass('disabled');
		$('.spin').removeClass('disabled');
		$('.form_join').removeClass('disabled');
		$('.chat_container').addClass('disabled');
		
		// Allow calls to be made on click
		crocScrum.crocObjectConnected = false;
		
		// No longer in a Scrum reset flag
		crocScrum.inConference = false;
		
		// Update Status
		$('.status').html('');
	}
}
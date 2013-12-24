// Global variables
var videoSession, transferredSession = null, ringtone;

//Setup Media session configuration
function setVideoSession (mediaSession) {
	// The DOM video element used for playing the local party's video
	mediaSession.localVideoElement = $('.croc_receive_localVideo')[0];
	
	// The DOM video element used for playing the remote party's video
	mediaSession.remoteVideoElement = $('.croc_tpl_remotevideo')[0];
	
	/* 
	 * The event handler to fire when a provisional response has been 
	 * received to a new media session request.
	 */
	mediaSession.onProvisional = function () {
		// Start the ring tone.
		ringtone.start();
		
		// Set the state element text to 'Ringing'
		$('.croc_ui_status').html('Ringing');
	};
	
	/*
	 * The event handler to fire when a session request has been accepted.
	 */
	mediaSession.onConnect = function () {
		// Switch new session to current videoSession
		if (transferredSession) {
			// Copy current session to oldSession
			var oldSession = videoSession;
			// Make the new session usable
			videoSession = transferredSession;
			// Reset transferredSession ready for a new transfer
			transferredSession = null;
			// Close the old session that is no longer used
			oldSession.close();
		}
		
		// Stop the ring tone.
		ringtone.stop();
		
		// Set the status element text to 'Connected'
		$('.croc_ui_status').html('Connected');
	};
	
	/*
	 * The event handler to fire when a call transfer request is received.
	 */
	mediaSession.onTransferRequest = function (event) {
		// Accept any incoming call transfer request
		transferredSession = event.accept();
		
		// Set the status element text to 'Transferring...'
		$('.croc_ui_status').html('Transferring...');
		
		// Configure new session
		setVideoSession(transferredSession);
	};
	
	/*
	 * The event handler to fire when a session has been closed by the 
	 * remote party or the network.
	 */
	mediaSession.onClose = function () {
		// Check its the current session, don't setup if it isn't
		if (videoSession !== mediaSession) {
			return;
		} 
		
		// Reset transferredSession ready for another transfer if/when its requested
		if (mediaSession === transferredSession) {
			// Set the status element text to 'Transfer failed'
			$('.croc_ui_status').html('Transfer failed');
			transferredSession = null;
			return;
		}
		
		// Make sure ringtone has stopped
		if (ringtone) {
			ringtone.stop();
		}
		
		// Stop duration of call
		clearInterval(setCallDuration);
		
		// Set the status element text to 'Disconnected'
		$('.croc_ui_status').html('Disconnected');
		
		// Hide the warning light to indicate there are no calls
		$('.croc_warning-light').hide();
		
		// Reset mute button
		$('.croc_btn_mute_s').removeClass('croc_selected');
		
		// Reset video pause button
		$('.croc_btn_pausevideo_s').removeClass('croc_selected');
		$('.croc_tpl_controls').removeClass('croc_ui_localvideodisabled');
		
		// Reset pop-out
		$('.croc_ui_popout').removeClass('croc_ui_popout_open');
		$('.croc_tpl_titlebar').removeClass('croc_ui_shown');
		$('.croc_tpl_actions').removeClass('croc_ui_shown');
		
		// Allow calls to be made on click
		crocObjectConnected = false;
		
		// Make sure duration of call has stopped
		clearInterval(setCallDuration);
		
		// Trigger click to collapse the tab.
		isClicked = true;
		$('.croc_side-tab').trigger('click');
	};
}

// End the call by closing media session
function endVideo() {
	videoSession.close();
}

// Mute the audio
function muteAudio() {
	// Disable the sessions audio track
	videoSession.mute();
	
	$('.croc_mute_video_audio').removeClass('croc_btn_mute_s');
	$('.croc_mute_video_audio').addClass('croc_btn_muted');
	
	// Turn icon green to show its been pressed
	$('.croc_btn_mute_s').addClass('croc_selected');
}

// Un-mute the audio
function unmuteAudio() {
	// Un-mute the sessions audio track
	videoSession.unmute();
	
	$('.croc_mute_video_audio').removeClass('croc_btn_muted');
	$('.croc_mute_video_audio').addClass('croc_btn_mute_s');
	
	// Restore icon back to white
	$('.croc_btn_mute_s').removeClass('croc_selected');
}

// Pause the remote video
function pauseVideo() {
	// Disable the sessions video track
	videoSession.localStream.getVideoTracks()[0].enabled=false;
	
	// Turn icon green to show its been pressed
	$('.croc_btn_pausevideo_s').addClass('croc_selected');
	
	// Add disabled icon to local video
	$('.croc_tpl_controls').addClass('croc_ui_localvideodisabled');
}

// Un-Pause the remote video
function resumeVideo() {
	// Un-mute the sessions video track
	videoSession.localStream.getVideoTracks()[0].enabled=true;
	
	// Restore icon back to white
	$('.croc_btn_pausevideo_s').removeClass('croc_selected');
	
	// Remove disabled icon on local video
	$('.croc_tpl_controls').removeClass('croc_ui_localvideodisabled');
}

// Determine whether to go full screen or not
function setVideoToFullscreen(enabled) {
	var initial = true;
	var uiElement = $('.croc_widget_videocall')[0]; // jQuery element to make full screen

	// Listen for fullscreen change, ignore initial change
	uiElement.onmozfullscreenchange = uiElement.onwebkitfullscreenchange = function(){
		if (isFullscreen && !initial) {
			setVideoToFullscreen(false);
		}

		initial = false;
	};

	if (enabled && !$('.croc_widget_videocall').hasClass('croc_ui_fullscreen')) {
		// Set fullscreen
		isFullscreen = true;
		$('.croc_widget_videocall').addClass('croc_ui_fullscreen');
		if (uiElement.webkitRequestFullscreen) {
			uiElement.webkitRequestFullscreen();
		} else if (uiElement.mozRequestFullscreen) {
			uiElement.mozRequestFullscreen();
		}
	} else {
		// Exit fullscreen
		isFullscreen = false;
		$('.croc_widget_videocall').removeClass('croc_ui_fullscreen');
		if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozExitFullscreen) {
			document.mozExitFullscreen();
		}
	}
}

// Video session set-up
function requestVideo(addressToCall) {
	// Connection has been established; don't connect on click
	crocObjectConnected = true;
	
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
	
	// Show the warning light to indicate a call is live
	$('.croc_warning-light').show();
	
	// Set the status element text to 'Connecting'
	$('.croc_ui_status').html('Connecting');
	
	// Set the duration element to start timing the duration of the call
	var callStartDate = new Date().getTime();
	setDuration(callStartDate);
	
	// Set up ring tone frequency
	var ringtone_frequency = localisations[ringtoneToUse].ringbacktone.freq;
	
	// Set up ring tone timing
	var ringtone_timing = localisations[ringtoneToUse].ringbacktone.timing;
	
	// Create an instance of the ring tone object
	ringtone = new audio.Ringtone(ringtone_frequency, ringtone_timing);
	
	// media.connect requests a media session and returns the session object
	videoSession = crocObject.media.connect(address, {
		streamConfig: callConfig
	});
	
	// Configure new session
	setVideoSession(videoSession);
}
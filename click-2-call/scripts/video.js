// Global variables
var videoSession, ringtone;

//End the call by closing media session
function endVideo() {
	videoSession.close();
}

// Mute the audio
function muteAudio() {
	
	// Disable the sessions audio track
	videoSession.localStream.getAudioTracks()[0].enabled=false;
	
	// Turn icon green to show its been pressed
	$('.btn_mute').addClass('selected');
}

// Un-mute the audio
function unmuteAudio() {
	
	// Un-mute the sessions audio track
	videoSession.localStream.getAudioTracks()[0].enabled=true;
	
	// Restore icon back to white
	$('.btn_mute').removeClass('selected');
}

// Pause the remote video
function pauseVideo() {
	
	// Disable the sessions video track
	videoSession.localStream.getVideoTracks()[0].enabled=false;
	
	// Turn icon green to show its been pressed
	$('.btn_pausevideo').addClass('selected');
	
	// Add disabled icon to local video
	$('.tpl_videopicture').removeClass('enabled_picture');
	$('.tpl_videopicture').addClass('disabled_picture');
}

// Un-Pause the remote video
function resumeVideo() {
	
	// Un-mute the sessions video track
	videoSession.localStream.getVideoTracks()[0].enabled=true;
	
	// Restore icon back to white
	$('.btn_pausevideo').removeClass('selected');
	
	// Remove disabled icon on local video
	$('.tpl_videopicture').removeClass('disabled_picture');
	$('.tpl_videopicture').addClass('enabled_picture');
}

// Determine whether to go full screen or not
function setVideoToFullscreen(enabled) {
	var initial = true;
	var uiElement = $('.widget_videocall')[0]; // jQuery element to make full screen

	// Listen for fullscreen change, ignore initial change
	uiElement.onmozfullscreenchange = uiElement.onwebkitfullscreenchange = function(){
		if(isFullscreen && !initial) {
			setVideoToFullscreen(false);
		}

		initial = false;
	};

	if(enabled && !$('.widget_videocall').hasClass('ui_fullscreen')){
		// Set fullscreen
		isFullscreen = true;
		$('.widget_videocall').addClass('ui_fullscreen');
		if(uiElement.webkitRequestFullscreen) {
			uiElement.webkitRequestFullscreen();
		} else if(uiElement.mozRequestFullscreen) {
			uiElement.mozRequestFullscreen();
		}
	} else {
		// Exit fullscreen
		isFullscreen = false;
		$('.widget_videocall').removeClass('ui_fullscreen');
		if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if(document.mozExitFullscreen) {
			document.mozExitFullscreen();
		}
	}
}

// video session set-up
function requestVideo(crocApiKey, addressToCall) {
	
	// CrocSDK API Configuration
	var crocConfig = {
		// The API Key registered to the Crocodile RTC SDK Network
		apiKey: crocApiKey,
		
		// The event handler to fire when connected to the network
		onConnected: function() {
			
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

			// media.connect requests a media session and returns the session object
			videoSession = crocObject.media.connect(address, {
				streamConfig: callConfig
			});
			
			// Show the warning light to indicate a call is live
			$('.warning-light').show();
			
			// Set remote party's address
			$('.ui_uri').html(address);
			
			// Set the status element text to 'Connecting'
			$('.ui_status').html('Connecting');
			
			// Set the duration element to start timing the duration of the call
			var callStartDate = new Date().getTime();
			setDuration(callStartDate);

			// The DOM video element used for playing the local party's video.
			videoSession.localVideoElement = $('.tpl_localvideo')[0];
			
			// The DOM video element used for playing the remote party's video.
			videoSession.remoteVideoElement = $('.tpl_remotevideo')[0];
			
			// Set up ring tone frequency to Great Britain. 
			var ringtone_frequency = localisations[ringtoneToUse].ringbacktone.freq;
			
			// Set up ring tone timing to Great Britain.
			var ringtone_timing = localisations[ringtoneToUse].ringbacktone.timing;
			
			// Create an instance of the ring tone object.
			ringtone = new audio.Ringtone(ringtone_frequency, ringtone_timing);
			
			/* 
			 * The event handler to fire when a provisional response has been received 
			 * to a new media session request.
			 */
			videoSession.onProvisional = function () {
				
				// Start the ring tone.
				ringtone.start();
				
				// Set the status element text to 'Ringing'
				$('.ui_status').html('Ringing');
			};
			
			/*
			 * The event handler to fire when a session request has been accepted.
			 */
			videoSession.onConnect = function () {
				
				// Stop the ring tone.
				ringtone.stop();
				
				// Set the status element text to 'Connected'
				$('.ui_status').html('Connected');
			};
			
			/*
			 * The event handler to fire when a session has been closed by the remote 
			 * party or the network.
			 */
			videoSession.onClose = function () {
				
				// Make sure ringtone has stopped
				if (ringtone) {
					ringtone.stop();
				}
				
				// Stop duration of call
				clearInterval(setCallDuration);
				
				// Set the status element text to 'Disconnected'
				$('.ui_status').html('Disconnected');
				
				// Hide the warning light to indicate there are no calls
				$('.warning-light').hide();
				
				// Close down connection to network
				crocObject.disconnect();
			};
		},
		
		/*
		 * The event handler to fire when a user been has disconnected from 
		 * the network.
		 */
		onDisconnected: function () {
			
			// Make sure ringtone has stopped
			if (ringtone) {
				ringtone.stop();
			}
			
			// Allow calls to be made on click
			crocObjectConnected = false;
			
			// Make sure duration of call has stopped
			clearInterval(setCallDuration);
			
			// Trigger click to collapse the tab.
			isClicked = true;
			$('.side-tab').trigger('click');
		}
	};

	// Instantiation of croc object with basic configuration
	crocObject = $.croc(crocConfig);
}
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
}

// Un-mute the audio
function unmuteAudio() {
	// Un-mute the sessions audio track
	videoSession.unmute();
	
	$('.croc_mute_video_audio').removeClass('croc_btn_muted');
	$('.croc_mute_video_audio').addClass('croc_btn_mute_s');
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

// Setup video widget html and event handlers
function setClick2CallVideoWidget(config) {
	if (!videoWidgetHtml) {
		throw new TypeError(config.click2callMediaWidget + "widget has not been set, cannot build click-2-call tab");
	}
	
	orientationOfClick2Call = config.click2callOrientation;
	
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
					requestVideo(config.addressToCall);
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
	var htmlElement = $(config.appendClick2callTo);
	var i;
	
	// Add the HTML as a child of the element specified in the configuration if the element exists.
	if (htmlElement.length !== 0) {
		// For every HTML element of that kind, add video tab
		for (i=0; i < htmlElement.length; i++) {
			// Check that document contains HTML element
			if ($.contains(document, htmlElement[i])) {
				// Add video tab
				$(config.appendClick2callTo).append(videoWidgetHtml);
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
	
	/*
	 * Setup the position of the click to call tab; fixed or absolute
	 */
	var positionOfClick2Call = config.click2callPosition;
	mediaWidget = config.click2callMediaWidget;
	
	// Add to correct widget only if value is absolute or fixed
	if (mediaWidget === 'video' && positionOfClick2Call === 'absolute' || positionOfClick2Call === 'fixed') {
		// Change css position to user defined/default position
		$('.croc_tab-wrapper-video').css('position', config.click2callPosition);
	}
	
	/*
	 * Setup the tab orientation on screen; top, right, bottom or left
	 */
	switch (orientationOfClick2Call) {
	case 'top':
		$('.croc_tab-container').removeClass('croc_tab-wrapper-video');
		$('.croc_tab-container').addClass('croc_video-top-tab');
		$('.croc_side-tab').removeClass('croc_rotate-vertical');
		$('.croc_side-tab').addClass('croc_video-top-side-tab');
		$('.croc_side-tab-content-video').addClass('croc_video-top-content');
		$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
		break;
	case 'bottom':
		$('.croc_tab-container').removeClass('croc_tab-wrapper-video');
		$('.croc_tab-container').addClass('croc_video-bottom-tab');
		$('.croc_side-tab').removeClass('croc_rotate-vertical');
		$('.croc_side-tab').addClass('croc_video-side-tab-bottom');
		$('.croc_side-tab-content-video').addClass('croc_video-bottom-content');
		break;
	case 'left':
		$('.croc_tab-container').addClass('croc_video-left-tab');
		$('.croc_side-tab-content-video').addClass('croc_video-left-content');
		$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
		break;
	default:
		break;
	}
}
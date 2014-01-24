// Global variables
var audioSession, transferredSession = null, ringtone;

// Setup Media session configuration
function setAudioSession (mediaSession) {
	// The DOM audio element used for playing the remote party's audio
	mediaSession.remoteAudioElement = $('.croc_receive-audio')[0];
	
	/* 
	 * The event handler to fire when a provisional response has been 
	 * received to a new media session request.
	 */
	mediaSession.onProvisional = function () {
		// Start the ring tone.
		ringtone.start();
		
		// Set the state element text to 'Ringing'
		$('.croc_tpl_status').html('Ringing');
	};
	
	/*
	 * The event handler to fire when a session request has been accepted.
	 */
	mediaSession.onConnect = function () {
		// Switch new session to current audioSession
		if (transferredSession) {
			// Copy current session to oldSession
			var oldSession = audioSession;
			// Make the new session usable
			audioSession = transferredSession;
			// Reset transferredSession ready for a new transfer
			transferredSession = null;
			// Close the old session that is no longer used
			oldSession.close();
		}
		
		// Stop the ring tone.
		ringtone.stop();
		
		// Set the status element text to 'Connected'
		$('.croc_tpl_status').html('Connected');
	};
	
	/*
	 * The event handler to fire when a call transfer request is received.
	 */
	mediaSession.onTransferRequest = function (event) {
		// Accept any incoming call transfer request
		transferredSession = event.accept();
		
		// Set the status element text to 'Transferring...'
		$('.croc_tpl_status').html('Transferring...');
		
		// Configure new session
		setAudioSession(transferredSession);
	};
	
	/*
	 * The event handler to fire when a session has been closed by the 
	 * remote party or the network.
	 */
	mediaSession.onClose = function () {
		// Check its the current session, don't setup if it isn't
		if(audioSession !== mediaSession) {
			return;
		} 
		
		// Reset transferredSession ready for another transfer if/when its requested
		if(mediaSession === transferredSession){
			// Set the status element text to 'Transfer failed'
			$('.croc_tpl_status').html('Transfer failed');
			transferredSession = null;
			return;
		}
		
		// Make sure ringtone has stopped
		if (ringtone) {
			ringtone.stop();
		}
		
		// Allow calls to be made on click
		crocObjectConnected = false;
		
		// Stop duration of call
		clearInterval(setCallDuration);
		
		// Set the status element text to 'Disconnected'
		$('.croc_tpl_status').html('Disconnected');
		
		// Hide the warning light to indicate there are no calls
		$('.croc_warning-light').hide();
		
		// Reset mute button
		$('.croc_mute_audio').removeClass('croc_btn_muted');
		$('.croc_mute_audio').addClass('croc_btn_mute_s');
		
		// Reset pop-out
		$('.croc_ui_popout').removeClass('croc_ui_popout_open');
		$('.croc_tpl_titlebar').removeClass('croc_ui_shown');
		$('.croc_tpl_actions').removeClass('croc_ui_shown');
		
		// Trigger click to collapse the tab
		isClicked = true;
		$('.croc_side-tab').trigger('click');
	};
}

// End the call by closing media session
function endAudio() {
	// Close down connection to network.
	audioSession.close();
}

// Mute the audio call
function muteAudioCall() {
	// Mute the sessions audio track
	audioSession.mute();
	
	$('.croc_mute_audio').removeClass('croc_btn_mute_s');
	$('.croc_mute_audio').addClass('croc_btn_muted');
}

// Un-mute the audio call
function unmuteAudioCall() {
	// Un-mute the sessions audio track
	audioSession.unmute();
	
	$('.croc_mute_audio').removeClass('croc_btn_muted');
	$('.croc_mute_audio').addClass('croc_btn_mute_s');
}

// Audio session set-up
function requestAudio(addressToCall) {
	// Connection has been established; don't connect on click
	crocObjectConnected = true;
	
	// Show the warning light to indicate a call is live
	$('.croc_warning-light').show();
	
	// Set the status element text to 'Connecting'
	$('.croc_tpl_status').html('Connecting');
	
	// Set the duration element to start timing the duration of the call
	var callStartDate = new Date().getTime();
	setDuration(callStartDate);
	
	// Get the address of the user to call
	var address = addressToCall;
	
	// Set up stream to be able to send and receive audio
	var callConfig = {
			audio: {
				send: true, receive: true
			}
	};
	
	// Set up ring tone frequency 
	var ringtone_frequency = localisations[ringtoneToUse].ringbacktone.freq;
	
	// Set up ring tone timing
	var ringtone_timing = localisations[ringtoneToUse].ringbacktone.timing;
	
	// Create an instance of the ring tone object
	ringtone = new audio.Ringtone(ringtone_frequency, ringtone_timing);
	
	// media.connect requests a media session and returns the session object
	audioSession = crocObject.media.connect(address, {
		streamConfig: callConfig
	});
	
	// Configure new session
	setAudioSession(audioSession);
}

function setClick2CallAudioWidget(config) {
	if (!audioWidgetHtml) {
		throw new TypeError(config.click2callMediaWidget + "widget has not been set, cannot build click-2-call tab");
	}
	
	orientationOfClick2Call = config.click2callOrientation;
	
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
					requestAudio(config.addressToCall);
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
					if (currentTarget[0] === evt.target[0]) {
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
	
	// Get the HTML element to append to
	var htmlElement = $(config.appendClick2callTo);
	var i;
	
	// Add the HTML as a child of the element specified in the configuration if the element exists.
	if (htmlElement.length !== 0) {
		// For every HTML element of that kind, add audio tab
		for (i=0; i < htmlElement.length; i++) {
			// Check that document contains HTML element
			if ($.contains(document, htmlElement[i])) {
				// Add audio tab
				$(config.appendClick2callTo).append(audioWidgetHtml);
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
	
	/*
	 * Setup the position of the click to call tab; fixed or absolute
	 */
	var positionOfClick2Call = config.click2callPosition;
	mediaWidget = config.click2callMediaWidget;
	
	if (mediaWidget === 'audio' && positionOfClick2Call === 'absolute' || positionOfClick2Call === 'fixed') {
		// Change css position to user defined/default position
		$('.croc_tab-wrapper').css('position', config.click2callPosition);
	}
	
	/*
	 * Setup the tab orientation on screen; top, right, bottom or left
	 */
	switch (orientationOfClick2Call) {
	case 'top':
		$('.croc_tab-container').removeClass('croc_tab-wrapper');
		$('.croc_tab-container').addClass('croc_audio-top-tab');
		$('.croc_side-tab').removeClass('croc_rotate-vertical');
		$('.croc_side-tab').addClass('croc_audio-side-tab-top');
		$('.croc_side-tab-content').addClass('croc_audio-top-content');
		$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
		$('.croc_powered_by_audio').addClass('croc_top');
		break;
	case 'bottom':
		$('.croc_tab-container').removeClass('croc_tab-wrapper');
		$('.croc_tab-container').addClass('croc_audio-bottom-tab');
		$('.croc_side-tab').removeClass('croc_rotate-vertical');
		$('.croc_side-tab').addClass('croc_rotate-horizontal');
		$('.croc_side-tab-content').addClass('croc_audio-bottom-content');
		break;
	case 'left':
		$('.croc_tab-container').addClass('croc_audio-left-tab');
		$('.croc_side-tab-content').addClass('croc_audio-left-content');
		$('.croc_side-tab').css('borderRadius', '0 0 10px 10px');
		break;
	default:
		break;
	}
}
// Global variables
var audioSession, transferredSession = null, ringtone;

// Setup Media session configuration
function setAudioSession (mediaSession) {
	
	// The DOM audio element used for playing the remote party's audio
	mediaSession.remoteAudioElement = $('.receive-audio')[0];
	
	/* 
	 * The event handler to fire when a provisional response has been 
	 * received to a new media session request.
	 */
	mediaSession.onProvisional = function () {
		
		// Start the ring tone.
		ringtone.start();
		
		// Set the state element text to 'Ringing'
		$('.tpl_status').html('Ringing');
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
		$('.tpl_status').html('Connected');
	};
	
	/*
	 * The event handler to fire when a call transfer request is received.
	 */
	mediaSession.onTransferRequest = function (event) {
		
		// Accept any incoming call transfer request
		transferredSession = event.accept();
		
		// Set the status element text to 'Transferring...'
		$('.tpl_status').html('Transferring...');
		
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
			$('.tpl_status').html('Transfer failed');
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
		$('.tpl_status').html('Disconnected');
		
		// Hide the warning light to indicate there are no calls
		$('.warning-light').hide();
		
		// Reset mute button
		$('.btn_mute_s').removeClass('disabled');
		
		// Reset pop-out
		$('.ui_popout').removeClass('ui_popout_open');
		$('.tpl_titlebar').removeClass('ui_shown');
		$('.tpl_actions').removeClass('ui_shown');
		
		// Close down connection to network.
		crocObject.disconnect();
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
	
	// Add transparency to show mute button has been pressed
	$('.btn_mute_s').addClass('disabled');
}

// Un-mute the audio call
function unmuteAudioCall() {
	
	// Un-mute the sessions audio track
	audioSession.unmute();
	
	// Restore icon back to white by removing transparency
	$('.btn_mute_s').removeClass('disabled');
}

// Audio session set-up
function requestAudio(crocApiKey, addressToCall, crocDisplayName) {
	
	// CrocSDK API Configuration
	var crocConfig = {
		// The API Key registered to the Crocodile RTC SDK Network
		apiKey: crocApiKey,
		
		// The text to display to call recipient
		displayName: crocDisplayName,
		
		// The features that the application will implement
		features: ['audio', 'video', 'transfer'],
		
		// The event handler to fire when connected to the network
		onConnected: function() {
			
			// Connection has been established; don't connect on click
			crocObjectConnected = true;
			
			// Show the warning light to indicate a call is live
			$('.warning-light').show();
			
			// Set remote party's address
			/*$('.ui_uri').html(address);*/
			
			// Set the status element text to 'Connecting'
			$('.tpl_status').html('Connecting');
			
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
			
			// Stop duration of call
			clearInterval(setCallDuration);
			
			// Allow calls to be made on click
			crocObjectConnected = false;

			// Trigger click to collapse the tab
			isClicked = true;
			$('.side-tab').trigger('click');
		}
	};

	// Instantiation of CrocSDK croc object with basic configuration
	crocObject = $.croc(crocConfig);
}
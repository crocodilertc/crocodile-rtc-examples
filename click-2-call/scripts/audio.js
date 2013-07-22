// Global variables
var audioSession, ringtone;

// End the call by closing media session
function endAudio() {
	audioSession.close();
}

// Mute the audio call
function muteAudioCall() {
	
	// Mute the sessions audio track
	audioSession.localStream.getAudioTracks()[0].enabled=false;
	
	// Add transparency to show mute button has been pressed
	$('.btn_mute').addClass('disabled');
}

// Un-mute the audio call
function unmuteAudioCall() {
	
	// Un-mute the sessions audio track
	audioSession.localStream.getAudioTracks()[0].enabled=true;
	
	// Restore icon back to white by removing transparency
	$('.btn_mute').removeClass('disabled');
}

// Audio session set-up
function requestAudio(crocApiKey, addressToCall) {
	
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
			
			// Set up stream to be able to send and receive audio
			var callConfig = {
					audio: {
						send: true, receive: true
					}
			};
			
			// media.connect requests a media session and returns the session object
			audioSession = crocObject.media.connect(address, {
				streamConfig: callConfig
			});
			
			// Show the warning light to indicate a call is live
			$('.warning-light').show();
			
			switch (orientationOfClick2Call) {
			case 'top':
				if (mediaWidget === 'audio' && orientationOfClick2Call === 'top') {
					$('.tab-container').removeClass('audio-tab-top');
					$('.tab-container').addClass('audio-tab-top-light-on');
				}
				break;
			default:
			case 'left':
				$('.tab-container').css({top: '94px'});
				break;
			case 'bottom':
				break;
			}
			
			// Set remote party's address
			$('.ui_uri').html(address);
			
			// Set the status element text to 'Connecting'
			$('.tpl_status').html('Connecting');
			
			// Set the duration element to start timing the duration of the call
			var callStartDate = new Date().getTime();
			setDuration(callStartDate);
			
			// The DOM audio element used for playing the remote party's audio.
			audioSession.remoteAudioElement = $('.receive-audio')[0];
			
			/* 
			 * The event handler to fire when a provisional response has been 
			 * received to a new media session request.
			 */
			audioSession.onProvisional = function () {
				
				// Set up ring tone frequency to Great Britain. 
				var ringtone_frequency = localisations[ringtoneToUse].ringbacktone.freq;
				
				// Set up ring tone timing to Great Britain.
				var ringtone_timing = localisations[ringtoneToUse].ringbacktone.timing;
				
				// Create an instance of the ring tone object.
				ringtone = new audio.Ringtone(ringtone_frequency, ringtone_timing);
				
				// Start the ring tone.
				ringtone.start();
				
				// Set the state element text to 'Ringing'.
				$('.tpl_status').html('Ringing');
			};
			
			/*
			 * The event handler to fire when a session request has been accepted.
			 */
			audioSession.onConnect = function () {
				
				// Stop the ring tone.
				ringtone.stop();
				
				// Set the status element text to 'Connected'.
				$('.tpl_status').html('Connected');
			};
			
			/*
			 * The event handler to fire when a session has been closed by the 
			 * remote party or the network.
			 */
			audioSession.onClose = function () {
				
				// Stop duration of call
				clearInterval(setCallDuration);
				
				// Set the status element text to 'Disconnected'
				$('.tpl_status').html('Disconnected');
				
				// Hide the warning light to indicate there are no calls
				$('.warning-light').hide();
				
				switch (orientationOfClick2Call) {
				case 'top':
					if (mediaWidget === 'audio' && orientationOfClick2Call === 'top') {
						$('.tab-container').removeClass('audio-tab-top-light-on');
						$('.tab-container').addClass('audio-tab-top');
					}
					break;
				default:
				case 'left':
				case 'right':
					$('.tab-container').css({top: '100px'});
					break;
				case 'bottom':
					break;
				}
				
				// Close down connection to network.
				crocObject.disconnect();
			};
		},
		
		/*
		 * The event handler to fire when a user been has disconnected from 
		 * the network.
		 */
		onDisconnected: function () {
			// Allow calls to be made on click
			crocObjectConnected = false;
			
			// Make sure duration of call has stopped
			clearInterval(setCallDuration);

			// Trigger click to collapse the tab.
			isClicked = true;
			$('.side-tab').trigger('click');
		}
	};

	// Instantiation of CrocSDK croc object with basic configuration
	crocObject = $.croc(crocConfig);
}
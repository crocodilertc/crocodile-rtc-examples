(function(){
	var CrocExample = function(config){
		this.address = config.address;					// Destination address
		this.callType = config.callType		|| 'audio';		// Default to audio call
		this.location = config.location		|| $('<div>');		// Use new DOM element for backup
		this.apiKey = config.apiKey;					// Specified API key
		this.localisation = config.localisation	|| 'gb';		// Localisation for ringbacktone
		this.displayName = config.displayName	|| 'Crocodile Click';	// Display Name

		this.connect();
	};

	CrocExample.prototype = {
		connect : function(){
			var This = this;

			var config = {};

			config.apiKey = this.apiKey;
			config.features = ['audio', 'transfer'];
			config.displayName = this.displayName;

			if(this.callType === 'video')
				config.features.push('video');

			config.onConnected = function(evt){
				This.call();
			};

			config.onDisconnected = function(evt){

			};

			this.crocObj = new $.croc(config);
		},

		// Start the call
		call : function(){
			if(this.callType === 'audio')
				this.session = new AudioWidget(this);
			else
				this.session = new VideoWidget(this);
			this.session.connect();
		},

		onClose : function(){}
	};

	var CallWidget = function(stack, session){
		this.sessionObj = session || null;
		this.stack = stack;
		this.address = this.stack.address;
	};

	CallWidget.prototype = {
		init : function(){
			var This = this;

			// Setup keypad popout
			this.content.find('.ui_popout').click(function(evt){
				$('body').click(function(evt2){
					// Dont close if popout content is pressed
					var currentTarget = $(evt.target);
					while(currentTarget[0]){
						if(currentTarget[0] === evt.target[0])
							return;
						currentTarget = currentTarget.parent();
					}

					// Close the popout
					$('body').off('click');

					This.content.find('.ui_popout').removeClass('ui_popout_open');
				});

				// Open the popout
				evt.stopPropagation();
				This.content.find('.ui_popout').addClass('ui_popout_open');
			});

			this.content.find('.ui_popout').removeClass('ui_popout_open');

			// Setup keypad buttons
			var keypad = this.content.find('.ui_keypad');
			keypad.find('.tpl_key').click(function(){
				var value = $(this).find('.tpl_main').text();
				This.sessionObj.sendDTMF(value);
			});

		},

		connect : function(){
			var This = this;

			this.setRemoteAddress(this.address);

			// Show widget
			setTimeout(function(){
				This.content.removeClass('hidden');
			}, 100);

			// Set ringtone
			var localisation = Localisations[this.stack.localisation];
			this.ringTone = new Audio.Ringtone(localisation.ringbacktone.freq, localisation.ringbacktone.timing);

			var config = {};

			// Set stream configuration
			config.streamConfig = {};
			config.streamConfig.audio = { send : true, receive : true };
			if(this.stack.callType === 'video')
				config.streamConfig.video = { send : true, receive : true };
			else
				config.streamConfig.video = null;

			// Start the call session
			this.sessionObj = this.stack.crocObj.media.connect(this.address, config);

			// Attach events
			this.setSession(this.sessionObj);

			this.setStatus(Strings.CALL_STATUS_CONNECTING);

			this.startTime = new Date();

			// Start duration going
			this.durationTimer = setInterval(function(){
				var curTime = new Date();
				var timeText = This.formatDuration(This.startTime.getTime(), curTime.getTime(), '%H:%i:%s');
				This.setDuration(timeText);
			}, 1000);
		},

		setSession : function(sessionObj){
			var This = this;

			// Get local and remote elements
			sessionObj.remoteAudioElement = this.remoteElement;
			sessionObj.remoteVideoElement = this.remoteElement;
			sessionObj.localVideoElement = this.localElement;

			// When call is connected
			sessionObj.onConnect = function(evt){
				if(This.transferSession) {
					var oldSession = This.sessionObj;
					This.sessionObj = This.transferSession;
					This.transferSession = null;
					oldSession.close();
				}

				This.startTime = new Date();
				This.ringTone.stop();
				This.setStatus(Strings.CALL_STATUS_CONNECTED);
			};
			// When call is closed (either side)
			sessionObj.onClose = function(evt){
				if(This.sessionObj !== this)
					return;
				if(this === This.transferSession){
					This.setStatus(Strings.CALL_STATUS_TRANSFER_FAILED);
					This.transferSession = null;
					return;
				}

				clearInterval(This.durationTimer);

				This.ringTone.stop();
				This.setStatus(Strings.CALL_STATUS_DISCONNECTED);
				This.stack.crocObj.disconnect();

				// Remove from interface
				This.content.addClass('hidden');
				setTimeout(function(){
					This.content.remove();
				}, 1000);

				This.stack.onClose();
			};
			// When connecting
			sessionObj.onConnecting = function(evt){
				This.setStatus(Strings.CALL_STATUS_CONNECTING);
			};
			// When ringing
			sessionObj.onProvisional = function(evt){
				This.ringTone.start();
				This.setStatus(Strings.CALL_STATUS_RINGING);
			};
			// When received transfer request
			sessionObj.onTransferRequest = function(evt){
				This.transferSession = evt.accept();
				This.setStatus(Strings.CALL_STATUS_TRANSFERRING);

				This.setSession(This.transferSession);
			};
		},

		// Close session
		close : function(){
			this.sessionObj.close();
		},

		// Mute/Unmute
		toggleMute : function(){
			var track = this.sessionObj.localStream.getAudioTracks()[0];
			if(track.enabled)
				track.enabled = false;
			else
				track.enabled = true;
			return track.enabled;
		},

		// Format duration to human readable format using two dates (Seconds since epoch)
		formatDuration : function(time1, time2, format){
			var duration = ((time1 < time2)?(time2 - time1):(time1 - time2))/1000;

			var hours = parseInt(duration / 3600, 10);
			var minutes = parseInt(duration / 60, 10);
			var seconds = parseInt(duration, 10);

			if(minutes >= 1)
				seconds -= minutes*60;
			if(hours >= 1)
				minutes -= hours*60;

			var string = format.replace('%H', (((""+hours).length > 1)?hours:('0' + hours)));
			string = string.replace('%i', (((""+minutes).length > 1)?minutes:('0' + minutes)));
			string = string.replace('%s', (((""+seconds).length > 1)?seconds:('0' + seconds)));

			return string;
		},

		setRemoteAddress : function(address){},
		setStatus : function(status){},
		setDuration : function(duration){}
	};

	var AudioWidget = function(crocObj, session){
		CallWidget.call(this, crocObj, session);

		this.init();
	};

	// AudioWidget extends CallWidget
	$.extend(AudioWidget.prototype, CallWidget.prototype, {
		init : function(){
			var This = this;

			this.content = AudioWidgetHtml.clone();

			CallWidget.prototype.init.call(this);

			this.remoteElement = this.content.find('audio')[0];

			this.content.find('.btn_close').click(function(){
				This.close();
			});
			this.content.find('.btn_mute_s').click(function(){
				This.toggleMute();
			});
			this.content.find('.btn_endcall_s').click(function(){
				This.close();
			});

			this.stack.location.append(this.content);
		},
		setRemoteAddress : function(address){
			this.content.find('.tpl_remoteid .ui_uri').text(address);
		},
		toggleMute : function(){
			if(CallWidget.prototype.toggleMute.call(this))
				this.content.find('.btn_mute_s').removeClass('selected');
			else
				this.content.find('.btn_mute_s').addClass('selected');
		},
		setStatus : function(status){
			this.content.find('.tpl_details .tpl_status').text(status);
		},
		setDuration : function(duration){
			this.content.find('.tpl_details .ui_duration').text(duration);
		}
	});

	var VideoWidget = function(stack, session){
		CallWidget.call(this, stack, session);

		this.init();
	};

	// VideoWidget extends CallWidget
	$.extend(VideoWidget.prototype, CallWidget.prototype, {
		init : function(){
			var This = this;

			this.content = VideoWidgetHtml.clone();

			CallWidget.prototype.init.call(this);

			this.localElement = this.content.find('.tpl_localvideo video')[0];
			this.remoteElement = this.content.find('video.tpl_remotevideo')[0];

			this.content.find('.btn_close').click(function(){
				This.close();
			});
			this.content.find('.btn_fullscreen').click(function(){
				This.setFullscreen(true);
			});
			this.content.find('.btn_mute_s').click(function(){
				This.toggleMute();
			});
			this.content.find('.btn_endcall_s').click(function(){
				This.close();
			});
			this.content.find('.btn_pausevideo_s').click(function(){
				This.toggleVideo();
			});
			this.content.find('.btn_localvideo').click(function(){
				var element = This.content.find('.tpl_controls');
				if(element.hasClass('ui_localvideoshown')){
					element.removeClass('ui_localvideoshown');
				} else {
					element.addClass('ui_localvideoshown');
				}
			});

			this.stack.location.append(this.content);
		},

		// Set whether widget is in fullscreen mode
		setFullscreen : function(enabled){
			var This = this;

			var initial = true;
			var element = this.content[0];

			// Listen for fullscreen change, ignore initial change
			element.onmozfullscreenchange = element.onwebkitfullscreenchange = function(){
				if(This.fullscreen && !initial)
					This.setFullscreen(false);

				initial = false;
			};

			if(enabled && !this.content.hasClass('ui_fullscreen')){
				// Set fullscreen
				this.fullscreen = true;
				this.content.addClass('ui_fullscreen');
				if(element.webkitRequestFullscreen)
					element.webkitRequestFullscreen();
				else if(element.mozRequestFullscreen)
					element.mozRequestFullscreen();
			} else {
				// Exit fullscreen
				this.fullscreen = false;
				this.content.removeClass('ui_fullscreen');
				if(document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if(document.mozExitFullscreen) {
					document.mozExitFullscreen();
				}
			}
		},

		toggleMute : function(){
			if(CallWidget.prototype.toggleMute.call(this))
				this.content.find('.btn_mute_s').removeClass('selected');
			else
				this.content.find('.btn_mute_s').addClass('selected');
		},

		toggleVideo : function(){
			var track = this.sessionObj.localStream.getVideoTracks()[0];
			if(track.enabled) {
				track.enabled = false;
				this.content.find('.btn_pausevideo_s').addClass('selected');
			} else {
				track.enabled = true;
				this.content.find('.btn_pausevideo_s').removeClass('selected');
			}
			return track.enabled;
		},

		setRemoteAddress : function(address){
			this.content.find('.title_control .ui_uri').text(address);
		},
		setStatus : function(status){
			this.content.find('.title_control .ui_status').text(status);
		},
		setDuration : function(duration){
			this.content.find('.title_control .ui_duration').text(duration);
		}
	});

	// Language strings (GB)
	var Strings = {
		CALL_STATUS_DISCONNECTED	: 'Disconnected',
		CALL_STATUS_CONNECTING		: 'Connecting',
		CALL_STATUS_RINGING		: 'Ringing',
		CALL_STATUS_CONNECTED		: 'Connected',
		CALL_STATUS_TRANSFERRING	: 'Transferring...',
		CALL_STATUS_TRANSFER_FAILED	: 'Transfer failed'
	};

	// Ringtone synthesizer
	var Audio = {
		supportsWebAudio : function() {
			if(!this.getContext() || !((window.webkitAudioContext || window.AudioContext).prototype.createOscillator)) {
				return false;
			}

			return true;
		},

		setContext : function(context) {
			this.context = context;
		},

		getContext : function() {
			return this.context;
		}
	};

	// Tone class for creating a 1 frequency tone
	Audio.Tone = function(frequency) {
		if(!Audio.supportsWebAudio()) {
			return false;
		}

		this.node = Audio.getContext().createOscillator();
		this.node.type = 0;
		this.node.frequency.value = frequency;
	};

	Audio.Tone.prototype = {
		// Start Tone
		start : function(){
			if(this.playing || !Audio.supportsWebAudio()) {
				return;
			}

			this.playing = true;

			this.node.connect(Audio.getContext().destination);
			if(this.node.noteOn) {
				this.node.noteOn(0);
			}
		},

		// Stop Tone
		stop : function() {
			if(!this.playing || !Audio.supportsWebAudio()) {
				return;
			}

			this.playing = false;

			this.node.disconnect();
		}
	};

	// Create multiple tones with array of frequencies
	Audio.ToneGroup = function(frequencies) {
		this.tones = [];

		this.playing = false;

		for(var i = 0 ; i < frequencies.length ; i++) {
			var tone = new Audio.Tone(frequencies[i]);
			this.tones.push(tone);
		}
	};

	Audio.ToneGroup.prototype = {
		// Check if group is playing
		isPlaying : function() {
			return this.playing;
		},

		// Start tone group
		start : function() {
			if(this.playing) {
				return;
			}

			this.playing = true;

			for(var i = 0 ; i < this.tones.length ; i++) {
				this.tones[i].start();
			}
		},

		// Stop tone group
		stop : function() {
			if(!this.playing) {
				return;
			}

			this.playing = false;

			for(var i = 0 ; i < this.tones.length ; i++) {
				this.tones[i].stop();
			}
		}
	};

	// Ringtone class with frequencies array and timing
	Audio.Ringtone = function(frequencies, timing) {
		this.toneGroup = new Audio.ToneGroup(frequencies);
		this.timing = timing;
		this.playing = false;
	};

	Audio.Ringtone.prototype = {
		// Start ringtone playing
		start : function() {
			if(this.playing) {
				return;
			}

			this.playing = true;
			this.playPart();
		},

		// Stop ringtone playing
		stop : function() {
			if(!this.playing)
				return;
		
			this.playing = false;
			clearTimeout(this.timeout);
			this.toneGroup.stop();
		},

		// Recursive timing function iterating through ringtone on a loop
		playPart : function(index) {
			var This = this;

			index = index ? index : 0;

			var step = this.timing[index];

			if(step.playing) {
				this.toneGroup.start();
			} else {
				this.toneGroup.stop();
			}

			if(index < (this.timing.length - 1)) {
				index++;
			} else {
				index = 0;
			}

			this.timeout = setTimeout(function() {
				if(This.playing) {
					This.playPart(index);
				}
			}, step.duration * 1000);
		}
	};

	var AudioContext = window.webkitAudioContext || window.AudioContext;

	// Set Audio context (global setting)
	if(AudioContext)
		Audio.setContext(new AudioContext());

	var AudioWidgetHtml = $(
		'<div class="ui_widget widget_audiocall hidden">' +
			'<div class="ui_container scheme_widget">' +
				'<div class="tpl_title">' +
					'<div class="title_control">' +
						'<h1 class="ui_title"></h1>' +
					'</div>' +
					'<div class="ui_title_toolbar">' +
						'<div class="ui_input_button ui_input btn_close scheme_button_6">' +
							'<div class="ui_image"></div>' +
							'<div class="ui_text"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="ui_content">' +
					'<div class="tpl_content">' +
						'<div class="tpl_info">' +
							'<div class="tpl_remoteid">' +
								'<span class="ui_label scheme_label_1 ui_uri"></span>' +
							'</div>' +
							'<div class="tpl_details scheme_label_2">' +
								'<span class="ui_label tpl_status"></span>' +
								'<span class="ui_label ui_duration"></span>' +
							'</div>' +
						'</div>' +
						'<div class="tpl_actions">' +
							'<div class="tpl_group">' +
								'<div class="ui_popout scheme_popout_1 ui_popout_open">' +
									'<div class="ui_input_button ui_input scheme_action_button btn_keypad" tabindex="0">' +
										'<div class="ui_image"></div>' +
										'<div class="ui_text"></div>' +
									'</div>' +
									'<div class="ui_panel tpl_content">' +
										'<div class="ui_keypad">' +
											'<table>' +
												'<tr>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">1</div>' +
															'<div class="tpl_alternate"></div>' +
														'</div>' +
													'</td>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">2</div>' +
															'<div class="tpl_alternate">ABC</div>' +
														'</div>' +
													'</td>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">3</div>' +
															'<div class="tpl_alternate">DEF</div>' +
														'</div>' +
													'</td>' +
												'</tr>' +
												'<tr>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">4</div>' +
															'<div class="tpl_alternate">GHI</div>' +
														'</div>' +
													'</td>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">5</div>' +
															'<div class="tpl_alternate">JKL</div>' +
														'</div>' +
													'</td>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">6</div>' +
															'<div class="tpl_alternate">MNO</div>' +
														'</div>' +
													'</td>' +
												'</tr>' +
												'<tr>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">7</div>' +
															'<div class="tpl_alternate">PQRS</div>' +
														'</div>' +
													'</td>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">8</div>' +
															'<div class="tpl_alternate">TUV</div>' +
														'</div>' +
													'</td>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">9</div>' +
															'<div class="tpl_alternate">WXYZ</div>' +
														'</div>' +
													'</td>' +
												'</tr>' +
												'<tr>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">*</div>' +
															'<div class="tpl_alternate"></div>' +
														'</div>' +
													'</td>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">0</div>' +
															'<div class="tpl_alternate">+</div>' +
														'</div>' +
													'</td>' +
													'<td>' +
														'<div class="ui_input_button tpl_key" tabindex="0">' +
															'<div class="tpl_main">#</div>' +
															'<div class="tpl_alternate"></div>' +
														'</div>' +
													'</td>' +
												'</tr>' +
											'</table>' +
										'</div>' +
									'</div>' +
									'<div class="tpl_deco"></div>' +
								'</div>' +
								'<div class="ui_input_button ui_input scheme_action_button btn_mute_s">' +
									'<div class="ui_image"></div>' +
									'<div class="ui_text"></div>' +
								'</div>' +
								'<div class="ui_input_button ui_input scheme_action_button btn_endcall_s">' +
									'<div class="ui_image"></div>' +
									'<div class="ui_text"></div>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="ui_hidden">' +
							'<audio class="tpl_tpl" autoplay="autoplay"></audio>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>'
	);
	var VideoWidgetHtml = $(
		'<div class="ui_widget widget_videocall hidden">' +
			'<div class="ui_container scheme_widget">' +
				'<div class="tpl_titlebar">' +
					'<div class="tpl_title">' +
						'<div class="title_control">' +
							'<span class="ui_label ui_uri scheme_label_1"></span> - <span class="ui_label ui_duration scheme_label_1"></span> - <span class="ui_label ui_status scheme_label_1"></span>' +
						'</div>' +
						'<div class="ui_title_toolbar">' +
							'<div class="ui_input_button ui_input btn_fullscreen scheme_button_6">' +
								'<div class="ui_image"></div>' +
								'<div class="ui_text"></div>' +
							'</div>' +
							'<div class="ui_input_button ui_input btn_close scheme_button_6">' +
								'<div class="ui_image"></div>' +
								'<div class="ui_text"></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="ui_content">' +
					'<div class="tpl_content">' +
						'<video class="tpl_video tpl_remotevideo" autoplay="autoplay"></video>' +
						'<div class="tpl_controls ui_localvideoshown">' +
							'<div class="tpl_actions">' +
								'<div class="tpl_bar">' +
									'<div class="ui_input_button ui_input btn_localvideo">' +
										'<div class="ui_image"></div>' +
										'<div class="ui_text"></div>' +
									'</div>' +
									'<div class="tpl_callactions">' +
										'<div class="ui_popout scheme_popout_1 ui_popout_open">' +
											'<div class="ui_input_button ui_input scheme_action_button btn_keypad" tabindex="0">' +
												'<div class="ui_image"></div>' +
												'<div class="ui_text"></div>' +
											'</div>' +
											'<div class="ui_panel tpl_content">' +
												'<div class="ui_keypad">' +
													'<table>' +
														'<tr>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">1</div>' +
																	'<div class="tpl_alternate"></div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">2</div>' +
																	'<div class="tpl_alternate">ABC</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">3</div>' +
																	'<div class="tpl_alternate">DEF</div>' +
																'</div>' +
															'</td>' +
														'</tr>' +
														'<tr>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">4</div>' +
																	'<div class="tpl_alternate">GHI</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">5</div>' +
																	'<div class="tpl_alternate">JKL</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">6</div>' +
																	'<div class="tpl_alternate">MNO</div>' +
																'</div>' +
															'</td>' +
														'</tr>' +
														'<tr>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">7</div>' +
																	'<div class="tpl_alternate">PQRS</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">8</div>' +
																	'<div class="tpl_alternate">TUV</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">9</div>' +
																	'<div class="tpl_alternate">WXYZ</div>' +
																'</div>' +
															'</td>' +
														'</tr>' +
														'<tr>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">*</div>' +
																	'<div class="tpl_alternate"></div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">0</div>' +
																	'<div class="tpl_alternate">+</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="ui_input_button tpl_key" tabindex="0">' +
																	'<div class="tpl_main">#</div>' +
																	'<div class="tpl_alternate"></div>' +
																'</div>' +
															'</td>' +
														'</tr>' +
													'</table>' +
												'</div>' +
											'</div>' +
											'<div class="tpl_deco"></div>' +
										'</div>' +
										'<div class="ui_input_button ui_input scheme_action_button btn_mute_s">' +
											'<div class="ui_image"></div>' +
											'<div class="ui_text"></div>' +
										'</div>' +
										'<div class="ui_input_button ui_input scheme_action_button btn_pausevideo_s">' +
											'<div class="ui_image"></div>' +
											'<div class="ui_text"></div>' +
										'</div>' +
										'<div class="ui_input_button ui_input scheme_action_button btn_endcall_s">' +
											'<div class="ui_image"></div>' +
											'<div class="ui_text"></div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
							'<div class="tpl_localvideo">' +
								'<div class="tpl_disabledvideo"></div>' +
								'<video class="tpl_video" autoplay="autoplay"></video>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>');


	window.CrocExample = CrocExample;
})();

/*
 * Create the html to append to the appendClick2callTo element.
 */
var videoWidgetHtml = '<div class="croc_tab-wrapper-video croc_tab-container">' +
		'<div class="croc_side-tab croc_rotate-vertical">' +
			'<img class="dist/images/croc-logo.png"></img>' +
			'<p>Call Now</p>' +
			'<div class="croc_warning-light">' +
				'<div class="croc_warning-light-circle"></div>' +
			'</div>' +
		'</div>' +
	'<div class="croc_side-tab-content-video">' +
		'<div class="croc_ui_widget croc_widget_videocall">' +
			'<div class="croc_ui_container croc_scheme_widget">' +
				'<div class="croc_tpl_titlebar">' +
					'<div class="croc_tpl_title">' +
						'<div class="croc_title_control">' +
							'<span class="croc_ui_label croc_ui_uri croc_scheme_label_1"></span> - <span class="croc_ui_label croc_ui_duration croc_scheme_label_1"></span> - <span class="croc_ui_label croc_ui_status croc_scheme_label_1"></span>' +
						'</div>' +
						'<div class="croc_ui_title_toolbar">' +
							'<div class="croc_ui_input_button croc_ui_input croc_btn_fullscreen croc_scheme_button_6">' +
								'<div class="croc_ui_image"></div>' +
								'<div class="croc_ui_text"></div>' +
							'</div>' +
							'<div class="croc_ui_input_button croc_ui_input croc_btn_close croc_scheme_button_6">' +
								'<div class="croc_ui_image"></div>' +
								'<div class="croc_ui_text"></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="croc_ui_content">' +
					'<div class="croc_tpl_content">' +
						'<video class="croc_tpl_video croc_tpl_remotevideo" autoplay="autoplay"></video>' +
						'<div class="croc_tpl_controls croc_ui_localvideoshown">' +
							'<div class="croc_tpl_actions">' +
								'<div class="croc_tpl_bar">' +
									'<div class="croc_ui_input_button croc_ui_input croc_btn_localvideo">' +
										'<div class="croc_ui_image"></div>' +
										'<div class="croc_ui_text"></div>' +
									'</div>' +
									'<div class="croc_tpl_callactions">' +
										'<div class="croc_ui_popout croc_scheme_popout_1 croc_ui_popout_open">' +
											'<div class="croc_ui_input_button croc_ui_input croc_scheme_action_button croc_btn_keypad" tabindex="0">' +
												'<div class="croc_ui_image"></div>' +
												'<div class="croc_ui_text"></div>' +
											'</div>' +
											'<div class="croc_ui_panel croc_tpl_content">' +
												'<div class="croc_ui_keypad">' +
													'<table>' +
														'<tr>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">1</div>' +
																	'<div class="croc_tpl_alternate"></div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">2</div>' +
																	'<div class="croc_tpl_alternate">ABC</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">3</div>' +
																	'<div class="croc_tpl_alternate">DEF</div>' +
																'</div>' +
															'</td>' +
														'</tr>' +
														'<tr>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">4</div>' +
																	'<div class="croc_tpl_alternate">GHI</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">5</div>' +
																	'<div class="croc_tpl_alternate">JKL</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">6</div>' +
																	'<div class="croc_tpl_alternate">MNO</div>' +
																'</div>' +
															'</td>' +
														'</tr>' +
														'<tr>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">7</div>' +
																	'<div class="croc_tpl_alternate">PQRS</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">8</div>' +
																	'<div class="croc_tpl_alternate">TUV</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">9</div>' +
																	'<div class="croc_tpl_alternate">WXYZ</div>' +
																'</div>' +
															'</td>' +
														'</tr>' +
														'<tr>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">*</div>' +
																	'<div class="croc_tpl_alternate"></div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">0</div>' +
																	'<div class="croc_tpl_alternate">+</div>' +
																'</div>' +
															'</td>' +
															'<td>' +
																'<div class="croc_ui_input_button croc_tpl_key" tabindex="0">' +
																	'<div class="croc_tpl_main">#</div>' +
																	'<div class="croc_tpl_alternate"></div>' +
																'</div>' +
															'</td>' +
														'</tr>' +
													'</table>' +
												'</div>' +
											'</div>' +
											'<div class="croc_tpl_deco"></div>' +
										'</div>' +
										'<div class="croc_ui_input_button croc_ui_input croc_scheme_action_button croc_btn_mute_s croc_mute_video_audio">' +
											'<div class="croc_ui_image"></div>' +
											'<div class="croc_ui_text"></div>' +
										'</div>' +
										'<div class="croc_ui_input_button croc_ui_input croc_scheme_action_button croc_btn_pausevideo_s">' +
											'<div class="croc_ui_image"></div>' +
											'<div class="croc_ui_text"></div>' +
										'</div>' +
										'<div class="croc_ui_input_button croc_ui_input croc_scheme_action_button croc_btn_endcall_s">' +
											'<div class="croc_ui_image"></div>' +
											'<div class="croc_ui_text"></div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
							'<div class="croc_tpl_localvideo">' +
								'<div class="croc_tpl_disabledvideo"></div>' +
								'<video class="croc_tpl_video croc_receive_localVideo" autoplay="autoplay"></video>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div class="croc_powered_by_video">'+
			'<p>Powered by <a href="https://www.crocodilertc.net" target="_blank">crocodilertc.net</a></p>'+
		'</div>' +
	'</div>' +
'</div>';
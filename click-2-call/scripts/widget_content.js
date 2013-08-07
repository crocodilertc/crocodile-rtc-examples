	/*
	 * Create the html to append to the appenClick2callTo element.
	 * Using strings but could have used a document fragment.
	 */ 
	var audioWidgetHtml = '<div class="tab-wrapper tab-container">' +
		'<div class="side-tab rotate-vertical">' +
			'<img class="tab-logo" src="dist/images/croc-logo.png"></img>' +
			'<p>Call Now</p>' +
			'<div class="warning-light">' +
				'<div class="warning-light-circle"></div>' +
			'</div>' +
		'</div>' +
		'<div class="side-tab-content">' +
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
									'<div class="ui_input_button ui_input scheme_action_button btn_mute_s mute_audio">' +
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
								'<audio class="tpl_tpl receive-audio" autoplay="autoplay"></audio>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>';
	
	/*
	 * Create the html to append to the appenClick2callTo element.
	 * Using strings but could have used a document fragment.
	 */
	var videoWidgetHtml = '<div class="tab-wrapper-video tab-container">' +
			'<div class="side-tab rotate-vertical">' +
				'<img class="tab-logo" src="dist/images/croc-logo.png"></img>' +
				'<p>Call Now</p>' +
				'<div class="warning-light">' +
					'<div class="warning-light-circle"></div>' +
				'</div>' +
			'</div>' +
		'<div class="side-tab-content-video">' +
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
											'<div class="ui_input_button ui_input scheme_action_button btn_mute_s mute_video_audio">' +
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
									'<video class="tpl_video receive_localVideo" autoplay="autoplay"></video>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>';
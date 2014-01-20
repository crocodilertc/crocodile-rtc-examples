	/*
	 * Create the html to append to the appenClick2callTo element.
	 */ 
	var audioWidgetHtml = '<div class="croc_tab-wrapper croc_tab-container">' +
		'<div class="croc_side-tab croc_rotate-vertical">' +
			'<img class="croc_tab-logo" src="https://demos.crocodilertc.net/click_2_join/dist/images/croc-logo.png"></img>' +
			'<p>Join Now</p>' +
			'<div class="croc_warning-light">' +
				'<div class="croc_warning-light-circle"></div>' +
			'</div>' +
		'</div>' +
		'<div class="croc_side-tab-content">' +
			'<div class="croc_ui_widget croc_widget_audiocall croc_hidden">' +
				'<div class="croc_ui_container croc_scheme_widget">' +
					'<div class="croc_tpl_title">' +
						'<div class="croc_title_control">' +
							'<h1 class="croc_ui_title"></h1>' +
						'</div>' +
						'<div class="croc_ui_title_toolbar">' +
							'<div class="croc_ui_input_button croc_ui_input croc_btn_close croc_scheme_button_6">' +
								'<div class="croc_ui_image"></div>' +
								'<div class="croc_ui_text"></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="croc_ui_content">' +
						'<div class="croc_tpl_content">' +
							'<div class="croc_tpl_info">' +
								'<div class="croc_tpl_remoteid">' +
									'<span class="croc_ui_label scheme_label_1 croc_ui_uri"></span>' +
								'</div>' +
								'<div class="croc_tpl_details croc_scheme_label_2">' +
									'<span class="croc_ui_label croc_tpl_status"></span>' +
									'<span class="croc_ui_label croc_ui_duration"></span>' +
								'</div>' +
							'</div>' +
							'<div class="croc_tpl_actions">' +
								'<div class="croc_tpl_group">' +
									'<div class="croc_ui_input_button croc_ui_input croc_scheme_action_button croc_mute_audio croc_btn_muted">' +
										'<div class="croc_ui_image"></div>' +
										'<div class="croc_ui_text"></div>' +
									'</div>' +
									'<div class="croc_ui_input_button croc_ui_input croc_scheme_action_button croc_btn_endcall_s">' +
										'<div class="croc_ui_image"></div>' +
										'<div class="croc_ui_text"></div>' +
									'</div>' +
								'</div>' +
							'</div>' +
							'<div class="croc_ui_hidden">' +
								'<audio class="croc_tpl_tpl croc_receive-audio" autoplay="autoplay"></audio>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="croc_powered_by_audio">'+
				'<p>Powered by <a href="https://www.crocodilertc.net" target="_blank">crocodilertc.net</a></p>'+
			'</div>' +
		'</div>' +
	'</div>';
	
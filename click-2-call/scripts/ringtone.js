// Local audio Namespace
var audio = {
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
	},

	createSound : function(frequencies, duration) {
		
	}
};

// Tone class for creating a 1 frequency tone
audio.Tone = function(frequency) {
	if(!audio.supportsWebAudio()) {
		return false;
	}

	this.node = audio.getContext().createOscillator();
	this.node.type = 0;
	this.node.frequency.value = frequency;
};

audio.Tone.prototype = {
	start : function(){
		if(this.playing || !audio.supportsWebAudio()) {
			return;
		}

		this.playing = true;

		this.node.connect(audio.getContext().destination);
		if(this.node.noteOn) {
			this.node.noteOn(0);
		}
	},

	stop : function() {
		if(!this.playing || !audio.supportsWebAudio()) {
			return;
		}

		this.playing = false;

		this.node.disconnect();
	}
};

// Create multiple tones with array of frequencies
audio.ToneGroup = function(frequencies) {
	this.tones = [];

	this.playing = false;

	for(var i = 0 ; i < frequencies.length ; i++) {
		var tone = new audio.Tone(frequencies[i]);
		this.tones.push(tone);
	}
};

audio.ToneGroup.prototype = {
	isPlaying : function() {
		return this.playing;
	},

	start : function() {
		if(this.playing) {
			return;
		}

		this.playing = true;

		for(var i = 0 ; i < this.tones.length ; i++) {
			this.tones[i].start();
		}
	},

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
audio.Ringtone = function(frequencies, timing) {
	this.toneGroup = new audio.ToneGroup(frequencies);
	this.timing = timing;
	this.playing = false;
};

audio.Ringtone.prototype = {
	start : function() {
		if(this.playing) {
			return;
		}

		this.playing = true;
		this.playPart();
	},

	stop : function() {
		if(!this.playing) {
			return;
		}
		
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

var audioContext = window.webkitAudioContext || window.AudioContext;

// Set audio context (global setting)
if(audioContext) {
	audio.setContext(new audioContext());
}
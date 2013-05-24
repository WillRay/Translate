(function(window) {
	'use strict';

	var Translator = window.Translator = function(outputTarget, startButton) {
		
		this.outputTarget = outputTarget;
		this.startBtn = startButton;
		this.isListening = false;

		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		this.recognizer = new window.SpeechRecognition();
		this.recognizer.continuous = false;
		this.recognizer.interimResults = false;

		this.recognizer.lang = 'en-US';

		this.recognizer.onstart = function() {

		};

		this.recognizer.onresult = function(e) {
			this.outputTarget.innerHTML = e.results[0][0].transcript;
			this.translate(e.results[0][0].transcript);
		}.bind(this);

		this.recognizer.onerror = function(e) {
			this.stopListening();
		}.bind(this);

		this.recognizer.onend = function() {
			this.stopListening();
		}.bind(this);

	};

	Translator.prototype.startListening = function() {
		if (!this.isListening) {
			this.recognizer.start();
			this.startBtn.disabled = true;
		}
		this.isListening = true;
	};

	Translator.prototype.stopListening = function() {
		if (this.isListening) {
			this.recognizer.stop();
			this.startBtn.disabled = false;
		}
		this.isListening = false;
	};

	Translator.prototype.translate = function(txt) {
		var translateURL = ['translate.google.com/translate_a/t?client=t&hl=en&sl=en&tl=',
	    'es', '&ie=UTF-8&oe=UTF-8&multires=1&otf=2&ssel=0&tsel=0&sc=1&q=',
	    encodeURIComponent(txt)].join('');

	    var request = new XMLHttpRequest();
	    request.open('GET', 'http://www.corsproxy.com/' + translateURL, true);

	    request.onload = function(e) {
	        var arr = eval(e.target.response); // JSON.parse flakes out on the response.
	        var translateText = arr[0][0][0];
	        this.outputTarget.innerHTML += '<div>' + translateText + '</div>';
	        //this.speak(translateText);
	    }.bind(this);
		request.send();
	};

	Translator.prototype.speak = function(txt) {
		var audioURL = ['http://translate.google.com/translate_tts?ie=UTF-8&q=',
	    txt, '&tl=', 'es'].join('');
	    console.log(audioURL);

	    var a = new Audio(audioURL);
	    a.play();
	   	//a.src = audioURL;
	   	//a.autoplay = true;
	};


})(window);
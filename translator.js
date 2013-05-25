(function(window) {
	'use strict';

	window.Translator = function(config) {

		// Config-related properties;
		this.outputTarget = config.outputTarget;
		this.interimTarget = config.interimTarget || false;
		this.translateLang = config.language;

		// Defalt properties
		this.isListening = false;
		this.confidence = 0;

		// Speech Recognition obj & properties
		this.recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition);
		this.recognizer.continuous = true;
		this.recognizer.interimResults = true;
		this.recognizer.lang = 'en-US';


		this.recognizer.onresult = function(event) {
			var interimResults = '';
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					if (this.interimTarget) {
						this.interimTarget.innerText = '';
					}

					interimResults = '';
					this.outputTarget.innerHTML += capitalise(this.translate(event.results[i][0].transcript)) + '.&nbsp;';
					
				}
				else {
					interimResults += event.results[i][0].transcript;
				}
			}

			if (this.interimTarget) {
				this.interimTarget.innerText = interimResults;
			}
		}.bind(this);

		this.recognizer.onerror = function(err) {
			this.stopListening();
			this.isListening = false;
			this.outputTarget.innerHTML = 'There was an error! Have you denied access to your microphone?';
		}.bind(this);
	};

	Translator.prototype.setTranslateLanguage = function(lang) {
		this.translateLang = lang;
	};

	Translator.prototype.startListening = function() {
		if (!this.isListening) {
			this.recognizer.start();
		}
		this.isListening = true;
	};

	Translator.prototype.stopListening = function() {
		if (this.isListening) {
			this.recognizer.stop();
		}
		this.isListening = false;
	};

	Translator.prototype.toggleListening = function() {
		if (this.isListening) {
			this.stopListening();
		}
		else {
			this.startListening();
		}
	};

	Translator.prototype.translate = function(txt) {
		var translateURL = ['translate.google.com/translate_a/t?client=t&hl=en&sl=en&tl=',
	    					this.translateLang, '&ie=UTF-8&oe=UTF-8&multires=1&otf=2&ssel=0&tsel=0&sc=1&q=',
	    					encodeURIComponent(txt)].join('');

	    var request = new XMLHttpRequest();
	    request.open('GET', 'http://www.corsproxy.com/' + translateURL, false);
		request.send();

		var arr = eval(request.response); // JSON.parse fails on this response.
        var translatedText = arr[0][0][0];

        return translatedText;
	};

	function capitalise(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
})(window);
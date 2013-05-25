(function(window) {
	//'use strict';

	window.Translator = function(config) {

		this.outputTarget = config.outputTarget;
		this.inputTarget = config.inputTarget || false;
		this.isListening = false;
		this.textToBeTranslated = '';
		this.translateLang = config.language;
		this.confidence = 0;

		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		this.recognizer = new window.SpeechRecognition();
		this.recognizer.continuous = true; // HERE?????????????????????????????????????????????????????????????????????????????
		this.recognizer.interimResults = true;

		this.recognizer.lang = 'en-US';


		this.recognizer.onresult = function(e) {
			if (this.inputTarget) {
				this.inputTarget.textContent = e.results[0][0].transcript;
			}

			this.confidence = e.results[0][0].confidence;
			this.textToBeTranslated = e.results[0][0].transcript;
		}.bind(this);

		this.recognizer.onerror = function(err) {
			this.stopListening();
			this.isListening = false;
			this.outputTarget.innerHTML = 'There was an error! Have you denied access to your microphone?';
		}.bind(this);

		this.recognizer.onend = function() {
			this.stopListening();
			this.isListening = false;
		}.bind(this);
		
		this.recognizer.onsoundend = function(e) {
			this.stopListening();
			this.confidence = (this.confidence * 100).toFixed(2);
			this.translate(this.textToBeTranslated);
		}.bind(this);
	};

	Translator.prototype.setTranslateLang = function(lang) {
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
	}

	Translator.prototype.translate = function(txt) {
		var translateURL = ['translate.google.com/translate_a/t?client=t&hl=en&sl=en&tl=',
	    this.translateLang, '&ie=UTF-8&oe=UTF-8&multires=1&otf=2&ssel=0&tsel=0&sc=1&q=',
	    encodeURIComponent(txt)].join('');

	    var request = new XMLHttpRequest();
	    request.open('GET', 'http://www.corsproxy.com/' + translateURL, true);

	    request.onload = function(e) {
	        var arr = eval(e.target.response); // JSON.parse flakes out on the response.
	        var translateText = arr[0][0][0];
	        this.outputTarget.innerHTML = translateText;
	        //this.speak(translateText);
	    }.bind(this);
		request.send();
	};

	Translator.prototype.speak = function(txt) {
		var audioURL = ['http://translate.google.com/translate_tts?ie=UTF-8&q=',
	    txt, '&tl=', this.translateLang].join('');
	    console.log(audioURL);

	    var a = new Audio(audioURL);
	    a.play();
	   	//a.src = audioURL;
	   	//a.autoplay = true;
	};


})(window);
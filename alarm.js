/* global Module */

/* Magic Mirror
 * Module: Alarm Clock
 *
 * By chriscauley http://github.com/chriscauley/ 
 * MIT Licensed.
 */

Module.register("alarm",{

	// Default module config.
	defaults: {
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required translations.
	getTranslations: function() {
		return false;
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);
		this.sounds = [];
    this.current_sound = 0;
    if (typeof this.config.sounds === "string") { this.config.sounds = [this.config.sounds] }
    for (var i=0; i<this.config.sounds.length; i++) {
      var audio = document.createElement(audio);
      audio.src = this.config.sounds[i];
      audio.volume = this.config.volume || 1;
      this.sounds.push(audio);
    }
    document.addEventListener("onkeypress",this.stop.bind(this));
	},
  play: function() {
    if (this.current_sound >= this.sounds.length) { this.current_sound = 0; }
    this.sounds[this.current_sound].play();
    this.current_sound ++;
    setInterval(this.stop.bind(this),(this.config.alarm_minutes || 1)*60*1000)
  },
  stop: function() {
    for (var i=0; i<this.sounds.length; i++) {
      this.sounds.stop();
    }
  },
    

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.style.width = (this.config.width || '500') + 'px';
		this.tweets = this.tweets || [];
		if (this.activeItem >= this.tweets.length) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "small dimmed";
			this.activeItem = 0;
		}

		if (this.tweets.length == 0) {
			return wrapper;
		}

		var tweet = this.tweets[this.activeItem];
		var i = "<i class='fa fa-twitter bright'></i>";
		var top = document.createElement("div");
		top.appendChild(this.createElement("b",i+"@"+tweet.user.screen_name));
		
		var time = document.createElement("span");
		time.innerHTML = moment(new Date(tweet.created_at)).format("lll");
		time.className = "small";
		time.style.paddingLeft = "20px";
		top.appendChild(time);
		wrapper.appendChild(top);
		wrapper.appendChild(this.createElement("div",tweet.text,{className: "small"}));

		return wrapper;
	},

	scheduleUpdateInterval: function() {
		var self = this;

		self.updateDom(self.config.animationSpeed);

		setInterval(function() {
			self.activeItem++;
			self.updateDom(self.config.animationSpeed);
		}, this.config.updateInterval);
	},
});

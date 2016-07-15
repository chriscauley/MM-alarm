/* global Module */

/* Magic Mirror
 * Module: Alarm Clock
 *
 * By chriscauley http://github.com/chriscauley/ 
 * MIT Licensed.
 */

Module.register("MM-alarm",{

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
    this.config.sounds = this.config.sounds || ["/modules/MM-alarm/trash.mp3"];
    if (typeof this.config.sounds === "string") { this.config.sounds = [this.config.sounds] }
    for (var i=0; i<this.config.sounds.length; i++) {
      var audio = document.createElement(audio);
      audio.src = this.config.sounds[i];
      audio.volume = this.config.volume || 1;
      this.sounds.push(audio);
    }
    document.addEventListener("onkeypress",this.stop.bind(this));
    this.createAlarms();
    this.scheduleUpdateInterval();
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

  createAlarms: function() {
    this.bad_times = [];
    var times = this.config.times || {};
    this.alarms = [[],[],[],[],[],[],[],]; // 7 empty arrays for 7 days... Sunday = 0
    var multi_days = {
      sunday: [0],
      monday: [1],
      tuesday: [2],
      wednesday: [3],
      thursday: [4],
      friday: [5],
      saturday: [6],
      all_week: [0,1,2,3,4,5,6],
      weekends: [0,6],
      weekdays: [1,2,3,4,5]
    };
    for (key in multi_days) {
      var times = this.parseTimes(this.config.times[key]);
      for (var i=0;i<multi_days[key].length;i++) {
        for (var j=0;j<times.length;j++) { this.alarms[multi_days[key][i]].push(times[j]); }
      }
    }
  },

  parseTimes: function(time_list) {
    if (typeof time_list === "string") { time_list = [time_list] }
    var out = [];
    for (var j=0;j<time_list.length;j++) {
      var s = time_list[j];
      var h = parseInt(s.split(":")[0]);
      var m = parseInt(s.split(":")[1]);
      if (h === NaN || m === NaN) {
        if (this.bad_times.indexOf(s) == -1) { this.bad_times.push(s); }
        continue;
      }
      if (s.toLowerCase().indexOf('p') != -1) { h += 12 }
      out.push(h+":"+m);
    }
    return out;
  },

	// Override dom generator.
	getDom: function() {
    var wrapper = document.createElement("div");
		return wrapper;
	},

	scheduleUpdateInterval: function() {
		var self = this;
		setInterval(function() {
			self.updateDom(self.config.animationSpeed);
		}, 60*1000);
	},
});

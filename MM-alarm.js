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
		this.last_alarm = moment();
		this.sounds = [];
		this.current_sound = 0;
		this.config.sounds = this.config.sounds || ["/modules/MM-alarm/alarm.mp3"];
		if (typeof this.config.sounds === "string") { this.config.sounds = [this.config.sounds] }
		for (var i=0; i<this.config.sounds.length; i++) {
			var audio = document.createElement("audio");
			audio.src = this.config.sounds[i];
			audio.volume = this.config.volume || 1;
			audio.loop = true;
			this.sounds.push(audio);
			document.body.appendChild(audio);
		}
		document.addEventListener("keypress",this.stop.bind(this));
		this.createAlarms();
		this.scheduleUpdateInterval();
	},
	play: function() {
		if (this.current_sound >= this.sounds.length) { this.current_sound = 0; }
		this.sounds[this.current_sound].play();
		this.current_sound ++;
		setInterval(this.stop.bind(this),(this.config.alarm_minutes || 1)*60*1000)
		this.playing = true;
	},
	stop: function(e) {
		if (!this.playing) { return e; }
		for (var i=0; i<this.sounds.length; i++) {
			this.sounds[i].pause();
			this.sounds[i].current_time = 0;
		}
		this.playing = false;
		this.updateDom();
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
			var m = (s.split(":").length > 1)?parseInt(s.split(":")[1]):0;
			if (isNaN(h) || isNaN(m)) {
				if (this.bad_times.indexOf(s) == -1) { this.bad_times.push(s); }
				continue;
			}
			if (s.toLowerCase().indexOf('p') != -1) { h += 12 }
			out.push([h,m]);
		}
		return out;
	},

	findNextAlarm: function(alarms,days) {
		days = days || 0;
		var next_alarm = undefined;
		for (var i=0;i<alarms.length;i++) {
			var m = moment().hour(alarms[i][0]).minute(alarms[i][1]).add(days,"days");
			if (m<this.last_alarm) { continue; } // this alarm has been used or program was started after this alarm
			if (!next_alarm || m < next_alarm) { next_alarm = m };
		}
		return next_alarm;
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		if (this.bad_times.length) {
			wrapper.innerHTML = "The following time(s) are invalid: "+(this.bad_times.join(", "));
			return wrapper;
		}
		if (this.playing) {
			wrapper.innerHTML = "Sound the alarm!!";
			return wrapper;
		}
		var now = new Date();
		var next_alarm = this.findNextAlarm(this.alarms[now.getUTCDay()]);
		if (next_alarm) {
			if (next_alarm <= moment()) { //trigger the alarm!
				this.last_alarm = moment();
				this.play();
				return wrapper;
			}
			wrapper.innerHTML = "Next alarm at: " + next_alarm.format("h:mm a");
		} else {
			next_alarm = this.findNextAlarm(this.alarms[(1+now.getUTCDay())%7],1);
			if (next_alarm) {
				wrapper.innerHTML = "Alarm tomorrow at: " + next_alarm.format("h:mm a");
			} else {
				wrapper.innerHTML = "No alarm today or tomorrow";
			}
		}
		return wrapper;
	},

	scheduleUpdateInterval: function() {
		var self = this;
		setInterval(function() {
			self.updateDom(self.config.animationSpeed);
		}, 10*1000);
	},
});

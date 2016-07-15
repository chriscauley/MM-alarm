# Module: MM-Alarm

A simple alarm clock for magic mirror. Any keypress shuts off the alarm. Clone this repo to your modules directory and replace the alarm.mp3 file with your own. Then copy the config over, change the position, and set the times for each of the days. Times can be set at the weekday level or bulk times are available for all_days, weekdays, and weekends. Most time formats should be acceptable. The rules for time formats are:

* A number before the (optional) colon is the hour. '8:00' and '8' both are parsed as "eight in the morning"

* The number after the (optional) colon is the minute. 

* If the string contains a "p" anywhere, 12 is added to the hour.

* Error catching on times may not be great, so weird times may break the mirror or wake you up at odd hours. Caveat emptor.

## Sample config

This will have alarms every day of the week at 3am, 8am, 8:15am, 6:30pm, and 7:pm.

```javascript
		{
			module: 'MM-alarm',
			position: "lower_third",
			config: {
				times: {
					sunday: [],
					monday: [],
					tuesday: [],
					wednesday: [],
					thursday: [],
					friday: [],
					saturday: [],
					weekdays: [],
					weekends: [],
					all_week: ['8:15','6:30PM','19:00','8am','3'],
				}
			},
		},
```

## TODO:

* Better styling options.
* Snooze button.

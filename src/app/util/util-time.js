'use strict';

var UtilTime = {
	getASec: function() {return 1000;},

	getAMinute: function() {return 1000 * 60;},

	getAHour: function() {return 1000 * 60 * 60;},

	getADay: function() {return 1000 * 60 * 60 * 24;},

	getDays: function() {return ['일', '월', '화', '수', '목', '금', '토'];},

	getNow: function() {
		return new Date().getTime();
	},

	isNearNow: function(timestamp, distance) {
		return (this.getDistanceNow(timestamp) <= distance) ? true : false;
	},

	getDistanceNow: function(timestamp) {
		return this.getNow() - timestamp;
	},

	parseDate: function(timestamp) {
		var Format = require('./util-format');
		var date = new Date(timestamp || this.getNow());

		return {
			year: date.getFullYear(),
			month: Format.toDigit(date.getMonth() + 1),
			date: Format.toDigit(date.getDate()),
			hour: Format.toDigit(date.getHours()),
			minutes: Format.toDigit(date.getMinutes()),
			day: this.getDays()[date.getDay()] + '요일',
			ampm: (date.getHours() <= 12) ? 'AM' : 'PM'
		}
	}
};

module.exports = UtilTime;
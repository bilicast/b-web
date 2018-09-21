'use strict';

var UtilFormat = {
    addZero: function (value, len) {
        var output = String(value);

        while (output.length < len) {
            output = '0' + output;
        }
        return output;
    },

    toDigit: function (value) {
        return this.addZero(value, 2);
    },

    toCash: function (value) {
        var output = String(Number(value));
        var reg = /(^[+-]?\d+)(\d{3})/;
        output += '';

        while (reg.test(output)) {
            output = output.replace(reg, '$1' + ',' + '$2');
        }
        return output;
    },

    toDate: function (timestamp) {
        var Time = require('./util-time');
        var dates = Time.parseDate(timestamp);
        var distance = Time.getDistanceNow(timestamp);
        var aDay = Time.getADay();
        var aHour = Time.getAHour();
        var aMinute = Time.getAMinute();
        var output = '';

        if (distance >= aDay * 2) {
            output = dates.year + '.' + dates.month + '.' + dates.date + ' ' + dates.ampm + ' ' + dates.hour + ':' + dates.minutes;
        } else if (distance < aDay * 2 && distance >= aDay) {
            output = '어제' + dates.hour + ':' + dates.minutes;
        } else if (distance < aDay && distance >= aHour) {
            output = parseInt(distance / aHour, 10) + '시간전';
        } else if (distance < aHour && distance >= aMinute) {
            output = (distance > aMinute) ? parseInt(distance / aMinute, 10) + '분전' : '방금';
        }
        return output;
    },

    toCounter: function (value) {
        var output = '';

        if (String(value).length > 4) {
            var tens = Math.pow(10, 4);
            output = Math.floor((Number(value) / tens) * 10) / 10;
            output = String(output) + '만';
        } else {
            output = this.toCash(value);
        }
        return output;
    },

    toEncode: function (value) {
        var output = value.substr(0, 1) + "**";
        return output;
    },

    toScore: function (value) {
        return "(" + value + ")";
    },

    toPercent: function (value, score1, score2, score3, score4, score5) {
        var count = score1 + score2 + score3 + score4 + score5;
        if (count == 0)
            return 0;

        return (value / count) * 100 + "%";
    },

    toDecimal: function (value) {
        var score = String(value);
        if (score.indexOf('.') > 0) {
            score = score.substring(0, score.indexOf('.') + 2)
        }
        return score;
    }
};

module.exports = UtilFormat;
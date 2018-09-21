'use strict';

var format = require('util').format;
var Url = require('url').parse(window.location.href, true);
var Base62 = require('base62');
Base62.setCharacterSet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');

var UtilUrl = {
	addHost: function (host, url) {
		if (!!url) {
			if (!String(url).match(/http:/) && !String(url).match(/https:/)) {
				return host + '/' + url;
			} else {
				return url;
			}
		} else {
			return url;
		}
	},

	addProtocol: function (url) {
		return (!~url.indexOf('://')) ? 'http://' + url : url;
	},

	toggleProtocol: function (url) {
		switch (window.location.protocol) {
			case 'https:':
				url = String(url).replace('http:', 'https:');
				break;

			case 'http:':
				url = String(url).replace('https:', 'http:');
				break;
		}

		return url;
	},

	open: function (url, target) {
		window.open(url, target || '_blank');
	},
};

module.exports = UtilUrl;

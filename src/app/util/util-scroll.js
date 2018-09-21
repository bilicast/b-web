'use strict';

var locked = false;

var UtilScroll = {
	lock: function() {
		if (!locked) {
			locked = true;

			$('html').css({
				'overflow': 'hidden'
			});

			$('body').bind('touchmove', function(event) {
				return false;
			});
		}
	},

	resume: function() {
		if (locked) {
			locked = false;

			$('html').css({
				'overflow': 'auto'
			});

			$('body').unbind('touchmove');
		}
	},

	slideTop: function() {
		$('html, body')
			.stop()
			.animate({ 'scrollTop': 0 }, 'slow');
	}
};

module.exports = UtilScroll;
'use strict';

var Handlebars = require('handlebars');
var Handlebarsfy = require('hbsfy/runtime');

Handlebarsfy.registerHelper('breaklines', function(text) {
	text = Handlebars.Utils.escapeExpression(text);
	text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
	return new Handlebars.SafeString(text);
});

Handlebarsfy.registerHelper('breaklines_nosafe', function(text) {
	return text.replace(/(\r\n|\n|\r)/gm, '<br>');
});

Handlebarsfy.registerHelper('selected', function(val0, val1) {
	return new Handlebars.SafeString((val0 == val1) ? 'selected' : '');
});

Handlebarsfy.registerHelper('checked', function(val0, val1) {
	return new Handlebars.SafeString((val0 == val1) ? 'checked' : '');
});

Handlebarsfy.registerHelper('eq', function(val0, val1, opts) {
	return (val0 == val1) ? opts.fn(this) : opts.inverse(this);
});

Handlebarsfy.registerHelper('not', function(val0, val1, opts) {
	return (val0 != val1) ? opts.fn(this) : opts.inverse(this);
});

Handlebarsfy.registerHelper('gt', function(val0, val1, opts) {
	return (val0 > val1) ? opts.fn(this) : opts.inverse(this);
});

Handlebarsfy.registerHelper('gteq', function(val0, val1, opts) {
	return (val0 >= val1) ? opts.fn(this) : opts.inverse(this);
});

Handlebarsfy.registerHelper('lt', function(val0, val1, opts) {
	return (val0 < val1) ? opts.fn(this) : opts.inverse(this);
});

Handlebarsfy.registerHelper('lteq', function(val0, val1, opts) {
	return (val0 <= val1) ? opts.fn(this) : opts.inverse(this);
});

Handlebarsfy.registerHelper('printViewText', function(val0) {
	return (val0 > 1) ? "views" :"view";
});

Handlebarsfy.registerHelper('isNotEmptySourceText', function(val0, opts) {
	var isNotEmpty = true;
	var isParamNotEmpty = true;
	if (val0=='' || val0==null || val0=='null' || val0=='이미지 출처: ') {
		isParamNotEmpty = false;
	} else {
		isParamNotEmpty = true;
	}
	return (isNotEmpty == isParamNotEmpty) ? opts.fn(this) : opts.inverse(this);
});

module.exports = Handlebarsfy;
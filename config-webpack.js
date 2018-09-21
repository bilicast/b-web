var path = require('path');
var _ = require('underscore');
var webpack = require('gulp-webpack');
var config = require('./gulp-config.json');

var debug = process.env['DEBUG'] || 'N';

var entry = _.reduce(config.apps, function(result, app) {
	result['app-' + app.name] = config.js.src + '/' + app.name + '/' + app.src;
	return result;
}, {});

module.exports = {
	entry: entry,
	output: {
		path: path.resolve(__dirname, config.js.dest),
		filename: '[name].js'
	},
	debug: true,
	devtool: (debug == 'Y') ? 'source-map' : null,
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|build)/,
				loader: 'babel-loader'
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.(scss|css)$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.handlebars$/,
				loader: 'handlebars-loader'
			},
			{
				test: /\.hbs$/,
				loader: 'handlebars-template-loader'
			}
		]
	},
	node: {
		fs: 'empty'
	}
};
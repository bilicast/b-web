var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var $ = require('gulp-load-plugins')();

// TEST

//process.env['DOMAIN'] = 'https://review.com';



var domain = process.env['DOMAIN'] || '';
var debug = process.env['DEBUG'] || 'N';

gulp.task('build:app', function() {
	var v = new Date().getTime();

	return gulp.src('src/entry.js')
		.pipe($.webpack(require('../config-webpack.js')))
		.pipe($.replace('[___VERSION___]', v))
		.pipe($.replace('[___DOMAIN___]', domain))
		.pipe($.replace('[___DEBUG___]', debug))
		.pipe(gulpif(debug == 'N', uglify())) // TEST
		.pipe(gulp.dest('dist/js'));
});

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('../gulp-config.json');

gulp.task('build:sass', function() {
	gulp.src(config.sass.src)
		.pipe($.sass())
		.pipe(gulp.dest(config.sass.dest));
});
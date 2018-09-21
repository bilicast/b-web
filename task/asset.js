var gulp = require('gulp');
var gulpif = require('gulp-if');
var config = require('../gulp-config.json');

var stage = process.env['STAGE'] || '';

gulp.task('move:image', function () {
    return gulp.src(config.image.src)
        .pipe(gulp.dest(config.image.dest));
});
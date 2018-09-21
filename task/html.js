var gulp = require('gulp');
var es = require('event-stream');
var $ = require('gulp-load-plugins')();
var config = require('../gulp-config.json');

var replacements = {
    ga: '',
    domain: 'document.domain = "aikaa.tw";',
    time: 'var TIME_LOADED = new Date().getTime();',
};

gulp.task('build:html', function () {
    var v = new Date().getTime();

    return es.merge(config.apps.map(function (app, index) {
        return gulp.src(config.js.src + '/' + app.name + '/' + app.html)
            .pipe($.replace('[___VERSION___]', '?v=' + v))
            .pipe($.replace('[___APP___]', '/js/' + app.src + '?v=' + v))
            .pipe($.replace('[___DOMAIN___]', replacements.domain))
            .pipe($.replace('[___GA___]', replacements.ga))
            .pipe($.rename('index.html'))
            .pipe(gulp.dest(config.js.dest + '/' + ((app.name == 'home') ? '' : app.name + '/')));
    }));
});

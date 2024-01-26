var gulp = require ('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload');

const cssMin = require('gulp-cssmin');
const clean = require('gulp-clean');
const sassDart = require('gulp-dart-sass');
const ifG = require('gulp-if');
const browserSync = require('browser-sync');

let isDev = false;
let stylesOnlyModify = false;


gulp.task('dev', function () {
    isDev = true;
    // gulp.watch(jsPath, gulp.series('js:concat'));
    gulp.watch(['./scss/**/*.scss', '!./scss/**/_*.scss'], gulp.series('styles:scss')).on('change', () => {
        stylesOnlyModify = true;
    });
    gulp.watch('./scss/**/_*.scss', gulp.series('styles:scss')).on('change', () => {
        stylesOnlyModify = false;
    });
    gulp.watch("./*.html").on('change', browserSync.reload);

    gulp.series(
        gulp.parallel('server', 'clean'),
        gulp.parallel(
            // 'js:concat',
            'styles:scss'
        )
    )();
});

gulp.task('build', function (cd) {
    isDev = false;
    gulp.series(
        'clean',
        gulp.parallel(
            'styles:scss',
            // 'js:concat'
        )
    )();
    cd();
});

gulp.task('styles:scss', function () {
    let srcParam = {};
    if ( stylesOnlyModify ) {
        srcParam = {since: gulp.lastRun('styles:scss')};
    }
    return gulp.src('./scss/**/*.scss', srcParam)
        .pipe(ifG(isDev, sourcemaps.init()))
        .pipe(sassDart().on('error', sass.logError))
        .pipe(ifG(!isDev, autoprefixer({
            browsers: ["> 0%"],
            cascade: false
        })))
        .pipe(ifG(isDev, sourcemaps.write('.')))
        .pipe(ifG(!isDev, cssMin()))
        .pipe(gulp.dest('./css'))
        .pipe(ifG(isDev, livereload()))
        .pipe(ifG(isDev, browserSync.stream()));
});

gulp.task('clean', function () {
    return gulp.src([
        // './css',
        './*.zip',
    ], {
        read: false,
        allowEmpty: true,
    }).pipe(clean());
});

gulp.task('server', function (cd) {
    browserSync.init({
        server: {
            baseDir: './',
        },
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false,
        },
        https: true,
        open: false,
        online: true,
        tunnel: false,
        directory: true,
    });
    cd();
});
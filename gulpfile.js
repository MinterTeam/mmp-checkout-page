// common
const gulp = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const log = require('fancy-log');
const beeper = require('beeper');
// css
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const cleanCss = require('gulp-clean-css');



let paths = {
    src: {
        less: 'less/*.less',
    },
    dest: {
        css: 'css/',
    },
    watch: {
        less: 'less/**/*.less',
    },
};




// LESS
gulp.task('less', function() {
    return gulp.src(paths.src.less)
        .pipe(plumber({errorHandler: onError}))
        .pipe(less())
        .pipe(postcss([
            autoprefixer({cascade: false}),
            postcssPresetEnv({
                stage: 2,
                features: {
                    'all-property': false,
                    'case-insensitive-attributes': false,
                    'focus-visible-pseudo-class': false,
                    'focus-within-pseudo-class': false,
                    'matches-pseudo-class': false,
                },
            }),
        ]))
        .pipe(cleanCss({
            level: {
                1: {},
                2: {
                    removeUnusedAtRules: true,
                },
            },
        }))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(paths.dest.css));
});




// Полная сборка без вотча
gulp.task('once', gulp.parallel('less'));
// Полная сборка с вотчем
gulp.task('default', gulp.series(
    'once',
    function watch() {
        gulp.watch(paths.watch.less, gulp.task('less'));
        setTimeout(function() {
            log('Watching...');
        });
    },
));




// Ошибки
let onError = function(error) {
    log([
        (error.name + ' in ' + error.plugin).bold.red,
        '',
        error.message,
        '',
    ].join('\n'));
    beeper();
    this.emit('end');
};



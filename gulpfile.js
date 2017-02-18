var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var path = require('path');

var rollup = require('rollup');

var babel = require("gulp-babel");

var babelify = require('babelify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

gulp.task("JSX", function() {
    gulp.src("./examples/**/*.jsx")
        .pipe(babel({
            presets: [
                "babel-preset-stage-0", "babel-preset-react"
            ],
            "plugins": [
                "transform-es3-property-literals",
                "transform-es3-member-expression-literals",
                "transform-es2015-shorthand-properties", ['transform-es2015-modules-commonjs', { "loose": true }],
                'transform-es2015-arrow-functions',
                'transform-es2015-block-scoped-functions',
                'transform-es2015-block-scoping',
                'transform-es2015-classes',
                'transform-es2015-computed-properties',
                'transform-es2015-destructuring',
                'transform-es2015-for-of',
                //'transform-es2015-function-name',
                'transform-es2015-literals',
                'transform-es2015-object-super',
                'transform-es2015-parameters',
                'transform-es2015-spread',
                'transform-es2015-sticky-regex',
                'transform-es2015-template-literals',
                'transform-es2015-typeof-symbol',
                'transform-es2015-unicode-regex',
            ]
        }))
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(gulp.dest('./examples'));
});

gulp.task("bundle", function() {
    return rollup.rollup({
            entry: "./src/Neact.js"
        })
        .then(function(bundle) {
            bundle.write({
                format: "es",
                dest: "./dist/src/bundle.js",
                sourceMap: false
            });
        })
});

gulp.task("compile", function() {
    return gulp.src("./src/**/*.js")
        .pipe(babel({
            presets: [
                "babel-preset-stage-0"
            ],
            "plugins": [
                "transform-es3-property-literals",
                "transform-es3-member-expression-literals",
                "transform-es2015-shorthand-properties", ['transform-es2015-modules-commonjs', { "loose": true }],
                'transform-es2015-arrow-functions',
                'transform-es2015-block-scoped-functions',
                'transform-es2015-block-scoping',
                'transform-es2015-classes',
                'transform-es2015-computed-properties',
                'transform-es2015-destructuring',
                'transform-es2015-for-of',
                //'transform-es2015-function-name',
                'transform-es2015-literals',
                'transform-es2015-object-super',
                'transform-es2015-parameters',
                'transform-es2015-spread',
                'transform-es2015-sticky-regex',
                'transform-es2015-template-literals',
                'transform-es2015-typeof-symbol',
                'transform-es2015-unicode-regex',
            ]
        }))
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(gulp.dest('./dist/src'));

});

gulp.task("build", ['bundle'], function() {
    return browserify({
            entries: ["./dist/src/bundle.js"],
            standalone: 'Neact'
        })
        .transform(babelify, {
            presets: [
                "babel-preset-stage-0"
            ],
            "plugins": [
                "transform-es3-property-literals",
                "transform-es3-member-expression-literals",
                "transform-es2015-shorthand-properties", ['transform-es2015-modules-commonjs', { "loose": true }],
                'transform-es2015-arrow-functions',
                'transform-es2015-block-scoped-functions',
                'transform-es2015-block-scoping',
                'transform-es2015-classes',
                'transform-es2015-computed-properties',
                'transform-es2015-destructuring',
                'transform-es2015-for-of',
                //'transform-es2015-function-name',
                'transform-es2015-literals',
                'transform-es2015-object-super',
                'transform-es2015-parameters',
                'transform-es2015-spread',
                'transform-es2015-sticky-regex',
                'transform-es2015-template-literals',
                'transform-es2015-typeof-symbol',
                'transform-es2015-unicode-regex',
            ]
        })
        .bundle()
        .pipe(source("neact.js"))
        .pipe(gulp.dest("./dist"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./dist'));
});


gulp.task("default", ["build", 'compile', 'JSX']);

gulp.watch(["./src/**/*.js"], function() {
    gulp.run('build');
    gulp.run('compile');
});

gulp.watch(["./examples/**/*.jsx"], function() {
    gulp.run('JSX');
});
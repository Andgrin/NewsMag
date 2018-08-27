'use strict';

var gulp = require('gulp');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var pump = require('pump');


gulp.task('styles', function() {

   var sassStream = gulp.src('src/css/*.sass')
       .pipe(sass())
       .pipe(concat('scss-files.css'))
   ;
   
   var cssStream = gulp.src('src/css/*.css')
       .pipe(concat('css-files.css'))
   ;

   var mergedStream = merge( sassStream, cssStream)
       .pipe(concat('styles.css'))
       .pipe(minifyCSS())
       .pipe(gulp.dest('public/css'));

   return mergedStream;
});

gulp.task('scripts', function (cb) {
    pump([
          gulp.src('src/js/*.js'),
          uglify(),
          gulp.dest('public/js')
      ],
      cb
    );
  });

gulp.task('default', [ 'styles', 'scripts' ]);
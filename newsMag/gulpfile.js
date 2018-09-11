'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,

    minifyCSS = require('gulp-csso'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    merge = require('merge-stream'),
    uglify = require('gulp-uglify'),
    pump = require('pump');


var path = {
   build: {
      html: 'build/',
      js: 'build/js/',
      css: 'build/css/',
      img: 'build/img/',
      fonts: 'build/fonts/'
   },
   src: {
      html: 'src/*.html',
      js: 'src/js/script.js',
      style: 'src/css/styles.sass',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*'
   },
   watch: {
      html: 'src/**/*.html',
      js: 'src/js/**/*.js',
      style: 'src/css/**/*.sass',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*'
   }
};
  
var config = {
   server: {
      baseDir: "./build"
   },
   tunnel: true,
   host: 'localhost',
   port: 8080,
   logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function () {
   browserSync(config);
});

// gulp.task('clean', function (cb) {
//    rimraf(path.clean, cb);
// });

gulp.task('html:build', function () {
   gulp.src(path.src.html) 
      .pipe(rigger())
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
   gulp.src(path.src.js) 
      .pipe(rigger()) 
      // .pipe(sourcemaps.init()) 
      .pipe(uglify()) 
      // .pipe(sourcemaps.write()) 
      .pipe(gulp.dest(path.build.js))
      .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
   gulp.src(path.src.style) 
      // .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefixer())
      .pipe(cssmin())
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(reload({stream: true}));
});

// gulp.task('image:build', function () {
//    gulp.src(path.src.img) 
//       .pipe(imagemin({
//          progressive: true,
//          svgoPlugins: [{removeViewBox: false}],
//          use: [pngquant()],
//          interlaced: true
//       }))
//       .pipe(gulp.dest(path.build.img))
//       .pipe(reload({stream: true}));
// });

gulp.task('fonts:build', function() {
   gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
   'html:build',
   'js:build',
   'style:build',
   'fonts:build',
   // 'image:build'
]);


gulp.task('watch', function(){
   watch([path.watch.html], function(event, cb) {
      gulp.start('html:build');
   });
   watch([path.watch.style], function(event, cb) {
      gulp.start('style:build');
   });
   watch([path.watch.js], function(event, cb) {
      gulp.start('js:build');
   });
   watch([path.watch.img], function(event, cb) {
      gulp.start('image:build');
   });
   watch([path.watch.fonts], function(event, cb) {
      gulp.start('fonts:build');
   });
});


gulp.task('default', ['build', 'webserver', 'watch']);



// gulp.task('styles', function() {

//    var sassStream = gulp.src('src/css/styles.sass')
//        .pipe(sass())
//        .pipe(concat('scss-files.css'))
//    ;
   
//    var cssStream = gulp.src('src/css/*.css')
//        .pipe(concat('css-files.css'))
//    ;

//    var mergedStream = merge( sassStream, cssStream)
//        .pipe(concat('styles.css'))
//        .pipe(minifyCSS())
//        .pipe(gulp.dest('public/css'));

//    return mergedStream;
// });




// gulp.task('scripts', function (cb) {
//    pump([
//          gulp.src('src/js/*.js'),
//          uglify(),
//          gulp.dest('public/js')
//       ],
//       cb
//    );
// });

// gulp.task('default', [ 'styles', 'scripts' ]);

var themename = "panda";

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    jshint = require('gulp-jshint'),
    autoprefixer = require('autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    image = require('gulp-image'),
    newer = require('gulp-newer'),
    postcss = require('gulp-postcss'),
    browserSync = require('browser-sync').create();

var root = "../" + themename + '/',
    scss = root + '/sass',
    js = root + '/js',
    images = root + '/images',
    languages = root + '/languages';



gulp.task('css', function() {
  return sass(scss+'/**/*', {
    sourcemap: true,
    style: 'expanded'
  })
  .on('error', function(err){
    console.log('!Error: ', err.message);
  })
  .pipe(postcss([
      autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      })
  ]))
  .pipe(sourcemaps.write('./', {
    includeContent: false,
    sourceRoot: scss
  }))
  .pipe(gulp.dest(root))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function () {
    return gulp.src(images+ '/RAW/**/*.{jpg, png, JPG, JPEG}')
        .pipe(newer(images))
        .pipe(image())
        .pipe(gulp.dest(images))
});

gulp.task('js', function () {
   return gulp.src(js + "*.js")
       .pipe(jshint())
       .pipe(jshint.reporter('default'))
       .pipe(gulp.dest(js));
});

gulp.task('watch', function () {
   browserSync.init({
       open: "external",
       proxy: "http://localhost:8888/panda-dev/"
   });
   gulp.watch([root + '**/*.css', root + '**/*.scss'], ['css']);
   gulp.watch([js + '**/*.js'], ['js']);
   gulp.watch([images + '/RAW/**/*.{jpg, png, JPG, JPEG}'], ['img']);
   gulp.watch(root + '**/**').on('change', browserSync.reload);
});

gulp.task('default', ['css', 'js', 'img', 'watch']);
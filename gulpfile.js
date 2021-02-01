'use strict';

const gulp     = require('gulp'),
  sass         = require('gulp-sass'),
  minifyCss    = require('gulp-cssnano'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps   = require('gulp-sourcemaps'),
  rename       = require('gulp-rename'),
  newer        = require('gulp-newer'),
  notify       = require('gulp-notify'),
  notifier     = require('node-notifier'),
  del          = require('del'),
  replace      = require('replace'),
  path         = require('path');

const PROJECT_TITLE = 'CV',
  BASE_PATH = '.',
  PATHS = [
    './index.html',
    './en/index.html',
  ];


const DIST_CSS = `${BASE_PATH}/css`;

const sassVersion = (version) => {
  del([
    `${DIST_CSS}/style.*`,
    `${DIST_CSS}/**/*.gz`,
  ]);

  replace({
    regex: /style\.\d{13,}\.css/g,
    replacement: `style.${version}.css`,
    paths: PATHS,
    silent: true,
  });
};

function sassDev() {
  const version = Date.now();
  sassVersion(version);

  return gulp.src(`${BASE_PATH}/src/css/style.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',notify.onError({
      title: PROJECT_TITLE,
      message: "Error: <%= error.message %>",
    })))
    .pipe(rename(`style.${version}.css`))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST_CSS));
}

function sassBuild() {
  const version = Date.now();
  sassVersion(version);

  return gulp.src(`${BASE_PATH}/src/css/style.scss`)
    .pipe(sass().on('error',notify.onError({
      title: PROJECT_TITLE,
      message: "Error: <%= error.message %>",
    })))
    .pipe(autoprefixer())
    .pipe(minifyCss({ zindex: false }))
    .pipe(rename(`style.${version}.css`))
    .pipe(gulp.dest(DIST_CSS));
}

function cssTask() {
  return gulp.src('./src/css/*.css')
    .pipe(newer(DIST_CSS))
    .pipe(autoprefixer())
    .pipe(minifyCss({
      keepSpecialComments: false,
      zindex: false,
    }))
    .pipe(gulp.dest(DIST_CSS));
}

function watchTask() {
  gulp.watch(['./src/css/*.scss'], sassDev);
  gulp.watch(['./src/css/*.css'], cssTask);
}

function showMessage(message) {
  const icon = path.join(__dirname, `${BASE_PATH}/img/cv-icon.png`);
  notifier.notify({
    title: PROJECT_TITLE,
    message,
    icon,
  });
}

gulp.task('build',
  gulp.series(
    gulp.parallel(
      sassBuild,
      cssTask,
    ),
    function messageBuild(done) {
      showMessage('Build completed!');
      done();
    },
  ),
);

gulp.task('default',
  gulp.parallel(
    sassDev,
    cssTask,
    watchTask,
    function messageDefault(done) {
      showMessage('gulp running!');
      done();
    },
  ),
);

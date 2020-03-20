'use strict'

const gulp         = require('gulp'),
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
      path         = require('path')

const PROJECT_TITLE = 'CV'
const BASE_PATH = '.'
const PATHS = [
  './index.html',
  './en/index.html',
]


// Sass (SCSS -> CSS -> CSS min)
const DIST_CSS = `${BASE_PATH}/css`

const sassVersion = (version) => {

  del([
    `${DIST_CSS}/style.*`,
    `${DIST_CSS}/**/*.gz`,
  ])

  // replace
  replace({
    regex: /style\.\d{13,}\.css/g,
    replacement: `style.${version}.css`,
    paths: PATHS,
    silent: true
  })

} // sassVersion

gulp.task('sass:dev', function() {

  const version = Date.now()
  sassVersion(version)

  return gulp.src(`${BASE_PATH}/src/css/style.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error',notify.onError({
      title: PROJECT_TITLE,
      message: "Error: <%= error.message %>"
    })))
    .pipe(rename(`style.${version}.css`))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST_CSS))

}) // sass:dev

gulp.task('sass:build', function() {

  const version = Date.now()
  sassVersion(version)

  return gulp.src(`${BASE_PATH}/src/css/style.scss`)
    .pipe(sass().on('error',notify.onError({
      title: PROJECT_TITLE,
      message: "Error: <%= error.message %>"
    })))
    .pipe(autoprefixer())
    .pipe(minifyCss({ zindex: false }))
    .pipe(rename(`style.${version}.css`))
    .pipe(gulp.dest(DIST_CSS))

}) // sass:build

// CSS
gulp.task('css', function() {
  return gulp.src('./src/css/*.css')
    .pipe(newer(DIST_CSS))
    .pipe(autoprefixer())
    .pipe(minifyCss({
      keepSpecialComments: false,
      zindex: false,
    }))
    .pipe(gulp.dest(DIST_CSS))
})

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(['./src/css/*.scss'], ['sass:dev'])
  gulp.watch(['./src/css/*.css'], ['css'])
})

function showMessage(message) {
  const icon = path.join(__dirname, `${BASE_PATH}/img/cv-icon.png`)

  notifier.notify({
    title: PROJECT_TITLE,
    message,
    icon,
  })
} // showMessage

// build
gulp.task('build', [
  'sass:build',
  'css'
], () => showMessage('Build completed!'))

// Default Task
gulp.task('default', [
  'sass:dev',
  'css',
  'watch'
], () => showMessage('gulp running!'))

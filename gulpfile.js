'use strict'

const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      minifyCss    = require('gulp-cssnano'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps   = require('gulp-sourcemaps'),
      rename       = require('gulp-rename'),
      newer        = require('gulp-newer'),
      // gzip         = require('gulp-gzip'),
      // combiner     = require('stream-combiner2'),
      // watchify     = require('watchify'),
      // browserify   = require('browserify'),
      // babelify     = require('babelify'),
      // vueify       = require('vueify'),
      // aliasify     = require('aliasify'),
      // vinylBuffer  = require('vinyl-buffer'),
      // source       = require('vinyl-source-stream'),
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

// // JS (general)
// var DIST_JS = 'js'
// gulp.task('js', function() {

//   const version = Date.now()

//   del([`${DIST_JS}/cv*.js`])

//   replace({
//     regex: /version=\d{13,}/g,
//     replacement: `version=${version}`,
//     paths: ['./index.html'],
//     silent: true
//   })

//   replace({
//     regex: /cv\.\d{13,}\.js/g,
//     replacement: `cv.${version}.js`,
//     paths: ['./index.html'],
//     silent: true
//   })

//   const combined = combiner.obj([
//     gulp.src(['./src/js/*.js']),
//     uglify(),
//     rename(`cv.${version}.js`),
//     gulp.dest(DIST_JS)
//   ])

//   combined.on('error', notify.onError({
//     title: PROJECT_TITLE,
//     message: "<%= error.fileName %> (line=<%= error.lineNumber %>)"
//   }))

//   return combined
// })


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
  // gulp.watch(['./src/js/*.js'], ['js'])
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
  // 'js',
  'sass:build',
  'css'
], () => showMessage('Build completed!'))

// Default Task
gulp.task('default', [
  // 'js',
  'sass:dev',
  'css',
  'watch'
], () => showMessage('gulp running!'))

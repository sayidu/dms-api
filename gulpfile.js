const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

/**
 * @desc Gulp task to run tests after transpilation from es6 to es5
 */
gulp.task('tests', ['transpileServer', 'transpileTests'], () => {
  gulp.src('dist/tests/**/*.*')
  .pipe(mocha());
});

/**
 * Gulp tasks to transpile source code in the server folder to es5
 * @desc expressServer transpiles server startup files
 * @desc transpileServer transpiles server files.
 * @desc transpileTests transpile tests for the server.
 */
gulp.task('expressServer', () => {
  return gulp.src(['app.js'])
  .pipe(babel({ presets: ['es2015','stage-2']}))
  .pipe(gulp.dest('dist/'));
});

gulp.task('transpileServer', () => {
  return gulp.src(['./server/**/*.js'])
  .pipe(babel({ presets: ['es2015','stage-2']}))
  .pipe(gulp.dest('dist/server'));
});

gulp.task('transpileTests', () => {
  return gulp.src(['./tests/**/*'])
  .pipe(babel({ presets: ['es2015','stage-2']}))
  .pipe(gulp.dest('dist/tests'));
});

/**
 * @desc Gulp task to run the server
 */
gulp.task('serve', () => {
  nodemon({ script: './dist/server/config/server.js' });
});

/**
 * @desc Gulp task to watch the server folder for file changes, then run
 * necessary commands afterwards
 */

gulp.task('watch_server', () => {
  gulp.watch('server/**/*.*', { cwd: './' });
});

gulp.task('transpiler', ['expressServer', 'transpileServer']);
/**
 * @desc Gulp task for development environment
 * Transpile the server source files to es5,
 * start the server,
 * listen to changes on the server files
 */
gulp.task('setup_server', ['expressServer', 'transpileServer', 'serve', 'watch_server']);
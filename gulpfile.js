const { watch, series } = require('gulp');


var gulp = require('gulp'),
  exec = require('child_process').exec;



const compile = gulp.series(function (done) {
  exec('tsc', function (err, stdOut, stdErr) {
    console.log(stdOut);
    if (err){
      done(err);
    } else {
      done();
    }
  });
});
exports.compile = compile

const build =  gulp.series(compile, function () {
    return gulp.src('./src/views/**')
      .pipe(gulp.dest('./dist/views'));
});
exports.build = build


const watchFiles = function(){
    watch("src/**", gulp.series('build'))
}

exports.watch = watchFiles

exports.default = gulp.series(build)
// exports.default = function() {
//   // You can use a single task
//   watch('src/*.css', css);
//   // Or a composed task
//   watch('src/*.js', series(clean, javascript));
// };
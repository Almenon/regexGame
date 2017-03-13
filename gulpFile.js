var gulp = require('gulp');

gulp.task('default', function () {
    gulp.src('whatev')
        .pipe(uglify())
        .pipe(gzip())
        .pipe(gulp.dest('./public/scripts'));
});
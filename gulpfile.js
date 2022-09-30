var gulp = require("gulp");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify-es").default;
var merge = require("merge2");
var tsProject = ts.createProject("tsconfig.release.json");

async function build() {
  var tsResult = tsProject.src().pipe(tsProject());

  return merge([
    tsResult.dts.pipe(gulp.dest("dist")),
    tsResult.js
      .pipe(gulp.dest("tmp")) // Store js files in 'temp' folder as uglify only works for .js and not .ts files
      .pipe(gulp.src("tmp/**/*"))
      .pipe(uglify())
      .pipe(gulp.dest("dist")),
  ]);
}

gulp.task("default", build);

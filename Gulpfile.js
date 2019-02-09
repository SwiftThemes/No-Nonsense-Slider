var gulp = require("gulp"),
  babel = require("gulp-babel"),
  watch = require("gulp-watch"),
  concat = require("gulp-concat"),
  deporder = require("gulp-deporder"),
  stripdebug = require("gulp-strip-debug"),
  uglify = require("gulp-uglify-es").default,
  rename = require("gulp-rename"),
  gutil = require("gulp-util"),
  pump = require("pump"),
  zip = require("gulp-zip"),
  runSequence = require("gulp-run-sequence"),
  rsync = require("gulp-rsync");

gulp.task("jsx", function() {
  console.log("called");
  return (
    gulp
      .src("assets/js/admin/*.jsx")
      .pipe(
        babel({
          presets: ["react"]
        })
      )
      .pipe(concat("srs-admin-scripts.js"))
      .pipe(
        rename({
          basename: "srs-admin-scripts",
          suffix: ".min"
        })
      )
      // .pipe(uglify())
      .pipe(gulp.dest("./assets/js/admin/"))
  );
});

gulp.task("scripts", function() {
  return (
    gulp
      .src(["./assets/js/*.js", "!./assets/js/*.min.js"])
      .pipe(concat("srs-slider.js"))
      // .pipe(gulp.dest('./assets/js'))
      .pipe(
        rename({
          basename: "srs-slider",
          suffix: ".min"
        })
      )
      // .pipe(uglify())
      .on("error", function(err) {
        gutil.log(gutil.colors.red("[Error]"), err.toString());
      })
      .pipe(gulp.dest("./assets/js/"))
  );
});
gulp.task("watch", ["jsx", "scripts"], function() {
  // watch("assets/js/admin/*.jsx", ["jsx"]);
  // watch("assets/js/*.js", ["scripts"]);

  watch("assets/js/admin/*.jsx", function() {
    gulp.start("jsx");
  });
  watch("assets/js/*.js", ["scripts"]);
});

buildInclude = [
  // include common file types
  "**/*.php",
  "**/*.html",
  "**/*.css",
  "**/*.js",
  "**/*.svg",
  "**/*.ttf",
  "**/*.otf",
  "**/*.eot",
  "**/*.woff",
  "**/*.woff2",
  "**/*.pot",

  // include specific files and folders
  "readme.txt",
  "readme.md",

  // exclude files and folders
  "!node_modules/**/*",
  "!assets/bower_components/**/*",
  "!style.css.map",
  // '!assets/js/custom/*',
  "!gulp/*",
  "!*.psd",
  "!gulpfile.js",
  "!Gulpfile.js"
];
build = "/Users/satish/Work/Development/can-delete/build-srs/"; // Files that you want to package into a zip go here
gulp.task("buildFiles", function() {
  return gulp
    .src(buildInclude)
    .pipe(gulp.dest(build + "simple-responsive-slider/"));
});

gulp.task("buildZip", function() {
  return gulp
    .src(build + "/**/", { base: build })
    .pipe(zip("simple-responsive-slider.zip"))
    .pipe(gulp.dest("/Users/satish/Desktop"))
    .pipe(
      gulp.dest(
        "/Users/satish/Work/Development/htdocs/helium/wp-content/themes/page-speed/plugins"
      )
    );
  // .pipe(gulp.dest('/Users/satish/Dropbox/Public/'))
});

gulp.task("build", function(cb) {
  runSequence("jsx", "scripts", "buildFiles", "buildZip", cb);
});

// Default options for rsync
rsyncConfGlobal = {
  progress: true,
  incremental: true,
  relative: true,
  emptyDirectories: true,
  recursive: true,
  clean: true,
  port: 1122,
  exclude: []
};
rsyncConfGlobal.hostname = "172.93.98.50"; // hostname
rsyncConfGlobal.username = "swiftswift"; // ssh username
gulp.task("uploadToUpdateServer", function() {
  var rsyncConf = Object.assign({}, rsyncConfGlobal);
  rsyncConf.root = "/Users/satish/Desktop/";
  var rsyncPaths = ["/Users/satish/Desktop/simple-responsive-slider.zip"];
  rsyncConf.destination =
    "/home/swiftswift/public_html/__updates__/packages/simple-responsive-slider.zip"; // path where uploaded files go

  gulp.src(rsyncPaths).pipe(rsync(rsyncConf));

  return;
});

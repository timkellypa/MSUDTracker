var gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    esdoc = require("gulp-esdoc"),
    KarmaServer = require("karma").Server,
    karmaConfig,
    addLint,
    addDocs;

karmaConfig =
{
    configFile: __dirname + '/karma.conf.js'
};

addLint = function (gulper) {
    "use strict";
    gulper
        .pipe(
        eslint({
                options: {
                    configFile: ".eslintrc"
                }
            }
        )
    )
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
};

addDocs = function (gulper) {
    "use strict";
    gulper
        .pipe(
        esdoc({
                excludePattern: "/test/",
                destination: "./doc"
            }
        )
    );
};

gulp.task("default", function (done) {
    "use strict";
    var lintFiles = gulp.src("./www/scripts/**/*.js"),
        docFiles = gulp.src("./www/scripts/");

    // Lint
    addLint(lintFiles);

    // Docs
    addDocs(docFiles);

    // Test
    new KarmaServer(karmaConfig, done).start();
});

gulp.task("docs", function () {
    "use strict";
    var docFiles = gulp.src("./www/scripts/");
    addDocs(docFiles);
});

gulp.task("lint", function () {
    "use strict";
    var lintFiles = gulp.src("./www/scripts/**/*.js");
    addLint(lintFiles);
});

gulp.task("test", function (done) {
    "use strict";
    new KarmaServer(karmaConfig, done).start();
});
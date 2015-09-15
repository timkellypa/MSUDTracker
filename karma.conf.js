// an example karma.conf.js
module.exports = function (config) {
    "use strict";
    config.set({
        preprocessors: {
            "**/www/scripts/Core/**/*.js": ['coverage'],
            "**/www/scripts/Data/**/*.js": ['coverage'],
            "**/www/scripts/Lib/Local/**/*.js": ['coverage'],
            "**/www/scripts/UI/**/*.js": ['coverage']
        },
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-requirejs',
            'karma-mocha',
            'karma-chai'
        ],

        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: true,

        files: [
            "www/scripts/Index.js",
            {
                pattern: "www/scripts/test/test.js",
                included: false
            },
            {
                pattern: "www/scripts/**/*.js",
                included: false
            }
        ],

        reporters: ["progress", "coverage"],

        // exclude: ["www/scripts/Index.js"],
        frameworks: ['requirejs', 'mocha', 'chai'],
        browsers: ['PhantomJS'],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                {
                    type: 'html',
                    subdir: 'html'
                },
                {
                    type: 'lcovonly',
                    subdir: 'lcov'
                },
                {
                    type: 'cobertura',
                    subdir: 'cobertura'
                },
                {type: 'text'}
            ]
        }

    });
};
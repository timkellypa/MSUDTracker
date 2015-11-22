// an example karma.conf.js
module.exports = function (config) {
    "use strict";
    var webpack = require("webpack");
    config.set({
        preprocessors: {
            "src/Core/Test/TestRunner.js": ['webpack' , 'sourcemap']
        },
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-coverage',
            'karma-mocha',
            'karma-chai',
            'karma-webpack',
            'karma-sourcemap-loader'
        ],

        webpack: {
            output: {
                path: __dirname + "/base/src",
                publicPath: "/base/src",
                filename: 'test-bundle.js'
            },
            amd: {
                jquery: true,
                underscore: true,
                moment: true,
                rsvp: true,
                indexeddbshim: true,
                pathjs: true
            },
            devtool: "#inline-source-map",
            module: {
                loaders: [
                    {
                        test: /.js$/,
                        include: __dirname + "/src",
                        loader: 'babel-loader'
                    }
                ]
            },
            /*
            plugins: [
                new webpack.SourceMapDevToolPlugin(
                    '/www/scripts/test/test.js.map', null,
                    "[absolute-resource-path]", "[absolute-resource-path]"
                )
            ],
            */

            resolve: {
                root: [
                    __dirname + "/src"
                ]
            }
        },

        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: true,

        files: [
            "src/Core/Test/TestRunner.js"
        ],

        reporters: ["progress"/*, "coverage"*/],

        exclude: ["src/MSUD/Index.js"],
        frameworks: ['mocha', 'chai'],
        browsers: ['PhantomJS']

        /*
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
         */

    });
};
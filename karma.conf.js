// an example karma.conf.js
module.exports = function (config) {
    "use strict";
    var webpack = require("webpack");
    config.set({
        preprocessors: {
            "www/scripts/test/test.js": ['webpack' , 'sourcemap']
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
                path: __dirname + "/base/www/scripts",
                publicPath: "/base/www/scripts",
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
                        include: __dirname + "/www/scripts",
                        exclude: __dirname + "/www/scripts/Lib/Vendor",
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
                    __dirname + "/www/scripts"
                ]
            }
        },

        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: true,

        files: [
            "www/scripts/test/test.js"
        ],

        reporters: ["progress"/*, "coverage"*/],

        exclude: ["www/scripts/Index.js"],
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
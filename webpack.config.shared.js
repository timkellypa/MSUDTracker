/*global __dirname */
(function () {
    "use strict";
    var _ = require("underscore"),
        path = require("path");

    module.exports = _.extend({}, {
        entry: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/MSUD/Index.js')
            ],
        output: {
            path: path.resolve(__dirname, "www"),
            publicPath: "/www/",
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, "src"),
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                },
                {
                    test: /jquery-colorbox/,
                    loader: "imports?jQuery=jquery,$=jquery,this=>window"
                },
                {
                    test: /\.html$/,
                    loader: "html-loader",
                    query: {mimetype: "text/html"}
                },
                {
                    test: /\.json$/,
                    loader: "raw-loader"
                },
                {
                    test: /\.png$/,
                    loader: "url-loader?limit=100000"
                },
                {
                    test: /\.gif$/,
                    loader: "url-loader?limit=100000"
                },

                {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
                {test: /\.css$/, loader: 'style-loader!css-loader'},
                {test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
                {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
                {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
                {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
            ]
        },
        resolve: {
            root: [
                path.resolve(__dirname, "src")
            ]
        },
        amd: {
            jquery: true,
            underscore: true,
            moment: true,
            rsvp: true,
            indexeddbshim: true,
            pathjs: true
        },
        plugins: []
    });
}());

/*global __dirname */
(function () {
    "use strict";
    var _ = require("underscore");

    module.exports = _.extend({}, {
        entry: __dirname + '/src/MSUD/Index.js',
        output: {
            path: __dirname + "/www",
            publicPath: "/www/",
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /.js$/,
                    include: __dirname + "/src",
                    loader: 'babel-loader'
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
                __dirname + "/src"
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

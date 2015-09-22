/*global __dirname */
(function () {
    "use strict";
    var webpack = require("webpack"),
        _ = require("underscore");

    module.exports = _.extend({}, {
        entry: __dirname + '/www/scripts/Index.js',
        output: {
            path: __dirname + "/www/scripts",
            publicPath: "www/scripts",
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /.js$/,
                    include: __dirname + "/www/scripts",
                    exclude: __dirname + "/www/scripts/Lib/Vendor",
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    loaders: ["style", "css"]
                },
                {
                    test: /\.html$/,
                    loader: "html-loader",
                    query: {mimetype: "text/html"}
                },
                {
                    test: /\.json$/,
                    loader: "raw-loader"
                }
            ]
        },
        resolve: {
            root: [
                __dirname + "/www/scripts"
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

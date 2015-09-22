/*global __dirname */
(function () {
    "use strict";
    var webpack = require("webpack"),
        _ = require("underscore"),
        config = require("./webpack.config.shared");

    config.devtool = "inline-source-map";
    /*
     config.plugins.push(
     new webpack.SourceMapDevToolPlugin(
     'bundle.js.map', null,
     "[absolute-resource-path]", "[absolute-resource-path]"
     )
     ); */

    module.exports = config;
}());

/*global __dirname */
(function () {
    "use strict";
    var webpack = require("webpack"),
        config = require("./webpack.config.shared");

    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'indexeddbshim', 'indexedDB', 'IDBKeyRange']
            }
        })
    );
    module.exports = config;
}());

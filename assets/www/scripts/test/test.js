/*globals __dirname */
(function () {
    "use strict";
    var requirejs = require("requirejs"),
        core,
        data;

    requirejs.config({
        baseUrl: __dirname + "/../../scripts",
        nodeRequire: require
    });

    core = requirejs("test/Core/-runTests");
    core.execute();

    data = requirejs("test/Data/-runTests");
    data.execute();

    module.exports = function () {
        return true;
    };
}());
/*globals __dirname */
(function () {
    "use strict";
    var requirejs = require("requirejs"),
        core,
        data,
        lib;

    requirejs.config({
        baseUrl: __dirname + "/../../scripts",
        nodeRequire: require
    });

    core = requirejs("test/Core/-runTests");
    core.execute();

    data = requirejs("test/Data/-runTests");
    data.execute();

    lib = requirejs("test/Lib/-runTests");
    lib.execute();

    module.exports = function () {
        return true;
    };
}());
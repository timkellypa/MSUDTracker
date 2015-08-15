define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var _ = require("underscore"),
        UtilsTests;
    /**
     * @namespace Runner for tests in "Utils" directory
     * @memberof Test
     */
    UtilsTests = {
        UtilsTest: require("./UtilsTest"),
        execute: function () {
            var iNdx,
                aTests = _.keys(this);
            for (iNdx = 0; iNdx < aTests.length; ++iNdx) {
                if (this[aTests[iNdx]].execute) {
                    this[aTests[iNdx]].execute();
                }
            }
        }
    };
    return UtilsTests;
});

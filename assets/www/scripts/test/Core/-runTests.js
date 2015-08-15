define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {
    "use strict";
    var _ = require("underscore"),
        CoreTests;

    /**
     * @namespace Runner for tests in "Core" directory
     * @memberof Test
     */
    CoreTests = {
        DatabaseTest: require("./DatabaseTest"),
        IDataObjectTest: require("./IDataObjectTest"),
        IDataCollectionTest: require("./IDataCollectionTest"),
        ErrorObjTest: require("./ErrorObjTest"),
        ObservableVarTest: require("./ObservableVarTest"),
        ObserverTest: require("./ObserverTest"),
        execute: function() {
            var aTests = _.keys(this),
                iNdx;
            for (iNdx = 0; iNdx < aTests.length; ++iNdx) {
                if (this[aTests[iNdx]].execute) {
                    this[aTests[iNdx]].execute();
                }
            }
        }
    };
    return CoreTests;
});
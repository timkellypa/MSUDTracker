define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var _ = require("underscore"),
        DataTests;
    /**
     * @namespace Runner for tests in "Data" directory
     * @memberof Test
     */
    DataTests = {
        FoodCollectionTest: require("./FoodCollectionTest"),
        FoodTest: require("./FoodTest"),
        FoodDiaryEntryCollectionTest: require("./FoodDiaryEntryCollectionTest"),
        FoodDiaryEntryTest: require("./FoodDiaryEntryTest"),
        PersonalInfoTest: require("./PersonalInfoTest"),
        PersonalInfoCollectionTest: require("./PersonalInfoCollectionTest"),
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
    return DataTests;
});
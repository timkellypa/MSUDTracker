define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals describe, it, before, setTimeout */
define(function (require) {
    "use strict";
    var FoodDiaryEntryTest;

    /**
     * Food tests
     * @namespace
     * @memberof Test.Core
     */
    FoodDiaryEntryTest = {
        execute: function () {
            var assert = require("assert"),
                _ = require("underscore"),
                Database = require("../../Core/Database"),
                FoodDiaryEntryCollection = require("../../Data/FoodDiaryEntryCollection"),
                FoodDiaryEntry = require("../../Data/FoodDiaryEntry"),
                IDataObjectTest = require("../Core/IDataObjectTest"),
                isInitialized = false,
                testObj = {
                    id: 1,
                    foodID: 2,
                    enteredTime: 1437017402236,
                    eatenTime: 1420088400000,
                    mealID: 1,
                    servings: 3
                },
                db = new Database("mocha_test__foodDiaryEntryTest"),
                foodDiaryEntry = new FoodDiaryEntry(testObj);

            db.registerDataCollection(new FoodDiaryEntryCollection());

            describe('Data.FoodDiaryEntry', function () {
                describe('#constructor', function () {
                    it("can be constructed", function (done) {

                        assert.equal(foodDiaryEntry instanceof FoodDiaryEntry, true);
                        assert.equal(_.isMatch(foodDiaryEntry, testObj), true);

                        db.init(
                        ).then(
                            function () {
                                assert.equal(true, true);
                                isInitialized = true;
                                done();
                            }
                        ).catch(
                            function (e) {
                                assert.equal("Error in database initialization caught: " + e.toString(), false);
                                isInitialized = true;
                                done();
                            }
                        );
                    });
                });
                describe("IDataObject base tests", function() {
                    before(function (done) {
                        var testFn;
                        testFn = function () {
                            if (isInitialized) {
                                done();
                            }
                            else {
                                setTimeout(testFn, 1000);
                            }
                        };
                        testFn();
                    });

                    IDataObjectTest.execute(foodDiaryEntry, null);
                });
            });
        }
    };
    return FoodDiaryEntryTest;
});
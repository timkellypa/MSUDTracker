define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals describe, it, before, setTimeout */
define(function (require) {
    "use strict";
    var FoodTest;

    /**
     * Food tests
     * @namespace
     * @memberof Test.Core
     */
    FoodTest = {
        execute: function () {
            var assert = require("assert"),
                FoodCollection = require("../../Data/FoodCollection"),
                Database = require("../../Core/Database"),
                IDataCollectionTest = require("../Core/IDataCollectionTest"),
                foodCollection,
                initData,
                isInitialized = false,
                db = new Database("_mochaTest_FoodCollection");

            foodCollection = new FoodCollection(db);

            initData = [
                {
                    description: "Test one",
                    energyKCal: 5,
                    id: 1,
                    isCustom: true,
                    leucineMg: 6,
                    serving: 2,
                    unit: "g",
                    weight: 6
                },
                {
                    description: "Test two",
                    energyKCal: 7,
                    id: 2,
                    isCustom: true,
                    leucineMg: 7,
                    serving: 3,
                    unit: "mg",
                    weight: 4
                },
                {
                    description: "Test three",
                    energyKCal: 8,
                    id: 3,
                    isCustom: true,
                    leucineMg: 8,
                    serving: 4,
                    unit: "oz",
                    weight: 5
                }
            ];

            describe("Data.FoodCollection", function () {
                describe('#constructor', function () {
                    it("Can be constructed", function (done) {

                        // run tests for base object (DataObject)
                        db.init().
                            then(
                            function () {
                                assert.equal(true, true);
                                isInitialized = true;
                                done();
                            }).
                            catch(
                            function (e) {
                                assert.equal("Error in database initialization caught: " + e.toString(), false);
                                isInitialized = true;
                                done();
                            });
                    });
                });

                describe('IDataCollection base tests', function () {
                    before(function (done) {
                        var fnTest;
                        fnTest = function () {
                            if (isInitialized) {
                                done();
                            }
                            else {
                                setTimeout(fnTest, 1000);
                            }
                        };
                        fnTest();
                    });

                    IDataCollectionTest.execute(foodCollection, initData);
                });
            });
        }
    };
    return FoodTest;
});
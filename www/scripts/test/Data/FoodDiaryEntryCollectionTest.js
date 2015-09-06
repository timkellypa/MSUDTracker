define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals describe, it, after, before, setTimeout */
define(function (require) {
    "use strict";
    var FoodDiaryEntryCollectionTest;

    /**
     * Food tests
     * @namespace
     * @memberof Test.Core
     */
    FoodDiaryEntryCollectionTest = {
        execute: function () {
            var assert = require("assert"),
                FoodDiaryEntryCollection = require("../../Data/FoodDiaryEntryCollection"),
                FoodCollection = require("../../Data/FoodCollection"),
                Database = require("../../Core/Database"),
                IDataCollectionTest = require("../Core/IDataCollectionTest"),
                Utils = require("../../Lib/Local/Utils"),
                db,
                _ = require("underscore"),
                foodDiaryEntryCollection,
                foodCollection,
                isInitialized = false,
                baseTestsRun = false,
                initData,
                foodInitData;

            db = new Database("_mochaTest_FoodDiaryEntryCollection");
            foodDiaryEntryCollection = new FoodDiaryEntryCollection(db);
            foodCollection = new FoodCollection(db);

            initData = [
                {
                    id: 1,
                    foodID: 2,
                    enteredTime: 1437017402236,
                    eatenTime: 1420088400000,
                    mealID: 1,
                    servings: 3
                },
                {
                    id: 2,
                    foodID: 3,
                    enteredTime: 1435204800000,
                    eatenTime: 1435723200000,
                    mealID: 2,
                    servings: 2
                },
                {
                    id: 3,
                    foodID: 1,
                    enteredTime: 1436068800000,
                    eatenTime: 1436155200000,
                    mealID: 3,
                    servings: 1
                },
                {
                    id: 4,
                    foodID: 4,
                    enteredTime: 1436068800000,
                    eatenTime: 1436155200000,
                    mealID: 2,
                    servings: 1
                }

            ];

            foodInitData = [
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
                    energyKCal: 10,
                    id: 2,
                    isCustom: true,
                    leucineMg: 12,
                    serving: 4,
                    unit: "g2",
                    weight: 12
                },
                {
                    description: "Test three",
                    energyKCal: 15,
                    id: 3,
                    isCustom: true,
                    leucineMg: 18,
                    serving: 6,
                    unit: "g3",
                    weight: 18
                },
                {
                    description: "Test four",
                    energyKCal: 20,
                    id: 4,
                    isCustom: true,
                    leucineMg: 24,
                    serving: 8,
                    unit: "g4",
                    weight: 24
                }
            ];

            foodCollection.setInitialData(foodInitData);

            describe('Data.FoodDiaryEntryCollection', function () {

                describe('#constructor', function () {
                    it("Can be constructed", function (done) {

                        // run tests for base object (DataObject)
                        db.init()
                            .then(
                            function () {
                                assert.equal(true, true);
                                isInitialized = true;
                                done();
                            })
                            .catch(
                            function (e) {
                                assert.equal("Error in database initialization caught: " + e.toString(), false);
                                isInitialized = true;
                                done();
                            });
                    });
                });

                // Run base tests.
                describe("IDataCollection base tests", function () {
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

                    IDataCollectionTest.execute(foodDiaryEntryCollection, initData)
                        .then(
                        function () {
                            baseTestsRun = true;
                        },
                        function () {
                            baseTestsRun = true;
                        }
                    );
                });

                describe("Instance Tests", function () {
                    before(function (done) {
                        var testFn;
                        testFn = function () {
                            if (baseTestsRun) {
                                done();
                            }
                            else {
                                setTimeout(testFn, 1000);
                            }
                        };
                        testFn();
                    });
                    describe('#selectFoodDiaryEntriesForDay', function () {
                        it("Finds a food diary entry that occurred on a particular day", function (done) {
                            var curFoodDiaryEntry,
                                foodDiaryNdx,
                                dayConsumed;

                            // Get one of our food diary entries at random (adds a bit of non-determinism)
                            foodDiaryNdx = parseInt(Math.random() * initData.length, 10);
                            curFoodDiaryEntry = initData[foodDiaryNdx];

                            dayConsumed = Utils.getEpochDayFromTime(curFoodDiaryEntry.eatenTime);

                            foodDiaryEntryCollection.selectFoodDiaryEntriesForDay(dayConsumed)
                                .then(
                                function (vals) {
                                    var iNdx,
                                        match = null;
                                    // Verify that the current one is in there
                                    for (iNdx = 0; iNdx < vals.length; ++iNdx) {
                                        if (vals[iNdx].id === curFoodDiaryEntry.id) {
                                            match = vals[iNdx];
                                            break;
                                        }
                                    }

                                    if (match === null) {
                                        assert.equal("Test failed.  Match is null.", false);
                                    }
                                    else {
                                        assert.equal(_.isMatch(match, curFoodDiaryEntry), true);
                                    }
                                    done();
                                },
                                function (e) {
                                    assert.equal("promise was rejected: " + e.toString(), false);
                                }
                            );
                        });
                    });
                });
            });
        }
    };
    return FoodDiaryEntryCollectionTest;
});
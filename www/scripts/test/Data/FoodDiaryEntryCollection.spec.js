/*globals describe, it, after, before, setTimeout, assert, beforeEach, afterEach */
define(function (require) {
    "use strict";
    var
        FoodDiaryEntryCollection = require("Data/FoodDiaryEntryCollection"),
        FoodCollection = require("Data/FoodCollection"),
        Database = require("Core/Data/Database"),
        IDataCollectionTest = require("test/Core/Data/IDataCollectionTest.base"),
        Utils = require("Lib/Local/Utils"),
        db,
        foodDiaryEntryCollection,
        foodCollection,
        initData,
        foodInitData;

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
            isCustom: 1,
            leucineMg: 6,
            serving: 2,
            unit: "g",
            weight: 6
        },
        {
            description: "Test two",
            energyKCal: 10,
            id: 2,
            isCustom: 1,
            leucineMg: 12,
            serving: 4,
            unit: "g2",
            weight: 12
        },
        {

            description: "Test three",
            energyKCal: 15,
            id: 3,
            isCustom: 1,
            leucineMg: 18,
            serving: 6,
            unit: "g3",
            weight: 18
        },
        {
            description: "Test four",
            energyKCal: 20,
            id: 4,
            isCustom: 1,
            leucineMg: 24,
            serving: 8,
            unit: "g4",
            weight: 24
        }
    ];


    describe('Data.FoodDiaryEntryCollection', function () {
        describe("Instance Tests", function () {
            beforeEach("Create database", function () {
                db = new Database("_mochaTest_FoodDiaryEntryCollection");
                foodDiaryEntryCollection = new FoodDiaryEntryCollection(db);
                foodCollection = new FoodCollection(db);
                foodCollection.setInitialData(foodInitData);
                foodDiaryEntryCollection.setInitialData(initData);
            });

            afterEach("Drop database", function (done) {
                db.drop().then(done);
            });

            describe('#constructor', function () {
                it("Can be constructed", function (done) {
                    db.init()
                        .then(
                        function () {
                            assert.equal(true, true);
                            done();
                        })
                        .catch(
                        function (e) {
                            assert.equal("Error in database initialization caught: " + e.toString(), false);
                            done();
                        });
                });
            });

            describe('#selectFoodDiaryEntriesForDay', function () {
                it("Finds a food diary entry that occurred on a particular day", function (done) {
                    var curFoodDiaryEntry,
                        foodDiaryNdx,
                        dayConsumed;

                    db.init().then(
                        function () {
                            // Get one of our food diary entries at random (adds a bit of non-determinism)
                            foodDiaryNdx = parseInt(Math.random() * initData.length, 10);
                            curFoodDiaryEntry = initData[foodDiaryNdx];

                            dayConsumed = Utils.getEpochDayFromTime(curFoodDiaryEntry.eatenTime);

                            foodDiaryEntryCollection.selectFoodDiaryEntriesForDay(
                                dayConsumed
                            ).then(
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
                                        assert.fail("Test failed.  Match is null.");
                                    }
                                    else {
                                        assert.deepEqual(match.getPropertyObject(), curFoodDiaryEntry);
                                    }
                                    done();
                                },
                                function (e) {
                                    assert.fail("promise was rejected: " + e.toString());
                                }
                            );
                        },
                        function (e) {
                            assert.fail("An error occurred initializing the database: " + e.toString());
                        }
                    );
                });
            });
        });

        // Run base tests.
        describe("IDataCollection base tests", function () {
            (new IDataCollectionTest()).execute(FoodDiaryEntryCollection, initData);
        });
    });
});

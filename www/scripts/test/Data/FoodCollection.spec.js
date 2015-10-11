/*globals describe, it, before, setTimeout, assert, beforeEach, afterEach */
define(function (require) {
    "use strict";
    var FoodCollection = require("Data/FoodCollection"),
        Database = require("Core/Data/Database"),
        IDataCollectionTest = require("test/Core/Data/IDataCollectionTest.base"),
        foodCollection,
        initData,
        db;

    initData = [
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
            energyKCal: 7,
            id: 2,
            isCustom: 1,
            leucineMg: 7,
            serving: 3,
            unit: "mg",
            weight: 4
        },
        {
            description: "Test three",
            energyKCal: 8,
            id: 3,
            isCustom: 1,
            leucineMg: 8,
            serving: 4,
            unit: "oz",
            weight: 5
        }
    ];

    describe("Data.FoodCollection", function () {
        describe("Instance tests", function () {

            beforeEach("set up database and collection", function () {
                db = new Database("_mochaTest_FoodCollection");
                foodCollection = new FoodCollection(db);
                foodCollection.setInitialData(initData);
            });

            afterEach("drop database", function (done) {
                db.drop().then(done);
            });

            describe('#constructor', function () {
                it("Can be constructed", function (done) {
                    db.init().
                        then(
                        function () {
                            assert.equal(true, true);
                            done();
                        }).
                        catch(
                        function (e) {
                            assert.fail("Error in database initialization caught: " + e.toString());
                            done();
                        });
                });
            });
        });

        describe('IDataCollection base tests', function () {
            (new IDataCollectionTest()).execute(FoodCollection, initData);
        });
    });
});
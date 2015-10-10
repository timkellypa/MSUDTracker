/*globals describe, it, before, setTimeout, assert, after, beforeEach, afterEach */
define(function (require) {
    "use strict";
    var AppDatabase = require("Data/AppDatabase"),
        FoodCollection = require("Data/FoodCollection"),
        FoodDataEntryCollection = require("Data/FoodDiaryEntryCollection"),
        PersonalInfoCollection = require("Data/PersonalInfoCollection"),
        Database = require('Core/Database'),
        db,
        testFoodData = [
            {
                "id": 1,
                "description": "Turkey, retail parts, breast, meat only, cooked, roasted",
                "weight": "863",
                "serving": "1.0",
                "unit": "breast",
                "leucineMg": "21074",
                "energyKCal": "1174",
                "isCustom": 0
            }
            ,
            {
                "id": 2,
                "description": "Turkey, retail parts, enhanced, breast, meat only, raw",
                "weight": "1171",
                "serving": "1.0",
                "unit": "breast",
                "leucineMg": "20820",
                "energyKCal": "1300",
                "isCustom": 0
            }
            ,
            {
                "id": 3,
                "description": "Egg, white, dried, stabilized, glucose reduced",
                "weight": "107",
                "serving": "1.0",
                "unit": "cup, sifted",
                "leucineMg": "7925",
                "energyKCal": "387",
                "isCustom": 0
            }
        ],
        testFoodDiaryEntryData = [
            {
                "id": 1,
                "foodID": 3,
                "enteredTime": 1439666010822,
                "eatenTime": 1439666010822,
                "servings": 2,
                "mealID": 1
            }
        ],
        testPersonalInfoData = [
            {
                "id": 1,
                "leucineAllowance": 20000,
                "calorieGoal": 2000
            }
        ];

    describe("Data.AppDatabase", function () {
        after("Drop database", function (done) {
            db.drop().then(done);
        });

        beforeEach("Initialize new AppDatabase", function (done) {
            db = new AppDatabase("mochaTest_AppDatabase",
                                 testFoodData,
                                 testFoodDiaryEntryData,
                                 testPersonalInfoData);

            db.init().then(done);
        });

        afterEach("Drop old AppDatabase", function (done) {
            db.drop().then(done);
        });

        describe('#constructor', function () {
            it("Can be constructed", function () {
                db = new AppDatabase("mochaTest_AppDatabase",
                                     testFoodData,
                                     testFoodDiaryEntryData,
                                     testPersonalInfoData);

                assert.equal(db instanceof Database, true);
                assert.equal(db instanceof AppDatabase, true);
            });

            it("sets the initial data of our data collections", function (done) {
                var coll;
                this.timeout(5000);
                coll = new FoodCollection(db);

                coll.getItemById(1
                ).then(
                    function (res) {
                        assert.deepEqual(res.getPropertyObject(), testFoodData[0]);

                        coll = new FoodDataEntryCollection(db);
                        return coll.getItemById(1);
                    }
                ).then(
                    function (res) {
                        assert.deepEqual(res.getPropertyObject(), testFoodDiaryEntryData[0]);

                        coll = new PersonalInfoCollection(db);
                        return coll.getItemById(1);
                    }
                ).then(
                    function (res) {
                        assert.deepEqual(res.getPropertyObject(), testPersonalInfoData[0]);
                        done();
                    }
                );
            });
        });
    });
});

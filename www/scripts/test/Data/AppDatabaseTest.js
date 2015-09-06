define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals describe, it, before, setTimeout */
define(function (require) {
    "use strict";
    var AppDatabaseTest;

    /**
     * AppDatabase tests.  Tests AppDatabase, which is an extension of Database that shortcuts things for this app.
     * @namespace
     * @memberof Test.Data
     */
    AppDatabaseTest = {
        execute: function () {
            var assert = require("assert"),
                AppDatabase = require("../../Data/AppDatabase"),
                FoodCollection = require("../../Data/FoodCollection"),
                FoodDataEntryCollection = require("../../Data/FoodDiaryEntryCollection"),
                PersonalInfoCollection = require("../../Data/PersonalInfoCollection"),
                Database = require('../../Core/Database'),
                _ = require("underscore"),
                db,
                testFoodData = [
                    {
                        "id": "1",
                        "description": "Turkey, retail parts, breast, meat only, cooked, roasted",
                        "weight": "863",
                        "serving": "1.0",
                        "unit": "breast",
                        "leucineMg": "21074",
                        "energyKCal": "1174"
                    }
                    ,
                    {
                        "id": "2",
                        "description": "Turkey, retail parts, enhanced, breast, meat only, raw",
                        "weight": "1171",
                        "serving": "1.0",
                        "unit": "breast",
                        "leucineMg": "20820",
                        "energyKCal": "1300"
                    }
                    ,
                    {
                        "id": "3",
                        "description": "Egg, white, dried, stabilized, glucose reduced",
                        "weight": "107",
                        "serving": "1.0",
                        "unit": "cup, sifted",
                        "leucineMg": "7925",
                        "energyKCal": "387"
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
                        db.init()
                            .then(
                            function () {
                                coll = new FoodCollection(db);
                                return coll.getItemById(1);
                            }
                        ).then(
                            function (res) {
                                assert.equal(_.isMatch(res, testFoodData[0]), true);

                                coll = new FoodDataEntryCollection(db);
                                return coll.getItemById(1);
                            }
                        ).then(
                            function (res) {
                                assert.equal(_.isMatch(res, testFoodDiaryEntryData[0]), true);

                                coll = new PersonalInfoCollection(db);
                                return coll.getItemById(1);
                            }
                        ).then(
                            function (res) {
                                assert.equal(_.isMatch(res, testPersonalInfoData[0]), true);
                                done();
                            }
                        );
                    });
                });
            });
        }
    };
    return AppDatabaseTest;
});
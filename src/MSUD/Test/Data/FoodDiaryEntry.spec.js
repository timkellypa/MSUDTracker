/*globals describe, it, before, setTimeout, assert, beforeEach */
define(function (require) {
    "use strict";

    var FoodDiaryEntry = require("../../Data/FoodDiaryEntry"),
        IDataObjectTest = require("../../../Core/Test/Data/IDataObjectTest.base"),
        testObj,
        foodDiaryEntry;


    describe('Data.FoodDiaryEntry', function () {
        describe("Instance tests", function () {
            beforeEach(function () {
                testObj = {
                    id: 1,
                    foodID: 2,
                    enteredTime: 1437017402236,
                    eatenTime: 1420088400000,
                    mealID: 1,
                    servings: 3
                };
                foodDiaryEntry = new FoodDiaryEntry(testObj);
            });

            describe('#constructor', function () {
                it("creates an object of the correct type", function () {
                    assert.equal(foodDiaryEntry instanceof FoodDiaryEntry, true);
                });
            });
        });
        describe("IDataObject base tests", function () {
            (new IDataObjectTest()).execute(foodDiaryEntry, testObj, null);
        });
    });
});
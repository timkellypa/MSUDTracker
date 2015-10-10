/*globals describe, it, before, setTimeout, assert, beforeEach */
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
            var Food = require("Data/Food"),
                IDataObjectTest = require("test/Core/IDataObjectTest.base"),
                testObj,
                food;

            describe('Data.Food', function () {
                describe("Instance tests", function () {
                    beforeEach("Create food object", function () {
                        testObj = {
                            description: "Test one",
                            energyKCal: 5,
                            id: 1,
                            isCustom: true,
                            leucineMg: 6,
                            serving: 2,
                            unit: "g",
                            weight: 6
                        };
                        food = new Food(testObj);
                    });
                    describe('#constructor', function () {
                        it("creates an object of the correct type", function () {
                            assert.equal(food instanceof Food, true);
                        });
                    });
                });
                describe("IDataObject base tests", function () {
                    (new IDataObjectTest()).execute(Food, testObj);
                });
            });
        }
    };
    return FoodTest;
});
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
                _ = require("underscore"),
                Database = require("../../Core/Database"),
                FoodCollection = require("../../Data/FoodCollection"),
                Food = require("../../Data/Food"),
                IDataObjectTest = require("../Core/IDataObjectTest"),
                isInitialized = false,
                testObj = {
                    description: "Test one",
                    energyKCal: 5,
                    id: 1,
                    isCustom: true,
                    leucineMg: 6,
                    serving: 2,
                    unit: "g",
                    weight: 6
                },
                db = new Database("mocha_test__food"),
                collection = new FoodCollection(db),
                food = new Food(testObj, collection);

            describe('Data.Food', function () {
                describe('#constructor', function () {
                    it("can be constructed", function (done) {

                        assert.equal(food instanceof Food, true);
                        assert.equal(_.isMatch(food, testObj), true);

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

                    IDataObjectTest.execute(food, null);
                });
            });
        }
    };
    return FoodTest;
});
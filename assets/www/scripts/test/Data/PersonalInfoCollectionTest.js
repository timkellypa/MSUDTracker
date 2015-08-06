define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals describe, it, before, setTimeout */
define(function (require) {
    "use strict";
    var PersonalInfoCollectionTest;

    /**
     * Personal Info Collection tests
     * @namespace
     * @memberof Test.Core
     */
    PersonalInfoCollectionTest = {
        execute: function () {
            var assert = require("assert"),
                PersonalInfoCollection = require("../../Data/PersonalInfoCollection"),
                Database = require("../../Core/Database"),
                IDataCollectionTest = require("../Core/IDataCollectionTest"),
                personalInfoCollection,
                initData,
                isInitialized = false,
                db = new Database("_mochaTest_PersonalInfoCollection");

            personalInfoCollection = new PersonalInfoCollection(db);

            initData = [
                {
                    id: 1,
                    leucineAllowance: 3600,
                    calorieGoal: 2000
                }
            ];

            describe("Data.PersonalInfoCollection", function () {
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

                    IDataCollectionTest.execute(personalInfoCollection, initData);
                });
            });
        }
    };
    return PersonalInfoCollectionTest;
});
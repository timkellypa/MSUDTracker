define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals describe, it, before, setTimeout */
define(function (require) {
    "use strict";
    var PersonalInfoTest;

    /**
     * PersonalInfoTest tests
     * @namespace
     * @memberof Test.Core
     */
    PersonalInfoTest = {
        execute: function () {
            var assert = require("assert"),
                _ = require("underscore"),
                Database = require("../../Core/Database"),
                PersonalInfoCollection = require("../../Data/PersonalInfoCollection"),
                PersonalInfo = require("../../Data/PersonalInfo"),
                IDataObjectTest = require("../Core/IDataObjectTest"),
                isInitialized = false,
                testObj = {
                    id: 1,
                    leucineAllowance: 6500,
                    calorieGoal: 2000
                },
                db = new Database("mocha_test__personalInfo"),
                personalInfo = new PersonalInfo(testObj);

            db.registerDataCollection(new PersonalInfoCollection());

            describe('Data.PersonalInfo', function () {
                describe('#constructor', function () {
                    it("can be constructed", function (done) {

                        assert.equal(personalInfo instanceof PersonalInfo, true);
                        assert.equal(_.isMatch(personalInfo, testObj), true);

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

                    IDataObjectTest.execute(personalInfo, null);
                });
            });
        }
    };
    return PersonalInfoTest;
});
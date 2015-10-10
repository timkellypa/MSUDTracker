/*globals describe, it, before, setTimeout, assert, beforeEach */
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
            var PersonalInfo = require("Data/PersonalInfo"),
                IDataObjectTest = require("test/Core/IDataObjectTest.base"),
                testObj,
                personalInfo;

            describe('Data.PersonalInfo', function () {
                describe("Instance tests", function () {
                    beforeEach("Create personalInfo object", function () {
                        testObj = {
                            id: 1,
                            leucineAllowance: 6500,
                            calorieGoal: 2000
                        };
                        personalInfo = new PersonalInfo(testObj);
                    });

                    describe('#constructor', function () {
                        it("creates an object of the correct type", function () {
                            assert.equal(personalInfo instanceof PersonalInfo, true);
                        });
                    });
                });
                describe("IDataObject base tests", function () {
                    (new IDataObjectTest()).execute(PersonalInfo, testObj);
                });
            });
        }
    };
    return PersonalInfoTest;
});
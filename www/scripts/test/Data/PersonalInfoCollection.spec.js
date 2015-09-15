/*globals describe, it, before, setTimeout, assert, beforeEach, afterEach */
define(function (require) {
    "use strict";
    var PersonalInfoCollection = require("Data/PersonalInfoCollection"),
        Database = require("Core/Database"),
        IDataCollectionTest = require("test/Core/IDataCollectionTest.base"),
        personalInfoCollection,
        initData,
        db;

    initData = [
        {
            id: 1,
            leucineAllowance: 3600,
            calorieGoal: 2000
        }
    ];

    describe("Data.PersonalInfoCollection", function () {
        describe("Instance tests", function () {

            beforeEach("Initialize database", function () {
                db = new Database("_mochaTest_PersonalInfoCollection");
                personalInfoCollection = new PersonalInfoCollection(db);
                personalInfoCollection.setInitialData(initData);
            });

            afterEach("Drop database", function (done) {
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
                            assert.equal("Error in database initialization caught: " + e.toString(), false);
                            done();
                        });
                });
            });
        });

        describe('IDataCollection base tests', function () {
            IDataCollectionTest.execute(PersonalInfoCollection, initData);
        });
    });
});
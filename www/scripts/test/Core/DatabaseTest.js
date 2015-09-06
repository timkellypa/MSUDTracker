define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*global describe, it */
define(function (require) {
    "use strict";
    var DatabaseTest,
        dbName = "__mocha_database_test";

    /**
     * @namespace
     * Callback Tests
     * @memberof Test.Core
     */
    DatabaseTest = {
        execute: function () {
            var assert = require("assert"),
                Database = require("Core/Database"),
                FoodCollection = require("../../Data/FoodCollection"),
                PersonalInfoCollection = require("Data/PersonalInfoCollection");

            describe('Core.Database', function () {
                var db = new Database(dbName),
                    foodCollection = new FoodCollection(db),
                    personalInfo = new PersonalInfoCollection(db);
                describe('dbVersion', function () {
                    it('is correct', function () {
                        var version = Math.max(foodCollection.getDbVersion(), personalInfo.getDbVersion());
                        assert.equal(db.dbVersion, version);
                    });
                });
                describe('dbName', function () {
                    it('is correct', function () {
                        assert.equal(db.dbName, dbName);
                    });
                });
                describe('init()', function () {
                    it('fires success()', function (done) {
                        db.init()
                            .then(
                            function () {
                                assert.equal(true, true);
                                done();
                            })
                            .catch(
                            function (e) {
                                // Fail if error fires
                                assert.equal("Error during database initialization: " + e.toString(), true);
                                done();
                            }
                        );
                    });
                });
                describe('indexedDB', function () {
                    it('is not null after init()', function () {
                        assert.equal(db.indexedDB !== null, true);
                    });
                });
            });
        }
    };
    return DatabaseTest;
});
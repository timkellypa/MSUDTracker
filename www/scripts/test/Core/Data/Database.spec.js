/*global describe, it, assert, beforeEach, afterEach, window */
define(function (require) {
    "use strict";
    var // assert = require("assert"),
        Database = require("Core/Data/Database"),
        dbName = "_mocha_database_test",
        FoodCollection = require("Data/FoodCollection"),
        Utils = require("Lib/Local/Utils"),
        PersonalInfoCollection = require("Data/PersonalInfoCollection"),
        db,
        foodCollection,
        autoInit = false,
        personalInfo;

    describe('Core.Database', function () {

        beforeEach("drop and re-setup Database", function (done) {
            db = new Database(dbName);
            foodCollection = new FoodCollection(db);
            personalInfo = new PersonalInfoCollection(db);
            (autoInit ? db.init() : Utils.getPromiseLib().resolve()
            ).then(done);
        });

        afterEach("drop database for next time", function (done) {
            db.drop().then(done);
        });

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

        describe('#init()', function () {
            it('fires success()', function (done) {
                db.init(
                ).then(
                    function () {
                        assert.equal(true, true);
                        done();
                    }
                ).catch(
                    function (e) {
                        // Fail if error fires
                        assert.equal("Error during database initialization: " + e.toString(), true);
                        done();
                    }
                );
            });
        });

        describe('indexedDB', function () {
            it('is not null after init()', function (done) {
                db.init(
                ).then(
                    function () {
                        assert.equal(db.indexedDB !== null, true);
                        done();
                    }
                );
            });
        });

        describe('drop', function () {
            it('drops the underlying database', function (done) {
                db.init(
                ).then(
                    function () {
                        return db.drop();
                    }
                ).then(
                    function () {
                        var request = window.indexedDB.open(dbName),
                            upgraded = false;
                        request.onupgradeneeded = function (e) {
                            // If upgrade needed, database drop must have been successful
                            e.target.transaction.abort();
                            upgraded = true;
                            done();
                        };
                        request.onsuccess = function () {
                            if (!upgraded) {
                                assert.fail("Database did not require upgrade.  Drop must have been unsuccessful");
                            }
                        };
                    },
                    function (e) {
                        assert.fail("Database failed to drop, for reason: " + e.toString());
                        done();
                    }
                );
            });
        });
    });
});
/**
 * @typedef Test.Core.IDataCollectionTest
 * @name Test.Core.IDataCollectionTest
 */

define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals describe, it, after */
define(function (require) {
    "use strict";
    var IDataCollectionTest,
        IDataCollection = require("../../Core/IDataCollection"),
        IDataObject = require("../../Core/IDataObject"),
        Utils = require("../../Lib/Local/Utils"),
        Database = require("../../Core/Database"),
        _ = require("underscore");

    /**
     * DataObject Tests
     * @namespace
     * @memberof Test.Core
     */
    IDataCollectionTest = {
        /**
         * Execute tests
         * @param {function(new:window.Core.DataObject)} Obj inherited class, on which to run tests on core
         * <br /><br /><b>Assumes:</b> database is already initialized.
         * @param {Array.<Object>} testData Test data, to be initialized for this collection
         */
        execute: function (Obj, testData) {
            var assert = require("assert"),
                deferred = Utils.getPromiseLib().defer(); // Deferred.  Normal promise wrapper interferes w/ tests

            after(function() {
               deferred.resolve();
            });

            describe('Core.IDataCollection', function() {
                if (!Obj) {
                    it("should be tested with fully inherited object as a parameter", function () {
                        assert.equal(true, true);
                    });
                }
                else {
                    describe('Object to be tested', function () {
                        it("Is an IDataCollection", function () {
                            assert.equal(Obj instanceof IDataCollection, true);
                        });
                    });
                    describe("#getDataObjectClass()", function () {
                        it("returns an IDataObject", function () {
                            assert.equal(new (Obj.getDataObjectClass())() instanceof IDataObject, true);
                        });
                    });
                    describe("#getStoreName()", function () {
                        it("returns a string", function () {
                            assert.equal(typeof Obj.getStoreName(), "string");
                        });
                    });
                    describe("#getDbVersion()", function () {
                        it("returns a number", function () {
                            assert.equal(typeof Obj.getDbVersion(), "number");
                        });
                    });
                    describe("#createStore()", function () {
                        it("is implicitly tested by successful database creation", function () {
                            assert.equal(true, true);
                        });
                    });
                    describe("#getDatabase()", function () {
                        it("returns database object", function () {
                            assert.equal(Obj.getDatabase() instanceof Database, true);
                        });
                    });

                    describe("#setInitialData()", function () {
                        it("sets initial data", function () {
                            Obj.setInitialData(testData);
                            assert.equal(Obj._initialData.length, testData.length);
                        });
                    });
                    describe("#loadInitialData()", function () {
                        it("loads initial data", function (done) {
                            Obj.loadInitialData()
                                .then(
                                function () {
                                    var db = Obj.getDatabase().indexedDB,
                                        tran,
                                        store,
                                        valueCount;

                                    valueCount = testData.length;
                                    tran = db.transaction([Obj.getStoreName()], "readonly");
                                    store = tran.objectStore(Obj.getStoreName());

                                    store.openCursor().onsuccess = function (event) {
                                        var cursor = event.target.result,
                                            id = cursor.value.id,
                                            iNdx,
                                            compObj = null;

                                        for (iNdx = 0; iNdx < testData.length; ++iNdx) {
                                            if (testData[iNdx].id === id) {
                                                compObj = testData[iNdx];
                                                break;
                                            }
                                        }

                                        // Allow values besides our bootstrap:
                                        if (compObj !== null) {
                                            assert.equal(_.isMatch(cursor.value, compObj), true);
                                        }

                                        // done with all our values.  Return
                                        if (--valueCount === 0) {
                                            done();
                                            return;
                                        }

                                        cursor.continue();
                                    };

                                })
                                .catch(
                                function (err) {
                                    assert.equal("Error during inital data load: " + err.toString(), null);
                                }
                            );

                        });
                    });
                    describe("#getItemById()", function () {
                        it("gets item by id", function (done) {
                            var itemNdx = parseInt(Math.random() * Obj._initialData.length, 10);
                            Obj.getItemById(
                                Obj._initialData[itemNdx].id
                            ).then(
                                function (value) {
                                    assert.equal(_.isMatch(value, Obj._initialData[itemNdx]), true);
                                    done();
                                }
                            );
                        });
                        it("returns null if item doesn't exist", function (done) {
                            var maxNdx = 0,
                                iNdx;

                            for (iNdx = 0; iNdx < Obj._initialData.length; ++iNdx) {
                                maxNdx = Math.max(Obj._initialData[iNdx].id, maxNdx);
                            }

                            Obj.getItemById(
                                maxNdx + 1
                            ).then(
                                function (value) {
                                    assert.equal(value, null);
                                    done();
                                }
                            );
                        });
                    });
                    describe("#put()", function () {
                        it("can add (implicitly tested by loadInitialData)", function () {
                            assert.equal(true, true);
                        });
                        it("can update", function (done) {
                            var itemNdx = parseInt(Math.random() * Obj._initialData.length, 10),
                                testKeyValue = "humbug",
                                testKey,
                                testValue;

                            Obj.getItemById(
                                Obj._initialData[itemNdx].id
                            ).then(
                                function (value) {
                                    var key,
                                        objKeys = _.keys(value);
                                    do {
                                        key = objKeys[parseInt(Math.random() * objKeys.length, 10)];
                                    } while (key === "id" || key === "collection");

                                    value[key] = testKeyValue;
                                    testKey = key;
                                    testValue = value;
                                    return Obj.put(value);
                                }
                            ).then(
                                function () {
                                    return Obj.getItemById(Obj._initialData[itemNdx].id);
                                }
                            ).then(
                                function (value) {
                                    assert.equal(value[testKey], testValue[testKey]);

                                    // set it back
                                    return Obj.put(Obj._initialData[itemNdx]);
                                }
                            ).then(
                                function () {
                                    return Obj.getItemById(Obj._initialData[itemNdx].id);
                                }
                            ).then(
                                function (value) {
                                    // verify setting it back worked
                                    assert.equal(value[testKey], Obj._initialData[itemNdx][testKey]);
                                    done();
                                }
                            ).catch(function (e) {
                                        assert.equal(e, null);
                                        done();
                                    });
                        });
                    });
                    describe("#delete()", function () {
                        it("removes an item", function (done) {
                            var itemNdx = parseInt(Math.random() * Obj._initialData.length, 10);
                            Obj.getItemById(
                                Obj._initialData[itemNdx].id
                            )
                                .then(
                                function (value) {
                                    return Obj.remove(value);
                                }
                            ).then(
                                function (value) {
                                    assert.equal(value.isActive, false);
                                    return Obj.getItemById(Obj._initialData[itemNdx].id);
                                }
                            ).then(
                                function (value) {
                                    assert.equal(value, null);

                                    // put value back in
                                    return Obj.put(Obj._initialData[itemNdx]);
                                }
                            ).then(
                                function () {
                                    return Obj.getItemById(Obj._initialData[itemNdx].id);
                                }
                            ).then(
                                function (value) {
                                    // Verify cleanup (item is successfully restored)
                                    assert.equal(_.isMatch(value, Obj._initialData[itemNdx]), true);
                                    done();
                                }
                            );
                        });
                    });
                }
            });
            return deferred.promise;
        }
    };
    return IDataCollectionTest;
});
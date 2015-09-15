/*globals describe, it, after, assert, beforeEach, afterEach */
define(function (require) {
    "use strict";
    var IDataCollectionTest,
        IDataCollection = require("Core/IDataCollection"),
        IDataObject = require("Core/IDataObject"),
        Utils = require("Lib/Local/Utils"),
        Database = require("Core/Database"),
        _ = require("underscore");

    /**
     * DataObject Tests
     * @namespace
     * @memberof Test.Core
     */
    IDataCollectionTest = {
        /**
         * Execute tests
         * @param {function(new:window.Core.IDataCollection)} Obj inherited class, on which to run tests on core
         * @param {Array.<Object>} testData Test data, to be initialized for this collection
         */
        execute: function (Obj, testData) {
            var deferred = Utils.getPromiseLib().defer(), // Deferred.  Normal promise wrapper interferes w/ tests
                dataCollection,
                dbName = "_mochaTest_BaseCollection",
                db;

            beforeEach("set up database and collection", function (done) {
                db = new Database(dbName);
                dataCollection = new Obj(db);
                db.init().then(done);
            });

            afterEach("drop database", function (done) {
                db.drop().then(done);
            });

            after(function () {
                deferred.resolve();
            });

            describe('Core.IDataCollection', function () {
                describe('Object to be tested', function () {
                    it("Is an IDataCollection", function () {
                        assert.equal(dataCollection instanceof IDataCollection, true);
                    });
                });
                describe("#getDataObjectClass()", function () {
                    it("returns an IDataObject", function () {
                        assert.equal(new (dataCollection.getDataObjectClass())() instanceof IDataObject, true);
                    });
                });
                describe("#getStoreName()", function () {
                    it("returns a string", function () {
                        assert.equal(typeof dataCollection.getStoreName(), "string");
                    });
                });
                describe("#getDbVersion()", function () {
                    it("returns a number", function () {
                        assert.equal(typeof dataCollection.getDbVersion(), "number");
                    });
                });
                describe("#createStore()", function () {
                    it("is implicitly tested by successful database creation", function () {
                        assert.equal(true, true);
                    });
                });
                describe("#getDatabase()", function () {
                    it("returns database object", function () {
                        assert.equal(dataCollection.getDatabase() instanceof Database, true);
                    });
                });

                describe("#setInitialData()", function () {
                    it("sets initial data", function () {
                        dataCollection.setInitialData(testData);
                        assert.equal(dataCollection._initialData.length, testData.length);
                    });
                });
                describe("#loadInitialData()", function () {
                    it("loads initial data", function (done) {
                        dataCollection.setInitialData(testData);
                        dataCollection.loadInitialData()
                            .then(
                            function () {
                                var curDB = dataCollection.getDatabase().indexedDB,
                                    tran,
                                    store,
                                    valueCount;

                                valueCount = testData.length;
                                tran = curDB.transaction([dataCollection.getStoreName()], "readonly");
                                store = tran.objectStore(dataCollection.getStoreName());

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
                                        assert.deepEqual(cursor.value, compObj);
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
                describe("Tests with data initialized", function () {
                    beforeEach("load initial data", function (done) {
                        this.timeout(5000);
                        dataCollection.setInitialData(testData);
                        dataCollection.loadInitialData().then(done);
                    });

                    describe("#getItemById()", function () {
                        it("gets item by id", function (done) {
                            var itemNdx = parseInt(Math.random() * dataCollection._initialData.length, 10);
                            dataCollection.getItemById(
                                dataCollection._initialData[itemNdx].id
                            ).then(
                                function (value) {
                                    assert.deepEqual(value.getPropertyObject(), dataCollection._initialData[itemNdx]);
                                    done();
                                }
                            );
                        });
                        it("returns null if item doesn't exist", function (done) {
                            var maxNdx = 0,
                                iNdx;

                            for (iNdx = 0; iNdx < dataCollection._initialData.length; ++iNdx) {
                                maxNdx = Math.max(dataCollection._initialData[iNdx].id, maxNdx);
                            }

                            dataCollection.getItemById(
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
                            var itemNdx = parseInt(Math.random() * dataCollection._initialData.length, 10),
                                testKeyValue = "humbug",
                                testKey,
                                testValue;

                            dataCollection.getItemById(
                                dataCollection._initialData[itemNdx].id
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
                                    return dataCollection.put(value);
                                }
                            ).then(
                                function () {
                                    return dataCollection.getItemById(dataCollection._initialData[itemNdx].id);
                                }
                            ).then(
                                function (value) {
                                    assert.equal(value[testKey], testValue[testKey]);

                                    // set it back
                                    return dataCollection.put(dataCollection._initialData[itemNdx]);
                                }
                            ).then(
                                function () {
                                    return dataCollection.getItemById(dataCollection._initialData[itemNdx].id);
                                }
                            ).then(
                                function (value) {
                                    // verify setting it back worked
                                    assert.equal(value[testKey], dataCollection._initialData[itemNdx][testKey]);
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
                            var itemNdx = parseInt(Math.random() * dataCollection._initialData.length, 10);
                            dataCollection.getItemById(
                                dataCollection._initialData[itemNdx].id
                            )
                                .then(
                                function (value) {
                                    return dataCollection.remove(value);
                                }
                            ).then(
                                function (value) {
                                    assert.equal(value.isActive, false);
                                    return dataCollection.getItemById(dataCollection._initialData[itemNdx].id);
                                }
                            ).then(
                                function (value) {
                                    assert.equal(value, null);
                                    done();
                                }
                            );
                        });
                    });
                });
            });
            return deferred.promise;
        }
    };
    return IDataCollectionTest;
});
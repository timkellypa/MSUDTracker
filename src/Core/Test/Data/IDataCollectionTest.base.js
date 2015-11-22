/*global assert */
import IDataCollection from "Core/Data/IDataCollection";
import IDataObject from "Core/Data/IDataObject";
import ErrorObj from "Core/Error/ErrorObj";
import Database from "Core/Data/Database";
import _ from "underscore";

export default class IDataCollectionTest {
    constructor() {
        return this;
    }

    /**
     * Execute tests
     * @param {function(new:IDataCollection)} curObj inherited class, on which to run tests on core
     * @param {Array.<Object>} curTestData Test data, to be initialized for this collection
     */
    execute(curObj, curTestData) {
        describe('Core.IDataCollection', function () {
            var dataCollection,
                dbName = "_mochaTest_BaseCollection",
                Obj = curObj,
                testData = curTestData,
                db;
            before("set up database and collection", function (done) {
                this.timeout(5000);

                dataCollection = new Obj();
                // Make store name part of the database name, to prevent subsequent tests from overlapping
                // with the same db.
                db = new Database(dbName + ':' + dataCollection.getStoreName());
                db.registerDataCollection(dataCollection);
                db.init().then(
                    function () {
                        done();
                    });
            });
            beforeEach("clear any existing data", function (done) {
                dataCollection.clear().then(
                    function () {
                        done();
                    });
            });

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
                    this.timeout(5000);
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

                            _.extend(store.openCursor(), {
                                onsuccess: function (event) {
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
                                },
                                onerror: function (e) {
                                    throw new ErrorObj(0, "error opening cursor", e);
                                }
                            });
                        },
                        function (e) {
                            assert.fail(e);
                        })
                        .catch(
                        function (err) {
                            assert.fail("Error during inital data load: " + err.toString());
                        }
                    );

                });
            });
            describe("Tests with data initialized", function () {
                beforeEach("load initial data", function (done) {
                    this.timeout(5000);
                    dataCollection.setInitialData(testData);
                    dataCollection.loadInitialData().then(function () {
                        done();
                    });
                });
                afterEach("remove all data", function (done) {
                    this.timeout(5000);
                    dataCollection.clear().then(
                        function () {
                            done()
                        },
                        function (err) {
                            assert.fail(err.toString());
                        }).
                        catch(
                        function (err) {
                            assert.fail(err.toString());
                        });
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
                                done();
                            }
                        );
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
                            function () {
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
    }
}
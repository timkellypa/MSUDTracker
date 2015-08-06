/**
 * @typedef window.Core.IDataCollection
 * @name window.Core.IDataCollection
 * @ignore
 */

define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var Utils = require("../Lib/Local/Utils"),
        ErrorObj = require("./ErrorObj"),
        Promise = Utils.getPromiseLib(),
        _ = require("underscore"),
        IDataCollection;

    /**
     * Base class for a collection of data objects, and CRUD operations on them.
     *
     * @constructor
     * @memberof window.Core
     * @param {window.Core.Database} Database handling this collection.
     */

    /*jslint unparam:true */
    IDataCollection = function (database) {
        this._database = database;
        this._database.registerDataCollection(this);
    };
    /*jslint unparam:false */

    // Many unused parameters due to overridable calls
    /*jslint unparam: true */
    _.extend(IDataCollection.prototype,
        /** @lends window.Core.IDataCollection.prototype */
        {
            /**
             * Initial data for this collection.
             * @type Object[]
             */
            _initialData: null,

            /**
             * Database object
             * @type window.Core.Database
             */
            _database: null,

            /**
             * Data Object constructor
             * @abstract
             * @returns {function(new:window.Core.DataObject, {obj: Object})}
             */
            getDataObjectClass: function () {
                throw new ErrorObj(ErrorObj.Codes.UnImplementedException,
                                   "getDataObjectClass() method not implemented for a IDataCollection");
            },

            /**
             * Store name
             * @abstract
             * @returns {string}
             */
            getStoreName: function () {
                throw new ErrorObj(ErrorObj.Codes.UnImplementedException,
                                   "getStoreName() method not implemented for a IDataCollection");
            },

            /**
             * Increment on child if the table version should exceed the previous database version
             * (migration of updates).  Handle migration logic using e.oldVersion in createStore.
             * @abstract
             * @returns int
             */
            getDbVersion: function () {
                throw new ErrorObj(ErrorObj.Codes.UnImplementedException,
                                   "getDbVersion() method not implemented for a IDataCollection");
            },

            /**
             * Initialize the datastore for this data object.
             * @abstract
             * @param {Object} event event object returned in the onupgradeneeded callback
             */
            createStore: function (event) {
                throw new ErrorObj(ErrorObj.Codes.UnImplementedException,
                                   "createStore() method not implemented for an IDataCollection");
            },

            /**
             * Get the database associated with this object
             * @returns {window.Core.Database} Instance of Database object
             */
            getDatabase: function () {
                return this._database;
            },

            /**
             * Set initial data.
             * @param {Object[]} initData Array of Objects representing data Objects.
             * Can be actual data objects or just normal objects with the required properties.
             */
            setInitialData: function (initData) {
                this._initialData = initData;
            },

            /**
             * Method to load initial data (must already be setup in InitialData property)
             * This method is called on all Data Collection classes when the database is initialized.
             * @param {window.Core.Callback} [callback] callback object
             * @returns {Promise}
             */
            loadInitialData: function (callback) {
                var that = this;
                return Utils.createPromise(
                    function (resolve, reject) {
                        var maxID,
                            initialData = that._initialData;

                        if (initialData === null) {
                            resolve();
                            return;
                        }
                        maxID = parseInt(initialData[initialData.length - 1].id, 10);

                        that.getItemById(
                            maxID
                        ).then(
                            function (rec) {
                                var transaction,
                                    DataObjectClass = that.getDataObjectClass(),
                                    savePromises;

                                if (rec === null) {
                                    transaction = that.getDatabase().indexedDB.transaction(
                                        [that.getStoreName()], "readwrite"
                                    );

                                    savePromises = initialData.map(function (item) {
                                        var curItem = new DataObjectClass(item, that);
                                        return curItem.save(transaction);
                                    });

                                    return Promise.all(savePromises);
                                }
                                return Promise.resolve();
                            }
                        ).then(
                            function () {
                                resolve();
                            },
                            function () {
                                reject();
                            }
                        );
                    },
                    callback
                );
            },

            /**
             * Get an item by id
             * @param {number} id id of entry to get
             * @param {IDBTransaction} [transaction = new IDBTransaction()]
             * IndexedDB transaction to latch onto
             * @param {window.Core.Callback} [callback = new Core.Callback()]
             * callback for our function
             * @returns {Promise}
             */
            getItemById: function (id, transaction, callback) {
                var that = this;

                return Utils.createPromise(
                    function (resolve, reject) {
                        var trans = transaction || that.getDatabase().indexedDB.transaction([that.getStoreName()],
                                    "readonly"),
                            store = trans.objectStore(that.getStoreName());

                        _.extend(store.get(id),
                            {
                                onsuccess: function (event) {
                                    var ret = null;
                                    if (event.target.result !== undefined) {
                                        ret = new (that.getDataObjectClass())(event.target.result, that);
                                    }
                                    resolve(ret);
                                },
                                onerror: function (errorObj) {
                                    reject(new ErrorObj(ErrorObj.Codes.DatabaseException,
                                                        "Unexpected error getting item from collection."));
                                }
                            });
                    },
                    callback
                );
            },

            /**
             * Add an object to our collection.
             * Works as an add or update operation (using put).
             * If ID is null, object will be stored with the max ID plus 1.
             * @param {object} entry item to add.
             * @param {IDBTransaction} [transaction = new IDBTransaction()]
             * IndexedDB transaction to latch onto
             * @param [callback]
             * @returns {Promise}
             */
            put: function (entry, transaction, callback) {
                var that = this;
                return Utils.createPromise(
                    function(resolve, reject) {
                        var trans = transaction || that.getDatabase().indexedDB.transaction([that.getStoreName()],
                                    "readwrite"),
                            store = trans.objectStore(that.getStoreName()),
                            cursor,
                            errorObj;

                        // Null ID.  Get the max and add one.
                        if (entry.id === null) {
                            cursor = store.openCursor(null, 'prev');
                            cursor.onsuccess = function (event) {
                                if (event.target.result) {
                                    entry.id = event.target.result.id + 1;
                                }
                                else {
                                    entry.id = 1;
                                }
                                _.extend(store.put(entry), {
                                    onsuccess: function () {
                                        resolve(entry);
                                    },
                                    onerror: function (e) {
                                        errorObj = new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                                        reject(errorObj);
                                    }
                                });
                            };
                            cursor.onerror = function (e) {
                                errorObj = new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                                reject(errorObj);
                            };
                        }
                        else {
                            _.extend(store.put(entry), {
                                onsuccess: function () {
                                    resolve(entry);
                                },
                                onerror: function (e) {
                                    errorObj = new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                                    reject(errorObj);
                                }
                            });
                        }
                    },
                    callback
                );
            },

            /**
             * Remove an item from this collection.
             * @param {object} obj item to remove.
             * @param {IDBTransaction} [transaction = new IDBTransaction()] IndexedDB transaction to latch onto
             * @param {Core.Callback} [callback= new Core.Callback()] callback for our function
             * @returns {Promise}
             */
            remove: function (obj, transaction, callback) {
                var that = this;

                return Utils.createPromise(
                    function (resolve, reject) {
                        var trans = transaction || that.getDatabase().indexedDB.transaction([
                                    that.getStoreName(),
                                    "readwrite"
                                ]),
                            store = trans.objectStore(that.getStoreName()),
                            itemObj = that;

                        _.extend(store["delete"](obj.id), {
                            onsuccess: function () {
                                itemObj.isActive = false;
                                resolve(itemObj);
                            },
                            onerror: function (e) {
                                var errorObj = new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                                reject(errorObj);
                            }
                        });
                    },
                    callback
                );
            }
        });

    /*jslint unparam: false */
    return IDataCollection;
});

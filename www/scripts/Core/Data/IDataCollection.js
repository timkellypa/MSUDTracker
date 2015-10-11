import Utils from "../../Lib/Local/Utils";
import IDataObject from "./IDataObject.js";
import ErrorObj from "./../Error/ErrorObj";
import _ from "underscore";

let Promise = Utils.getPromiseLib();

// We are OK with unused params here, because this is an interface.
/*jslint unparam:true */
/*eslint no-unused-vars: 0 */

/**
 * Base class for a collection of data objects, and CRUD operations on them.
 */
export default class IDataCollection {
    /**
     * Constructs an IDataCollection
     *  If a database param is passed in, the collection will automatically register itself
     *  with the database.
     * (i.e. database init() will include this collection, initialization functions, etc.)
     * @param {Database} [database] Database handling this collection.  Technically optional but collection
     * should be registered to database before calling database.init().
     */
    constructor(database) {
        /**
         * Initial data for this collection.
         * @type {Object[]}
         */
        this._initialData = null;

        /**
         * Database object
         * @type {Database}
         */
        this._database = null;

        if (database) {
            database.registerDataCollection(this);
        }
    }


    /**
     * Get the class for our current DataObject in this collection
     * @abstract
     * @returns {function()}
     */
    getDataObjectClass() {
        throw new ErrorObj(ErrorObj.Codes.UnImplementedException,
                           "getDataObjectClass() method not implemented for a IDataCollection");
    }

    /**
     * Store name
     * @abstract
     * @returns {string}
     */
    getStoreName() {
        throw new ErrorObj(ErrorObj.Codes.UnImplementedException,
                           "getStoreName() method not implemented for a IDataCollection");
    }

    /**
     * Increment on child if the table version should exceed the previous database version
     * (migration of updates).  Handle migration logic using e.oldVersion in createStore.
     * @abstract
     * @returns {number}
     */
    getDbVersion() {
        throw new ErrorObj(ErrorObj.Codes.UnImplementedException,
                           "getDbVersion() method not implemented for a IDataCollection");
    }

    /**
     * Initialize the datastore for this data object.
     * @abstract
     * @param {Event} event event object returned in the onupgradeneeded callback
     */
    createStore(event) {
        throw new ErrorObj(ErrorObj.Codes.UnImplementedException,
                           "createStore() method not implemented for an IDataCollection");
    }

    /**
     * Get the database associated with this object
     * @returns {Database} Instance of Database object
     */
    getDatabase() {
        return this._database;
    }

    /**
     * Sets the database for this collection
     * @param {Database} db Instance of Database object
     */
    setDatabase(db) {
        this._database = db;
    }

    /**
     * Set initial data.
     * @param {Object[]} initData Array of Objects representing data Objects.
     * Can be actual data objects or just normal objects with the required properties.
     */
    setInitialData(initData) {
        this._initialData = initData;
    }

    /**
     * Method to load initial data (must already be setup in InitialData property)
     * This method is called on all Data Collection classes when the database is initialized.
     * @returns {Promise}
     */
    loadInitialData() {
        var that = this,
            maxID,
            initialData = that._initialData;

        if (initialData === null) {
            return Utils.getPromiseLib().resolve();
        }
        maxID = parseInt(initialData[initialData.length - 1].id, 10);

        return that.getItemById(
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
                        var curItem = new DataObjectClass(item);
                        return that.put(curItem, transaction);
                    });
                    return Promise.all(savePromises);
                }
                return Promise.resolve();
            }
        ).catch(
            function (errorObj) {
                throw (new ErrorObj(ErrorObj.Codes.DatabaseException,
                                    "Unexpected error loading initial data.",
                                    errorObj));
            }
        );
    }

    /**
     * Get an item by id
     * @param {number} id id of entry to get
     * @param {IDBTransaction} [transaction=IDBTransaction()]
     * IndexedDB transaction to latch onto
     * @returns {Promise}
     */
    getItemById(id, transaction) {
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
                            throw (new ErrorObj(ErrorObj.Codes.DatabaseException,
                                                "Unexpected error getting item from collection.",
                                                errorObj));
                        }
                    });
            }
        );
    }

    /**
     * Add an object to our collection.
     * Works as an add or update operation (using put).
     * If ID is null, object will be stored with the max ID plus 1.
     * @param {object} entry item to add.  If an IDataObject, then getPropertyObject() is what is stored to the
     * datastore, for serialization purposes.
     * @param {IDBTransaction} [transaction=IDBTransaction()]
     * IndexedDB transaction to latch onto
     * @returns {Promise} Promise, with entry as the argument.
     */
    put(entry, transaction) {
        let that = this,
            value = entry instanceof IDataObject ? entry.getPropertyObject() : entry;

        return Utils.createPromise(
            function (resolve, reject) {
                let trans = transaction || that.getDatabase().indexedDB.transaction([that.getStoreName()],
                            "readwrite"),
                    store = trans.objectStore(that.getStoreName()),
                    cursor,
                    errorObj;

                // Null ID.  Get the max and add one.
                if (value.id === null) {
                    cursor = store.openCursor(null, 'prev');
                    cursor.onsuccess = function (event) {
                        if (event.target.result) {
                            value.id = event.target.result.id + 1;
                        }
                        else {
                            value.id = 1;
                        }
                        entry.id = value.id;
                        _.extend(store.put(value), {
                            onsuccess: function () {
                                resolve(entry);
                            },
                            onerror: function (e) {
                                errorObj = new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                                throw errorObj;
                            }
                        });
                    };
                    cursor.onerror = function (e) {
                        errorObj = new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                        throw errorObj;
                    };
                }
                else {
                    _.extend(store.put(value), {
                        onsuccess: function () {
                            resolve(entry);
                        },
                        onerror: function (e) {
                            errorObj = new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                            throw errorObj;
                        }
                    });
                }
            }
        );
    }

    /**
     * Remove an item from this collection.
     * @param {object} obj item to remove.
     * @param {IDBTransaction} [transaction=IDBTransaction()] IndexedDB transaction to latch onto
     * @returns {Promise}
     */
    remove(obj, transaction) {
        let that = this;

        return Utils.createPromise(
            function (resolve, reject) {
                let trans = transaction || that.getDatabase().indexedDB.transaction([that.getStoreName()],
                            "readwrite"),
                    store;

                store = trans.objectStore(that.getStoreName());

                _.extend(store["delete"](obj.id), {
                    onsuccess: function () {
                        resolve(that);
                    },
                    onerror: function (e) {
                        throw new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                    }
                });
            }
        );
    }


    /**
     * Removes all items from this collection.
     * @param {IDBTransaction} [transaction=IDBTransaction()] IndexedDB transaction to latch onto
     * @returns {Promise}
     */
    clear(transaction) {
        let that = this;

        return Utils.createPromise(
            function (resolve, reject) {
                let trans = transaction || that.getDatabase().indexedDB.transaction([that.getStoreName()],
                            "readwrite"),
                    store;

                store = trans.objectStore(that.getStoreName());

                _.extend(store["clear"](), {
                    onsuccess: function () {
                        resolve(that);
                    },
                    onerror: function (e) {
                        throw new ErrorObj(ErrorObj.Codes.DatabaseException, e.target.error);
                    }
                });
            }
        );
    }
}
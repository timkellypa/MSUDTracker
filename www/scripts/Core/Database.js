/*global window */
import ErrorObj from "./ErrorObj";
import _ from "underscore";
import Utils from "../Lib/Local/Utils";

let Promise = Utils.getPromiseLib(),
    IDBKeyRange = (typeof window === "object") ? window.IDBKeyRange : null,
    indexedDB;

indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

/**
 * Database object. Mainly a wrapper for indexedDB, but also can register to
 * IDataCollection types.
 */
export default class Database {

    /**
     * Initialize the data object
     * @param {string} dbName Database Name
     */
    constructor(dbName) {
        /**
         * Pointer to indexed DB instance
         *
         * @type {indexedDB}
         */
        this.indexedDB = null;

        /**
         * Array of schema initialization methods
         * Parameter is database creation event (indexedDB event type).
         * @protected
         * @type {function[]}
         */
        this._schemaInitMethods = [];

        /**
         * Array of initial data methods
         * @protected
         * @type {function[]}
         */
        this._initDataMethods = [];

        /**
         * Database name
         *
         * @type {string}
         */
        this.dbName = dbName;

        /**
         * Database version. Will be the max of the versions of our individual
         * IDataCollection(s).
         *
         * @type {number}
         */
        this.dbVersion = 1;

    }

    /**
     * Pointer to IDBKeyRange or node polyfilled version of it.
     * @returns {IDBKeyRange}
     */
    static getIDBKeyRange() {
        return IDBKeyRange;
    }

    /**
     * Register a data collection.  Add its initializer and initial data methods to our method sequences.
     * Those will be run when initializing the db.
     * @param {IDataCollection} dataCollection dataCollection to register.
     */
    registerDataCollection(dataCollection) {
        dataCollection.setDatabase(this);
        this._initDataMethods.push(_.bind(dataCollection.loadInitialData, dataCollection));
        this._schemaInitMethods.push(_.bind(dataCollection.createStore, dataCollection));
        this.dbVersion = Math.max(this.dbVersion, dataCollection.getDbVersion());
    }

    /**
     * Load initial data
     * @returns {Promise}
     */
    loadInitialData() {
        let that = this;
        return Utils.createPromise(
            function (resolve, reject) {
                let initDataPromises;
                if (that._initDataMethods === null) {
                    resolve();
                    return;
                }

                initDataPromises = that._initDataMethods.map(function (item) {
                    return item();
                });

                Promise.all(initDataPromises)
                    .then(
                    function () {
                        resolve();
                    },
                    function (errorObj) {
                        reject(errorObj);
                    }
                ).catch(
                    function (errorObj) {
                        reject(errorObj);
                    }
                );
            }
        );
    }

    /**
     * Initialize the database
     * @returns {Promise}
     */
    init() {
        let that = this;

        return Utils.createPromise(
            function (resolve, reject) {
                if (indexedDB === undefined) {
                    reject(new ErrorObj(ErrorObj.Codes.DatabaseException,
                                        "DatabaseException: No database supported"));
                    return;
                }

                _.extend(indexedDB.open(that.dbName, that.dbVersion), {
                    onerror: _.bind(function (e) {
                        throw (
                            new ErrorObj(
                                ErrorObj.Codes.DatabaseException,
                                "DatabaseException: IndexedDB not allowed.",
                                e.currentTarget.error
                            )
                        );
                    }, that),

                    onupgradeneeded: function (event) {
                        let iNdx;

                        that.indexedDB = event.target.result;
                        for (iNdx = 0; iNdx < that._schemaInitMethods.length; ++iNdx) {
                            that._schemaInitMethods[iNdx](event);
                        }
                    },

                    onsuccess: function (event) {
                        that.indexedDB = event.target.result;

                        // Close connections if version change happens (to delete db)
                        that.indexedDB.onversionchange = function (event) {
                            event.target.close();
                        };

                        that.loadInitialData()
                            .then(
                            function () {
                                resolve();
                            },
                            function (errorObj) {
                                reject(errorObj);
                            }
                        );
                    }
                });
            }
        );
    }

    /**
     * Drops the database
     * @returns {Promise}
     */
    drop() {
        let that = this;

        return Utils.createPromise(
            function (resolve, reject) {
                _.extend(window.indexedDB.deleteDatabase(that.dbName),
                    {
                        onsuccess: function () {
                            resolve();
                        },
                        onerror: function (e) {
                            reject((new ErrorObj(
                                           ErrorObj.Codes.DatabaseException,
                                           "DatabaseException: Error Dropping Database",
                                           e)
                                   )
                            );
                        },
                        onblocked: function (e) {
                            reject((new ErrorObj(
                                           ErrorObj.Codes.DatabaseException,
                                           "DatabaseException: Blocked Dropping Database",
                                           e)
                                   )
                            );
                        }
                    }
                );
            }
        );
    }
}
/**
 * @typedef window.Core.Database
 * @name window.Core.Database
 * @ignore
 */

define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}
/*global window */
define(function (require) {
    "use strict";
    var ErrorObj = require("./ErrorObj"),
        _ = require("underscore"),
        Utils = require("../Lib/Local/Utils"),
        Promise = Utils.getPromiseLib(),
        IDBKeyRange = (typeof window === "object") ? window.IDBKeyRange : null,
        indexedDB = (typeof window === "object") ? window.indexedDB : null,
        Database,
        engine,
        sqlite3 = "sqlite3",
        indexeddbjs = "indexeddb-js";

    // Node polyfill, for tests and such
    if (indexedDB === null) {
        engine = new ((require(sqlite3)).Database)(':memory:');
        indexedDB = new ((require(indexeddbjs)).indexedDB)('sqlite3', engine);
        IDBKeyRange = require(indexeddbjs).makeScope('sqlite3', engine).IDBKeyRange;
    }

    /**
     * Database object. Mainly a wrapper for indexedDB, but also can register to
     * DataObject types.
     *
     * @constructor
     * @memberof window.Core
     * @param {String} dbName Database Name
     */
    Database = function (dbName) {
        this.dbName = dbName;
        this._schemaInitMethods = [];
        this._initDataMethods = [];
    };

    _.extend(Database.prototype,
        /** @lends window.Core.Database.prototype */
        {
            /**
             * Pointer to indexed DB instance
             *
             * @type indexedDB
             */
            indexedDB: null,

            /**
             * Pointer to IDBKeyRange or node polyfilled version of it.
             * @returns {IDBKeyRange}
             */
            getIDBKeyRange: function() {
                return IDBKeyRange;
            },

            /**
             * Array of schema initialization methods
             * Parameter is database creation event (indexedDB event type).
             * @protected
             * @type Array.<function(event)>
             */
            _schemaInitMethods: null,

            /**
             * Array of initial data methods
             * @protected
             * @type Array.<function(window.Core.Callback)>
             */
            _initDataMethods: null,

            /**
             * Database name
             *
             * @type string
             */
            dbName: null,

            /**
             * Database version. Will be the max of the versions of our individual
             * IDataCollection(s).
             *
             * @type int
             */
            dbVersion: 0,

            /**
             * Register a data collection.  Add its initializer and initial data methods to our method sequences.
             * Those will be run when initializing the db.
             * @param {window.Core.IDataCollection} dataCollection dataCollection to register.
             */
            registerDataCollection: function (dataCollection) {
                dataCollection.setDatabase(this);
                this._initDataMethods.push(_.bind(dataCollection.loadInitialData, dataCollection));
                this._schemaInitMethods.push(_.bind(dataCollection.createStore, dataCollection));
                this.dbVersion = Math.max(this.dbVersion, dataCollection.getDbVersion());
            },

            /**
             * Load initial data
             */
            loadInitialData: function () {
                var that = this;
                return Utils.createPromise(
                    function (resolve, reject) {
                        var initDataPromises;
                        if (that._initDataMethods === null) {
                            return Promise.resolve();
                        }
                        initDataPromises = that._initDataMethods.map(function(item) {
                            return item();
                        });
                        Promise.all(initDataPromises)
                            .then(
                            function() {
                                resolve();
                            },
                            function(errorObj) {
                                reject(errorObj);
                            }
                        );
                    }
                );
            },

            /**
             * Initialize the database
             */
            init: function () {
                var that = this;

                return Utils.createPromise(
                    function (resolve, reject) {
                        if (indexedDB === undefined) {
                            reject(new ErrorObj(ErrorObj.Codes.DatabaseException,
                                                        "DatabaseException: No database supported"));
                            return Promise.resolve();
                        }

                        _.extend(indexedDB.open(that.dbName, that.dbVersion), {
                            onerror: _.bind(function () {
                                reject((new ErrorObj(
                                    ErrorObj.Codes.DatabaseException,
                                    "DatabaseException: IndexedDB not allowed")));
                            }, that),

                            onupgradeneeded: function (event) {
                                var iNdx;

                                that.indexedDB = event.target.result;
                                for (iNdx = 0; iNdx < that._schemaInitMethods.length; ++iNdx) {
                                    that._schemaInitMethods[iNdx](event);
                                }
                            },

                            onsuccess: function (event) {
                                that.indexedDB = event.target.result;
                                that.loadInitialData()
                                    .then(
                                    function() {
                                        resolve();
                                    },
                                    function(errorObj) {
                                        reject(errorObj);
                                    }
                                );
                            }
                        });
                    }
                );
            }
        });
    return Database;
});
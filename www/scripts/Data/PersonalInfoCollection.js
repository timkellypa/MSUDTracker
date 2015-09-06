define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var IDataCollection = require("../Core/IDataCollection"),
        PersonalInfo = require("./PersonalInfo"),
        Utils = require("../Lib/Local/Utils"),
        _ = require("underscore"),
        PersonalInfoCollection;

    /*jslint unparam: true */

    /**
     * Stores Personal information, Contains leucine allowance and calorie goal
     *
     * @extends window.Core.IDataCollection
     * @constructor
     * @memberof window.Data
     * @param {window.Core.Database} database database to which this collection syncs.
     */
    PersonalInfoCollection = function (database) {
        PersonalInfoCollection.$Super.constructor.apply(this, arguments);
    };

    /*jslint unparam: false */

    _.extend(PersonalInfoCollection.prototype,
        /** @lends window.Data.PersonalInfoCollection.prototype */
        {
            getDbVersion: function() {
                return 1;
            },

            getDataObjectClass: function() {
                return PersonalInfo;
            },

            getStoreName: function() {
                return "PersonalInfo";
            },

            /**
             * Initialize the datastore for this data object.
             * @param event event object returned in the onupgradeneeded callback
             */
            createStore: function (event) {
                var e = event || {oldVersion: 0},
                    objectStore;
                if (!e.oldVersion || e.oldVersion < 1) {
                    objectStore = this.getDatabase().indexedDB.createObjectStore(this.getStoreName(),
                        {
                            keyPath: "id",
                            autoIncrement: false
                        });

                    objectStore.createIndex("id", "id", {unique: true});
                    objectStore.createIndex("leucineAllowance", "leucineAllowance", {unique: false});
                    objectStore.createIndex("calorieGoal", "calorieGoal", {unique: false});
                }
            }
        });

    Utils.inherit(PersonalInfoCollection, IDataCollection);

    return PersonalInfoCollection;
});
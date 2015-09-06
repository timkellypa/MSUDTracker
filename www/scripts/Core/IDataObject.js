define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var ErrorObj = require("./ErrorObj"),
        Utils = require("../Lib/Local/Utils"),
        _ = require("underscore"),
        IDataObject;

    /**
     * @typedef IDataObject
     * @name IDataObject
     */
    /**
     * A basis for an object that handles its own data entries.
     * Simply extend this class and implement its required properties.
     * That object can contain any extra properties as well.
     *
     * @constructor
     * @memberof window.Core
     * @param {Object} obj An object representing all the fields of the data object.
     *                  All inherited classes must use this type of constructor.
     */
    IDataObject = function (obj) {
        var iNdx,
            curObj = obj === undefined ? {} : obj,
            objKeys = _.keys(curObj),
            curKey;

        // Loop on numeric or string values in our passed in object that also exist in our prototype.
        for (iNdx = 0; iNdx < objKeys.length; ++iNdx) {
            curKey = objKeys[iNdx];
            switch (typeof(obj[curKey])) {
                case "number":
                case "string":
                case "boolean":
                    this[curKey] = curObj[curKey];
                    break;
            }
        }
    };

    IDataObject.prototype =
    /** @lends window.Core.IDataObject.prototype */
    {
        constructor: IDataObject.prototype.constructor,

        /**
         * id of this data object.  Required for all inherited objects
         * @type Numeric
         */
        id: null,

        /**
         * whether or not the item is active.  Will be false when the item is deleted
         * @type boolean
         */
        isActive: true,

        /**
         * Include an object as a property of this object (i.e. inner join).
         * @param {IDBTransaction} transaction indexeddb transaction object
         * @param {string} foreignKey Name of the foreign key.
         * @param {window.Core.IDataCollection} foreignCollection Collection of the target class
         */
        include: function (transaction, foreignKey, foreignCollection) {
            var that = this;
            return Utils.createPromise(
                function (resolve, reject) {
                    var store,
                        req;

                    store = transaction.objectStore(foreignCollection.getStoreName());

                    req = store.get(that[foreignKey].toString());

                    /*jslint unparam: true */
                    req.onsuccess = function (event) {
                        that[foreignCollection.getStoreName()] =
                            new (foreignCollection.getDataObjectClass())(req.result, foreignCollection);
                        resolve(that);
                    };
                    /*jslint unparam: false */

                    req.onerror = function (event) {
                        reject(new ErrorObj(ErrorObj.Codes.DatabaseException,
                                            "Error including sub object with foreign key "
                                            + foreignKey + " to type " + foreignCollection.getStoreName(),
                                            event.target.error
                               )
                        );
                    };
                });
        }
    };
    return IDataObject;
});

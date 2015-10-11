import ErrorObj from "./../Error/ErrorObj";
import Utils from "../../Lib/Local/Utils";
import _ from "underscore";

// We are OK with unused params here, because this is an interface.
/*jslint unparam:true */
/*eslint no-unused-vars: 0 */

/**
 * A basis for an object that handles its own data entries.
 * Simply extend this class and implement its required properties.
 * That object can contain any extra properties as well.
 */
export default class IDataObject {
    /**
     * Constructs a data object (override to set actual properties the instance object).
     * @param {Object} [properties=Object()] Object containing properties for this model.
     */
    constructor(properties = {}) {
        /**
         * ID of this item.  Keep null for new entries, otherwise will auto-increment.
         * Must set to the correct value for updates.
         * @type {number}
         */
        this.id = properties.id || null;
    }

    /**
     * Get a raw object of only our properties, no prototypes, etc.
     * Easier for deep equals comparison.
     * @returns {Object}
     */
    getPropertyObject() {
        let ret = {},
            objKeys = _.keys(this),
            iNdx,
            curKey;

        // Loop on numeric, string, or boolean values in our object
        for (iNdx = 0; iNdx < objKeys.length; ++iNdx) {
            curKey = objKeys[iNdx];
            switch (typeof(this[curKey])) {
                case "number":
                case "string":
                    ret[curKey] = this[curKey];
                    break;
                case "boolean":
                    ret[curKey] = this[curKey] ? 1 : 0;
                    break;
            }
        }
        return ret;
    }

    /**
     * Include an object as a property of this object (i.e. inner join).
     * @param {IDBTransaction} transaction indexeddb transaction object
     * @param {string} foreignKey Name of the foreign key.
     * @param {IDataCollection} foreignCollection Collection of the target class
     * @returns {Promise}
     */
    include(transaction, foreignKey, foreignCollection) {
        let that = this;
        return Utils.createPromise(
            function (resolve, reject) {
                let store,
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
            }
        );
    }

    /**
     * Get the foreign keys associated with this object
     * @returns {Array} array of objects containing "foreignKey" and "foreignClass".
     * Empty array if no foreign keys for this object.
     */
    getForeignKeys() {
        return [];
    }
}

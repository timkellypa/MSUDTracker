define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var IDataObject = require("../Core/IDataObject"),
        Utils = require("../Lib/Local/Utils"),
        _ = require("underscore"),
        PersonalInfo;

    /**
     * User's personal information.  Contains leucine allowance and calorie goal
     * @constructor
     * @memberof window.Data
     * @extends window.Core.DataObject
     * @param {Object} obj
     * @param {int} obj.id
     * @param {int} obj.leucineAllowance
     * @param {int} obj.calorieGoal
     * @param {window.Data.PersonalInfoCollection} collection data collection containing this object.
     */
    PersonalInfo = function (obj, collection) {
        PersonalInfo.$Super.constructor.call(this, obj, collection);
    };

    _.extend(PersonalInfo.prototype,
        /** @lends window.Data.PersonalInfo.prototype */
        {
            /**
             * Name of store
             * @type string
             */
            storeName: "PersonalInfo",

            /**
             * ID of item
             * @type int
             */
            id: null,

            /**
             * Milligrams of leucine allowed per day
             * @type int
             */
            leucineAllowance: null,

            /**
             * Calorie goal per day
             * @type int
             */
            calorieGoal: null
        }
    );

    Utils.inherit(PersonalInfo, IDataObject);

    return PersonalInfo;
});
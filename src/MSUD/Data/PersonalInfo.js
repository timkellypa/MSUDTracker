import IDataObject from "../../Core/Data/IDataObject";

/**
 * User's personal information.  Contains leucine allowance and calorie goal
 * @extends {IDataObject}
 */
export default class PersonalInfo extends IDataObject {
    /**
     * Constructs a PersonalInfo object
     * @param {Object} [properties=Object()] Object containing properties for this model.
     * See public members for options.
     */
    constructor(properties = {}) {
        super(properties);

        /**
         * Milligrams of leucine allowed per day
         * @type {number}
         */
        this.leucineAllowance = properties.leucineAllowance || null;

        /**
         * Calorie goal per day
         * @type {number}
         */
        this.calorieGoal = properties.calorieGoal || null;
    }
}

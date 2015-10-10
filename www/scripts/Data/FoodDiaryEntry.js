import IDataObject from "../Core/IDataObject";
import Food from "./Food";

/**
 * A food diary entry.  Describes when a person ate a particular food, how many servings, etc.
 * @extends {IDataObject}
 */
export default class FoodDiaryEntry extends IDataObject {
    /**
     * Construct FoodDiaryEntry
     * @param {Object} [properties=Object()] Object containing properties for this model.
     * See public members for options.
     */
    constructor(properties = {}) {
        super(properties);

        /**
         * food id.  Used to populate "Food" field (foreign key to food table)
         * @type {number}
         */
        this.foodID = properties.foodID || null;

        /**
         * Javascript "getDate()" time that food was entered
         * @type {number}
         */
        this.enteredTime = properties.enteredTime || null;

        /**
         * Javascript "getDate()" time that food was eaten
         * @type {number}
         */
        this.eatenTime = properties.eatenTime || null;

        /**
         * Number of servings eaten
         * @type {number}
         */
        this.servings = properties.servings || null;

        /**
         * id of the meal.
         * @type {number}
         */
        this.mealID = properties.mealID || null;

        /**
         * Value of inner joined food object (by food ID)
         * @type {Food}
         */
        this.Food = properties.Food || null;
    }

    /**
     * Get the foreign keys associated with this object
     * @returns {Array} array of objects containing "foreignKey" and "foreignClass".
     */
    getForeignKeys() {
        return [
            {
                foreignKey: "foodID",
                foreignClass: Food
            }
        ];
    }
}
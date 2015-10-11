import IDataObject from "../Core/Data/IDataObject";

/**
 * Stores food information, including leucine amount and calories per serving.
 * @extends {IDataObject}
 */
export default class Food extends IDataObject {
    /**
     * Constructs Food Object
     * @param {Object} [properties=Object()] Object containing properties for this model.
     * See public members for options.
     */
    constructor(properties = {}) {
        super(properties);

        /**
         * Description
         * @type {string}
         */
        this.description = properties.description || null;

        /**
         * Weight
         * @type {number}
         */
        this.weight = properties.weight || null;

        /**
         * Serving size
         * @type {number}
         */
        this.serving = properties.serving || null;

        /**
         * Unit of measurement for the food
         * @type {string}
         */
        this.unit = properties.unit || null;

        /**
         * Milligrams of leucine
         * @type {number}
         */
        this.leucineMg = properties.leucineMg || null;

        /**
         * Calories
         * @type {number}
         */
        this.energyKCal = properties.energyKCal || null;

        /**
         * Whether or not this item was custom (i.e. created by the user).
         * Number representing a boolean (1 or 0).
         * @type {number}
         * @default 0
         */
        this.isCustom = properties.isCustom ? 1 : 0;
    }
}

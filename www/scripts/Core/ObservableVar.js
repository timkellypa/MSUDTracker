import Observer from "Core/Observer";

/**
 * Observable Variable.  Contains a value and allows things to register change events
 * for when the value changes.
 */
export default class ObservableVar {
    /**
     * Create an observable value with an initial value.
     * @param {Object} [initialValue=null] Initial value of our variable
     */
    constructor(initialValue = null) {
        /**
         * Observer for when the value has changed.
         * @type {Observer}
         */
        this.valueChanged = new Observer();

        /**
         * internal value
         */
        this._internalValue = initialValue;
    }

    /**
     * Get the value
     * @returns {Object} current value
     */
    getValue() {
        return this._internalValue;
    }

    /**
     * Set the value.  If the value has changed, the changed observer will fire.
     * @param {Object} newValue value to set.
     */
    setValue(newValue) {
        let curObj = this;
        if (curObj._internalValue !== newValue) {
            curObj._internalValue = newValue;
            curObj.valueChanged.fire();
        }
    }
}
/**
 * A CSS class that is able to be toggled by a property
 */
export default class ConditionalClass {
    constructor(property, onValue, offValue) {
        this.property = property;
        this.onValue = onValue;
        this.offValue = offValue;
    }
}
export default class CollectionChangedEventArgs {
    /**
     *
     * @param {string} changeType type of change: "add", "remove", "clear"
     * @param {Object} [value=null] object that has changed
     * @param {number} [index=-1] index of object
     */
    constructor(changeType, value = null, index = -1) {
        this.changeType = changeType;
        this.value = value;
        this.index = index;
    }
}
/**
 * An object that can be observed.
 * Allows a caller to register an event or fire all registered events.
 */
export default class Observer {
    /**
     * Construct an observer
     */
    constructor() {
        /**
         * Array of observer methods
         * @type {Array}
         */
        this._observers = [];
    }

    /**
     * Remove a function from our observer array.
     * @param {function} fn function to remove
     */
    remove(fn) {
        for (let iNdx = 0, len = this._observers.length; iNdx < len; ++iNdx) {
            if (this._observers[iNdx] === fn) {
                this._observers.splice(iNdx, 1);
            }
        }
    }

    /**
     * Fire all of our observers
     */
    fire() {
        for (let iNdx = 0, len = this._observers.length; iNdx < len; ++iNdx) {
            (this._observers[iNdx])();
        }
    }

    /**
     * Add an observer
     * @param {function} fn function to add
     */
    add(fn) {
        this._observers.push(fn);
    }
}
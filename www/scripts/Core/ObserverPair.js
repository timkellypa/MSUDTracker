/**
 * This is a class that couples an observer with its handler.
 * Also contains some convenience methods for cancelling the observer.
 * This is so that observers, even if added to dynamic or anonymous functions, can still be cancelled, using the
 * normal method of doing so.
 */
export default class ObserverPair {
    /**
     * Construct an observer pair
     * @param {Observer} observer
     * @param {function} handler function that handles this observer
     */
    constructor(observer, handler) {
        /**
         * Observer
         * @type {Observer}
         */
        this.observer = observer;

        /**
         * Handler for this observer
         * @type {function}
         */
        this.handler = handler;
    }

    /**
     * Register our handler as an observer function for the observer.
     */
    register() {
        this.observer.add(this.handler);
    }

    /**
     * Cancel our method as a function for our observer.  All other observer methods will still exist.
     */
    cancel() {
        this.observer.remove(this.handler);
    }

    /**
     * Cancel, and also remove references to this observer and handler.
     */
    destroy() {
        this.cancel();
        this.observer = null;
        this.handler = null;
    }
}
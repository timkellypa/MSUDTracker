import IView from "./IView.js";

/**
 * Interface for a page
 * @extends {IView}
 **/
export default class IPage extends IView {
    /**
     * Construct an IPage object
     */
    constructor() {
        super();

        /**
         * Context for this page.
         * @type {IViewModel}
         */
        this.context = null;
    }

    /**
     * Show page
     * @param options
     * @returns {Promise}
     */
    show(options) {
        return super.show(options);
    }

    /**
     * Override destroy for pages.  Don't actually remove $el, because it is the whole page.
     * Just empty it.
     */
    destroy() {
        this.$el.empty();
        this.$el = null;
    }
}
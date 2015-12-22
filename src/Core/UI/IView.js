import ErrorObj from '../Error/ErrorObj';
import ErrorCodes from '../Error/ErrorCodes';
import IDestroyable from "../IDestroyable.js";
import $ from "jquery";
import ImportHelpers from "../Lib/ImportHelpers";
import Promise from "../Lib/Promise";

/**
 * Interface for a view
 * @extends {IDestroyable}
 **/
export default class IView extends IDestroyable {
    constructor() {
        super();

        /**
         * The UI element for this view.
         * @type {jQuery}food
         */
        this.$el = null;
    }

    /**
     * Initialize the view.  This will create all the UI
     * @returns {Promise}
     */
    show(options) {
        if (options.element) {
            this.$el = $(options.element);
        }
        else if (options.template && options.container) {
            this.$el = $(ImportHelpers.getHTMLBody(options.template));
            options.container.appendChild(this.$el[0]);
        }
        else {
            throw new ErrorObj(ErrorCodes.ConfigurationException,
                "Attempt to call show() on an IFormInput object without template or element.");
        }
        return Promise.resolve();
    }

    destroy() {
        this.$el.remove();
        this.$el = null;
    }
}
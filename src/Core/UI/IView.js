import ErrorObj from '../Error/ErrorObj';
import ErrorCodes from '../Error/ErrorCodes';
import IDestroyable from "../IDestroyable.js";
import $ from "jquery";
import ImportHelpers from "../Lib/ImportHelpers";

/**
 * Interface for a view
 * @extends {IDestroyable}
 **/
export default class IView extends IDestroyable {
    constructor() {
        super();
        this.bindMethods();
    }

    /**
     * Initialize the view.  This will create all the UI
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
    }
    destroy() {
        this.$el.remove();
        this.$el = null;
    }

    /**
     * Override this method to bind methods to "this" context (using _.bind, or some such function)
     */
    bindMethods() {
    }
}
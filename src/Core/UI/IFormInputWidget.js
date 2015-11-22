import IWidget from "./IWidget";
import ObservableVar from "../ObservableVar";
import ErrorObj from "../Error/ErrorObj";
import ErrorCodes from "../Error/ErrorCodes";
import ImportHelpers from "../Lib/ImportHelpers";
import $ from "jquery";

/**
 * Interface for a form input widget.  These are widgets that can be used within forms.
 * @extends {IWidget}
 **/
export default class IFormInputWidget extends IWidget {
    /**
     * Construct an IFormInput object
     * @param {Object} options options for this input field
     * @param {Function<String|null>} [options.validationMethod=function() { return null; }]
     * validation method for this input field.  Should return a string
     * containing the error or null if none.
     * @param {ObservableVar} [options.value=new ObservableVar()} Contains the value of this control,
     * which can be listened to on change.
     */
    constructor(options) {
        super();

        /**
         * Form element for textbox
         * @type {Element}
         */
        this.$el = null;

        /**
         * Observable Variable containing the value of this widget
         * @type {ObservableVar}
         */
        this.value = null;

        /**
         * Observable Variable containing the current validation error (null if none)
         * @type {ObservableVar}
         */
        this.validationError = null;

        if (options.value instanceof ObservableVar) {
            this.value = options.value;
        }
        else {
            this.value = new ObservableVar();
        }

        if (options.validationMethod instanceof Function) {
            this.validationMethod = options.validationMethod;
        }
        else {
            this.validationMethod = () => { return null; };
        }
    }

    /**
     * Render this control (or bind $el to an existing HTML control).
     * @param {Object} options options for showing this form element
     * @param {Element} [options.element] HTML element for this control.  Control must either define an element or
     * template.
     * @param {string} [options.template] Template for this control.  Must be defined if no element.
     * @param {Element} [options.container] Container to which to add the result of a template (must be defined if
     * using template)
     */
    show(options) {
        super.show(options);

        // For two way databinding, which is all we care about now... put the value into our control,
        //  then run any kind of sanitation logic and push it back into the ObservableVar (sets up the initial bind).
        this.pullValue();
        this.pushValue();
    }

    /**
     * Pushes into value ObservableVar from the control.
     */
    pushValue() {
        throw new ErrorObj(ErrorCodes.UnImplementedException,
            "pushValue() is unimplemented for an IFormInput instance.");
    }

    /**
     * Pulls from value ObservableVar into the control.
     */
    pullValue() {
        throw new ErrorObj(ErrorCodes.UnImplementedException,
            "pullValue() is unimplemented for an IFormInput instance.");
    }

    /**
     * Destroy this object.
     */
    destroy () {
        this.$el.remove();
        this.value = null;
    }
}
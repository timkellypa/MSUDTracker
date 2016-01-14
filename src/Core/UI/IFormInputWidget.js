import IWidget from "./IWidget";
import ObservableVar from "../ObservableVar";
import ErrorObj from "../Error/ErrorObj";
import ErrorCodes from "../Error/ErrorCodes";
import ObserverPair from "../ObserverPair";
import _ from "underscore";

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
     * @param {Array<string,object>} [options.conditionalClasses] array of objects containing: condition (ObservableVar),
     * on (style class name) and off (style class name)
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
            this.validationMethod = () => {
                return null;
            };
        }

        this.conditionalClasses = options.conditionalClasses || [];

        this.conditionalClassHandlers = [];
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
        let that = this;

        return super.show(options)
            .then(() => that.registerConditionalClasses())
            .then(() => that.bindMethods());
    }

    initValue() {
        return Promise.resolve()
            .then(() => this.pullValue())
            .then(() => this.pushValue())
    }

    /**
     * Pushes value into ObservableVar from the control.
     */
    pushValue() {
        throw new ErrorObj(ErrorCodes.UnImplementedException,
            "pushValue() is unimplemented for an IFormInput instance.");
    }

    /**
     * Pulls value from ObservableVar into the control.
     */
    pullValue() {
        throw new ErrorObj(ErrorCodes.UnImplementedException,
            "pullValue() is unimplemented for an IFormInput instance.");
    }

    bindMethods() {
        this.pushValue = _.bind(this.pushValue, this);
        this.pullValue = _.bind(this.pullValue, this);
    }

    registerConditionalClasses() {
        for (let i = 0, len = this.conditionalClasses.length; i < len; ++i) {
            let curConditionalClass = this.conditionalClasses[i],
                curPair,
                that = this;
            let conditionalClassFunc = () => {
                if (curConditionalClass.condition.getValue()) {
                    that.$el.removeClass(curConditionalClass.off);
                    that.$el.addClass(curConditionalClass.on);
                } else {
                    that.$el.removeClass(curConditionalClass.on);
                    that.$el.addClass(curConditionalClass.off);
                }
            };

            curPair = new ObserverPair(curConditionalClass.condition.valueChanged, conditionalClassFunc);
            conditionalClassFunc();
            curPair.register();
            this.conditionalClassHandlers.push(curPair);
        }
    }

    unRegisterConditionalClasses() {
        for (let i = 0, len = this.conditionalClassHandlers.length; i < len; ++i) {
            this.conditionalClassHandlers[i].destroy();
        }
        this.conditionalClassHandlers.splice(0, this.conditionalClassHandlers.length);
        this.conditionalClasses.splice(0, this.conditionalClasses.length);
    }

    /**
     * Destroy this object.
     */
    destroy() {
        this.unRegisterConditionalClasses();
        this.$el.remove();
        this.value = null;
    }
}
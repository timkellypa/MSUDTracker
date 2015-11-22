import ImportHelpers from "../../Lib/ImportHelpers";
import FormHelpers from "../../Lib/FormHelpers";
import TextBox from "./TextBox";
import NumericTextBox from "./NumericTextBox";
import IWidget from "../IWidget";
import $ from "jquery";
import _ from "underscore";

/**
 * A widget for creating a form from an HTML template.
 * While most work will be done by HTML and CSS, this widget will be required for:
 * 1.  Custom widgets
 * 2.  Custom validation
 **/
export default class Form extends IWidget {
    /**
     * Construct a Form
     * @param {IViewModel} context ViewModel object with properties and methods that this form needs to call
     */
    constructor(context = null) {
        super(context);

        /**
         * Context (ViewModel) for our object.
         * Form fields will specify binding to properties of this object.
         * @type {?IViewModel}
         */
        this.context = context;

        /**
         * Screen container for this element
         * @type {Element}
         */
        this.screen = null;

        /**
         * Form element
         * @type {jQuery}
         */
        this.$form = null;

        /**
         * Array of widgets for this control
         * @type {Array<Widget>}
         */
        this.widgets = [];

        /**
         * UI element for this widget
         * @type {Element}
         */
        this.$el = null;

        this._bindMethods();
    }

    /**
     * Initialize the UI for this widget
     * @param {Object} options options for the show method.
     */
    show(options) {
        super.show(options);

        this._setupForm();
        this._registerWidgets();
        this._addListeners();
    }

    submitForm() {
        if (this.$form) {
            this.$form.addClass("PostSubmit");
            FormHelpers.submitForm(this.$form[0]);
        }
    }

    _setupForm() {
        let that = this;
        this.$el.find("form").addBack("form")
            .each(
                function () {
                    that.$form = $(this);
                    // Make form submission not reload page
                    this.addEventListener("submit", function (e) {
                        let action = that.$form.attr('action'),
                            actionParts,
                            actionRel;


                        actionParts = action.split('#');
                        if (actionParts.length > 1) {
                            actionRel = `#${actionParts[1]}`;
                            e.preventDefault();
                            window.location = actionRel;
                            return false;
                        }
                        else {
                            // Action is not a router.  Just let the form do its thing
                            return true;
                        }
                    });
                }
            );
    }

    /**
     *
     */
    _registerWidgets() {
        let that = this;
        this.$el.find(".Widget")
            .each(
                function () {
                    let elem = this,
                        $elem = $(this),
                        curClass,
                        classParts,
                        ctrlType = null,
                        bindingData,
                        bindingProp = null,
                        validationData,
                        validationMethod = null,
                        widgetOptions,
                        ctrl;

                    for (let i = 0, len = elem.classList.length; i < len; ++i) {
                        curClass = elem.classList[i];
                        classParts = curClass.split("_");
                        if (classParts.length > 1 && classParts[0] === "Widget") {
                            ctrlType = classParts[1];
                        }
                    }

                    bindingData = $elem.data("binding");
                    if (bindingData && bindingData.property) {
                        bindingProp = that.context[bindingData.property];
                    }

                    validationData = $elem.data("validation");
                    if (validationData && validationData.method) {
                        validationMethod = _.bind(that.context[validationData.method], that.context);
                    }

                    widgetOptions = {value: bindingProp, validationMethod: validationMethod};

                    switch (ctrlType) {
                        case "TextBox":
                            ctrl = new TextBox(widgetOptions);
                            that.widgets.push(ctrl);
                            ctrl.show({element: elem});
                            break;
                        case "NumericTextBox":
                            ctrl = new NumericTextBox(widgetOptions);
                            that.widgets.push(ctrl);
                            ctrl.show({element: elem});
                            break;
                    }
                }
            )
    }

    /**
     * Destroys widgets and clears widget array
     * @private
     */
    _removeWidgets() {
        for (let i = 0, len = this.widgets.length; i < len; ++i) {
            this.widgets[i].destroy();
        }
        this.widgets.splice(0, this.widgets.length);
    }

    /**
     * Add event listeners
     * @private
     */
    _addListeners() {
    }

    /**
     * Remove event listeners
     * @private
     */
    _removeListeners() {
    }

    /**
     * Clean up this control.
     */
    destroy() {
        this._removeListeners();
        this._removeWidgets();
        super.destroy();
    }

    /**
     * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
     */
    _bindMethods() {
        this.submitForm = _.bind(this.submitForm, this);
    }
}
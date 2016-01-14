import IFormInputWidget from "../IFormInputWidget";
import Promise from "../../Lib/Promise";
import _ from "underscore";

/**
 * TextBox form input object
 */
export default class TextBox extends IFormInputWidget {
    constructor(options) {
        super(options);

        /**
         * Cached copy of input jQuery object.
         * @type {null}
         */
        this.$input = null;

        this.bindMethods();

        /**
         * Use to turn off "pull" functionality while pushing the value.
         * @type {boolean}
         */
        this.lockForUpdate = false;
    }

    show(options) {
        return Promise.resolve().then(() => {
                super.show(options);
            })
            .then(() => {
                this.initValue();
            })
            .then(() => {
                this.addEventListeners();
            });
    }

    getInput() {
        if (!this.$input) {
            let selector = "input[type=text], input[type=tel], input[type=number]";
            this.$input = this.$el.find(selector).addBack(selector);
        }
        return this.$input;
    }

    pushValue() {
        this.sanitize();
        this.lockForUpdate = true;
        this.value.setValue(this.getInput().val());
        this.lockForUpdate = false;
        this.validate();
    }

    pullValue() {
        if (this.lockForUpdate) {
            return;
        }

        this.getInput().val(this.value.getValue());
    }

    keyPressed(e) {
        // Enter, if there is a submit, will attempt to submit the form.
        //      Add the post-submit style class.
        if (e.which === 13) {
            let forms = this.getInput().closest("form");
            if (forms.find("input[type=submit]")[0]) {
                forms.addClass("post-submit");
            }
        }
    }

    sanitize() {

    }

    validate() {
        let test = this.validationMethod();
        if (test === null) {
            this.getInput()[0].setCustomValidity("");
            return true;
        }
        this.getInput()[0].setCustomValidity(test);
        return false;
    }

    bindMethods() {
        super.bindMethods();
        this.keyPressed = _.bind(this.keyPressed, this);
        this.pushValue = _.bind(this.pushValue, this);
        this.pullValue = _.bind(this.pullValue, this);
    }

    addEventListeners() {
        this.getInput().on("change", this.pushValue);
        this.getInput().on("keypress", this.keyPressed);
        this.getInput().on("keyup", this.pushValue);
        this.value.valueChanged.add(this.pullValue);
    }

    removeEventListeners() {
        this.getInput().off("change", this.pushValue);
        this.getInput().off("keyPressed", this.keyPressed);
        this.getInput().off("keyUp", this.pushValue);
        this.value.valueChanged.remove(this.pullValue);
    }

    destroy() {
        this.removeEventListeners();
        super.destroy();
    }
}
import IFormInputWidget from "../IFormInputWidget";
import _ from "underscore";

/**
 * TextBox form input object
 */
export default class TextBox extends IFormInputWidget {
    constructor (options) {
        super(options);
        this.bindMethods();
    }

    show (options) {
        super.show(options);
        this.addEventListeners();
    }

    pushValue () {
        this.sanitize();
        this.value.setValue(this.$el.val());
        this.validate();
    }

    pullValue() {
        this.$el.val(this.value.getValue());
    }

    keyPressed (e) {
        // Enter, if there is a submit, will attempt to submit the form.
        //      Add the post-submit style class.
        if (e.which === 13) {
            let forms = this.$el.closest("form");
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
            this.$el[0].setCustomValidity("");
            return true;
        }
        this.$el[0].setCustomValidity(test);
        return false;
    }

    bindMethods() {
        super.bindMethods();
        this.keyPressed = _.bind(this.keyPressed, this);
        this.pushValue = _.bind(this.pushValue, this);
        this.pullValue = _.bind(this.pullValue, this);
    }

    addEventListeners() {
        this.$el.on("change", this.pushValue);
        this.$el.on("keypress", this.keyPressed);
        this.$el.on("keyup", this.pushValue);
    }

    removeEventListeners() {
        this.$el.off("change", this.pushValue);
        this.$el.off("keyPressed", this.keyPressed);
        this.$el.off("keyUp", this.pushValue);
    }

    destroy() {
        this.removeEventListeners();
        super.destroy();
    }
}
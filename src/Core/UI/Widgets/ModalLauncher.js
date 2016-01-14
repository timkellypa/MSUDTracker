import TextBox from "./TextBox";
import $ from "jquery";
import * as colorbox from "jquery-colorbox";
import _ from "underscore";

/**
 * Launches a modal dialog with all the input types we need.
 * Will bind to the same types of values.
 **/
export default class ModalLauncher extends TextBox {
    constructor(options) {
        super(options);
    }

    show(options) {
        return super.show(options)
            .then(() => {
                if (colorbox) {
                    this.$modal = this.$el.find('.modal');
                    /*
                    this.$modal.colorbox({
                        inline: true,
                        width: "50%"
                    });
                    */
                }
            });
    }

    launchModal() {
        $.colorbox({href: this.$modal, inline: true});
    }

    bindMethods() {
        super.bindMethods();
        this.launchModal = _.bind(this.launchModal, this);
    }

    addEventListeners() {
        super.addEventListeners();
        this.$input.on("focus", this.launchModal);
    }

    removeEventListeners() {
        super.removeEventListeners();
        this.$input.off("focus", this.launchModal);
    }
}
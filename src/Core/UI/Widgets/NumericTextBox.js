import TextBox from "./TextBox";
import $ from "jquery";

export default class NumericTextBox extends TextBox {
    constructor(options) {
        super(options);
    }

    sanitize() {
        let val = this.$el.val(),
            newVal = "";
        for (let i = 0, len = val.length; i < len; ++i) {
            if (/\d/.test(val[i])) {
                newVal += val[i];
            }
        }
        if (newVal != val) {
            this.$el.val(newVal);
        }
    }

    syncValue() {
        super.syncValue();
    }

    keyPressed(e) {
        let key = String.fromCharCode(e.which);
        super.keyPressed(e);

        // Don't test enter
        if (e.which === 13) {
            return;
        }

        if (!(/\d/.test(key))) {
            // not numeric, cancel
            e.preventDefault();
        }
    }
}
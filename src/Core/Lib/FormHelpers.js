/**
 * Utility methods to help with form handling
 */
export default class FormHelpers {
    static submitForm(form) {
        var button = form.ownerDocument.createElement('input');
        // Hide it (style and for ATs)
        button.style.display = "none";
        button.tabIndex = -1;
        button.setAttribute("aria-hidden", "true");
        button.setAttribute("role", "presentation");
        button.type = "submit";
        form.appendChild(button).click();
        form.removeChild(button);
    }
}
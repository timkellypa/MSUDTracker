/**
 * General utility functions to help with HTML imports.
 */
export default class ImportHelpers {
    /**
     * Get the HTML "head" section from an HTML file.
     * @param {string} htmlString
     * @returns {string} contents of the "head" section of the HTML file, or an empty string if there is none.
     * @assumes a relatively valid HTML file with a single, contained "head" section, or none at all
     */
    static getHTMLHeader(htmlString) {
        var matches = /<head>([\d\s\W\S]*)<\/head>/.exec(htmlString);

        if (matches && matches.length === 2) {
            return matches[1];
        }
        return "";
    }

    /**
     * Get the HTML "body" section from an HTML file.
     * @param {string} htmlString
     * @returns {string} contents of the "body" section of the HTML file, or an empty string if there is none.
     * @assumes a relatively valid HTML file with a single, contained "body" section, or none at all
     */
    static getHTMLBody(htmlString) {
        var matches = /<body>([\d\s\W\S]*)<\/body>/.exec(htmlString);

        if (matches && matches.length === 2) {
            return matches[1];
        }
        return "";
    }
}
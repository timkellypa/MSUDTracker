import _ from "underscore";

export default class BindingHelpers {

    /**
     * Take any property named "binding", containing a property named "source"
     * and replace it with the value of the similarly named object in "context".
     * @param {IViewModel} context ViewModel containing any necessary objects
     * @param {Object|Array} dataObj object containing our data
     */
    static setBindingProperties(context, dataObj) {
        if (_.isArray(dataObj)) {
            for (let i = 0, len = dataObj.length; i < len; ++i) {
                dataObj[i] = BindingHelpers.setBindingProperties(context, dataObj[i]);
            }
        }
        else {
            for (let prop in dataObj) {
                if (dataObj.hasOwnProperty(prop)) {
                    if (typeof(dataObj[prop]) === "object") {
                        if (prop === "binding" && dataObj[prop].source) {
                            dataObj = context[dataObj[prop].source];
                        }
                        else {
                            dataObj[prop] = BindingHelpers.setBindingProperties(context, dataObj[prop]);
                        }
                    }
                }
            }
        }
        return dataObj;
    }

    static toCamelCase(str) {
        let strParts = str.split('-');
        for (let i = 1, len = strParts.length; i < len; ++i) {
            strParts[i] = strParts[i].substring(0, 1).toUpperCase() + strParts.substring(1);
        }
        return strParts.join('');
    }
}

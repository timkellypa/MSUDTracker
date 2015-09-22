
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {
    "use strict";
	var Observer = require("Core/Observer"),
		ObservableVar;
	
	/**
	 * Observable Variable.  Contains a value and allows things to register change events
	 * for when the value changes.	 
	 * @constructor
	 * @memberof window.Core
	 * @param initialValue Initial value of our variable
	 */
	ObservableVar = function(initialValue) {
		this.valueChanged = new Observer();
		this._internalValue = initialValue !== undefined ? initialValue : null;
	};
	
	ObservableVar.prototype = 
	/** @lends window.Core.ObservableVar.prototype */
	{
		constructor: ObservableVar.prototype.constructor,
		
		/**
		 * internal value
		 */
		_internalValue: null,
		
		/**
		 * Get the value
		 * @returns {Object} current value
		 */
		getValue: function() {
			return this._internalValue;
		},
		
		/**
		 * Set the value.  If the value has changed, the changed observer will fire.
		 * @param {Object} val value to set.
		 */
		setValue: function(val) {
			var curObj = this;
			if (curObj._internalValue !== val) {
				curObj._internalValue = val;
				curObj.valueChanged.fire();
			}
		},
		
		/**
		 * Observer for when the value has changed.
		 * @type window.Core.Observer
		 */
		valueChanged: null
	};
	return ObservableVar;
});
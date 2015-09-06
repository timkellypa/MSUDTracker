var define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {
    var ObservableVarTest;

    /**
     * @namespace ErrorObj Tests
     * @memberof Test.Core
     */
    ObservableVarTest = {
        execute : function() {
            var assert = require("assert");
            var ObservableVar = require("Core/ObservableVar");

            var testVar = new ObservableVar("hello");
            describe('Core.ObservableVar', function() {
                describe("#_internalValue", function() {
                    it("is correct", function() {
                        assert.equal(testVar._internalValue, "hello");
                    });
                });
                describe("#getValue()", function() {
                    it("is correct", function() {
                        assert.equal(testVar.getValue(), "hello");
                    });
                });
                describe("#setValue()", function() {
                    it("sets internal value and getValue()",
                            function() {
                                testVar.setValue("new value");
                                assert.equal(testVar._internalValue,
                                        "new value");
                                assert.equal(testVar.getValue(), "new value");
                            });
                });
                describe("#valueChanged", function() {
                    it("is fired on setValue", function(done) {
                        var obs = function() {
                            var testVal = testVar.getValue();
                            assert.equal(testVal, "another new value");
                            assert.equal(testVar.getValue(),
                                    "another new value");
                            done();
                        };
                        testVar.valueChanged.add(obs);
                        testVar.setValue("another new value");
                    });
                });
            });
        }
    };
    return ObservableVarTest;
});
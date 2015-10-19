/*globals describe, it, assert */
define(function (require) {
    "use strict";

    describe('Core.ObservableVar', function () {
        var ObservableVar = require("Core/ObservableVar"),
            testVar;

        beforeEach(function() {
            testVar = new ObservableVar("hello");
        });
        describe("#_internalValue", function () {
            it("is correct", function () {
                assert.equal(testVar._internalValue, "hello");
            });
        });
        describe("#getValue()", function () {
            it("is correct", function () {
                assert.equal(testVar.getValue(), "hello");
            });
        });
        describe("#setValue()", function () {
            it("sets internal value and getValue()",
               function () {
                   testVar.setValue("new value");
                   assert.equal(testVar._internalValue,
                                "new value");
                   assert.equal(testVar.getValue(), "new value");
               });
        });
        describe("#valueChanged", function () {
            it("is fired on setValue", function (done) {
                var obs = function () {
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
});

/*globals define, describe, it, assert */
define(function (require) {
    "use strict";
    var Observer = require("Core/Observer");

    describe('Core.Observer', function () {
        describe("#add", function () {
            it("adds a method", function () {
                var testVar = new Observer(),
                    fn;
                fn = function () {
                    return true;
                };
                testVar.add(fn);
                assert.equal(testVar._observers.length, 1);
            });
        });
        describe("#fire()", function () {
            it("fires methods added", function (done) {
                var testVar = new Observer(),
                    num = 0,
                    fn1,
                    fn2;

                fn1 = function () {
                    ++num;
                };

                fn2 = function () {
                    ++num;
                    assert.equal(num, 2);
                    done();
                };
                testVar.add(fn1);
                testVar.add(fn2);
                testVar.fire();
            });
        });
        describe("#remove()", function () {
            it("removes a function", function (done) {
                var testVar = new Observer(),
                    fn1,
                    fn2,
                    testObj,
                    fn3;

                fn1 = function () {
                    assert.equal(1, 1);
                };
                fn2 = function () {
                    assert.equal(1, 2);
                };
                fn3 = function () {
                    assert.equal(1, 1);
                    done();
                };

                testVar.add(fn1);
                testVar.add(fn2);
                testVar.add(fn3);

                testVar.remove(fn2);
                testObj = {};
                testVar.fire(testObj);
            });
        });
    });
})
;
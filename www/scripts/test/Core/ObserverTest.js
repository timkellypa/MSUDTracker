var define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    var ObserverTest;

    /**
     * @namespace ErrorObj Tests
     * @memberof Test.Core
     */
    ObserverTest = {
        execute: function () {
            var assert = require("assert");
            var Observer = require("../../Core/Observer");

            describe('Core.Observer', function () {
                describe("#add", function () {
                    it("adds a method", function () {
                        var testVar = new Observer();
                        var fn = function () {
                            return true;
                        };
                        testVar.add(fn);
                        assert.equal(testVar._observers.length, 1);
                    });
                });
                describe("#fire()", function () {
                    it("fires methods added", function (done) {
                        var testVar = new Observer();
                        var num = 0;

                        var fn1 = function () {
                            ++num;
                        };

                        var fn2 = function () {
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
                        var testVar = new Observer();
                        var fn1 = function () {
                            assert.equal(1, 1);
                        };
                        var fn2 = function () {
                            assert.equal(1, 2);
                        };
                        var fn3 = function () {
                            assert.equal(1, 1);
                            done();
                        };

                        testVar.add(fn1);
                        testVar.add(fn2);
                        testVar.add(fn3);

                        testVar.remove(fn2);
                        var testObj = {};
                        testVar.fire(testObj);
                    });
                });
            });
        }
    };
    return ObserverTest;
});
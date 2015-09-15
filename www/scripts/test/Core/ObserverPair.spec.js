/*globals describe, it, define, assert */
define(function (require) {
    "use strict";
    var Observer = require("Core/Observer"),
        ObserverPair = require("Core/ObserverPair");

    describe('Core.ObserverPair', function () {
        describe("#constructor", function () {
            it("Creates a new ObserverPair", function () {
                var obs = new Observer(),
                    fn = function () {
                        return true;
                    },
                    testVar = new ObserverPair(obs, fn);

                assert.equal(testVar instanceof ObserverPair, true);
                assert.equal(testVar.handler, fn);
                assert.equal(testVar.observer, obs);
            });
        });
        describe("#register()", function () {
            it("adds a listener to the observer", function () {
                var obs = new Observer(),
                    fn = function () {
                        return true;
                    },
                    testVar = new ObserverPair(obs, fn);

                testVar.register();

                assert.equal(obs._observers.length, 1);
            });
        });
        describe("#cancel()", function () {
            it("removes listener to the observer", function () {
                var obs = new Observer(),
                    fn = function () {
                        return true;
                    },
                    testVar = new ObserverPair(obs, fn);

                testVar.register();
                testVar.cancel();
                assert.equal(obs._observers.length, 0);
            });
        });
        describe("#destroy()", function () {
            it("calls cancel and nulls variables", function () {
                var obs = new Observer(),
                    fn = function () {
                        return true;
                    },
                    testVar = new ObserverPair(obs, fn);

                testVar.register();
                testVar.destroy();

                assert.equal(obs._observers.length, 0);
                assert.equal(testVar.handler, null);
                assert.equal(testVar.observer, null);
            });
        });
    });
});
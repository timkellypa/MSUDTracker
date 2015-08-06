define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*global describe, it */
define(function (require) {
    "use strict";
    var CallbackTest;

    /**
     * Callback Tests
     * @namespace
     * @memberof Test.Core
     */
    CallbackTest = {
        execute: function () {
            var assert = require("assert"),
                Callback = require("Core/Callback");

            describe('Core.Callback', function () {
                describe('success()', function () {
                    it('works', function () {
                        var success, cb;

                        success = function () {
                            assert.equal("success worked", "success worked");
                        };
                        cb = new Callback(success, null);
                        cb.success();
                    });
                    it("does not error when undefined", function () {
                        var cb = new Callback();
                        cb.success();
                        assert.equal(true, true);
                    });
                });
                describe('error()', function () {
                    it('works', function () {
                        var error, cb;
                        error = function () {
                            assert.equal("success worked", "success worked");
                        };
                        cb = new Callback(null, error);
                        cb.error();
                    });
                    it("does not error when undefined", function () {
                        var cb = new Callback();
                        cb.error();
                        assert.equal(true, true);
                    });
                });
            });
        }
    };
    return CallbackTest;
});
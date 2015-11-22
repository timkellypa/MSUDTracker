/*globals describe, it, assert */
define(function (require) {
    "use strict";
    var ErrorObj = require("Core/Error/ErrorObj"),
        testErr = new ErrorObj(ErrorObj.Codes.UnImplementedException,
                               "message", new Error());
    describe('Core.ErrorObj', function () {
        describe("code", function () {
            it("is correct", function () {
                assert.equal(testErr.code,
                             ErrorObj.Codes.UnImplementedException);
            });
        });
        describe("innerException", function () {
            it("is correct type", function () {
                assert.equal(testErr.innerException instanceof Error,
                             true);
            });
        });
        describe("message", function () {
            it("is correct", function () {
                assert.equal(testErr.message, "message");
            });
        });
    });
});
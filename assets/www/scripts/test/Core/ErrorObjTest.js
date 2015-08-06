var define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {
    var ErrorObjTest;

    /**
     * @namespace ErrorObj Tests
     * @memberof Test.Core
     */
    ErrorObjTest = {
        execute: function() {
            var assert = require("assert");
            var ErrorObj = require("Core/ErrorObj");

            var testErr = new ErrorObj(ErrorObj.Codes.UnImplementedException,
                    "message", new Error());
            describe('Core.ErrorObj', function() {
                describe("code", function() {
                    it("is correct", function() {
                        assert.equal(testErr.code,
                                ErrorObj.Codes.UnImplementedException);
                    });
                });
                describe("innerException", function() {
                    it("is correct type", function() {
                        assert.equal(testErr.innerException instanceof Error,
                                true);
                    });
                });
                describe("message", function() {
                    it("is correct", function() {
                        assert.equal(testErr.message, "message");
                    });
                });
            });
        }
    };
    return ErrorObjTest;
});
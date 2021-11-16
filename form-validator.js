"use strict";
exports.__esModule = true;
var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var FormValidator = /** @class */ (function () {
    function FormValidator() {
        this.errors = [];
    }
    FormValidator.prototype.isString = function (inputStr, niceName, minLength, maxLength, isEmail) {
        if (minLength === void 0) { minLength = 0; }
        if (maxLength === void 0) { maxLength = 0; }
        if (isEmail === void 0) { isEmail = false; }
        if (typeof inputStr !== "string") {
            this.errors.push("The field \"" + niceName + "\" contains a type error: Expected string, got " + typeof inputStr);
            return;
        }
        if (minLength > 0) {
            if (inputStr.length < minLength) {
                this.errors.push("The field \"" + niceName + "\" must contain at least " + minLength + " characters");
                return;
            }
        }
        if (maxLength > 0) {
            if (inputStr.length > maxLength) {
                this.errors.push("The field \"" + niceName + "\" must not contain more than " + minLength + " characters");
                return;
            }
        }
        if (isEmail === true) {
            if (re.test(inputStr) === false) {
                this.errors.push("The field \"" + niceName + "\" must not contain more than " + minLength + " characters");
                return;
            }
        }
    };
    return FormValidator;
}());
exports["default"] = FormValidator;

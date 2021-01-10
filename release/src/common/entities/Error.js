"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["NOT_AUTHENTICATED"] = 1] = "NOT_AUTHENTICATED";
    ErrorCodes[ErrorCodes["ALREADY_AUTHENTICATED"] = 2] = "ALREADY_AUTHENTICATED";
    ErrorCodes[ErrorCodes["NOT_AUTHORISED"] = 3] = "NOT_AUTHORISED";
    ErrorCodes[ErrorCodes["PERMISSION_DENIED"] = 4] = "PERMISSION_DENIED";
    ErrorCodes[ErrorCodes["CREDENTIAL_NOT_FOUND"] = 5] = "CREDENTIAL_NOT_FOUND";
    ErrorCodes[ErrorCodes["USER_CREATION_ERROR"] = 6] = "USER_CREATION_ERROR";
    ErrorCodes[ErrorCodes["GENERAL_ERROR"] = 7] = "GENERAL_ERROR";
    ErrorCodes[ErrorCodes["THUMBNAIL_GENERATION_ERROR"] = 8] = "THUMBNAIL_GENERATION_ERROR";
    ErrorCodes[ErrorCodes["PERSON_ERROR"] = 9] = "PERSON_ERROR";
    ErrorCodes[ErrorCodes["SERVER_ERROR"] = 10] = "SERVER_ERROR";
    ErrorCodes[ErrorCodes["USER_MANAGEMENT_DISABLED"] = 11] = "USER_MANAGEMENT_DISABLED";
    ErrorCodes[ErrorCodes["INPUT_ERROR"] = 12] = "INPUT_ERROR";
    ErrorCodes[ErrorCodes["SETTINGS_ERROR"] = 13] = "SETTINGS_ERROR";
    ErrorCodes[ErrorCodes["TASK_ERROR"] = 14] = "TASK_ERROR";
    ErrorCodes[ErrorCodes["JOB_ERROR"] = 15] = "JOB_ERROR";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
class ErrorDTO {
    constructor(code, message, details, req) {
        this.code = code;
        this.message = message;
        this.details = details;
        this.request = { method: '', url: '' };
        this.detailsStr = (this.details ? this.details.toString() : '') || ErrorCodes[code];
        if (req) {
            this.request = {
                method: req.method,
                url: req.url
            };
        }
    }
    toString() {
        return '[' + ErrorCodes[this.code] + '] ' + this.message + this.detailsStr;
    }
}
exports.ErrorDTO = ErrorDTO;

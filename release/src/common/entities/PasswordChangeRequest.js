"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModificationRequest_1 = require("./UserModificationRequest");
class PasswordChangeRequest extends UserModificationRequest_1.UserModificationRequest {
    constructor(id, oldPassword, newPassword) {
        super(id);
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
}
exports.PasswordChangeRequest = PasswordChangeRequest;

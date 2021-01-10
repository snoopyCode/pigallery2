"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
class PasswordHelper {
    static cryptPassword(password) {
        const salt = bcrypt.genSaltSync(9);
        return bcrypt.hashSync(password, salt);
    }
    static comparePassword(password, encryptedPassword) {
        try {
            return bcrypt.compareSync(password, encryptedPassword);
        }
        catch (e) {
        }
        return false;
    }
}
exports.PasswordHelper = PasswordHelper;

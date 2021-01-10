"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginCredential {
    constructor(username = '', password = '', rememberMe = false) {
        this.username = username;
        this.password = password;
        this.rememberMe = rememberMe;
    }
}
exports.LoginCredential = LoginCredential;

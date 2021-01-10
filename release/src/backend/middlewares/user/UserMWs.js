"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../../../common/entities/Error");
const ObjectManagers_1 = require("../../model/ObjectManagers");
const Utils_1 = require("../../../common/Utils");
const Config_1 = require("../../../common/config/private/Config");
class UserMWs {
    static changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.authenticationRequired === false) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.USER_MANAGEMENT_DISABLED));
            }
            if ((typeof req.body === 'undefined') || (typeof req.body.userModReq === 'undefined')
                || (typeof req.body.userModReq.id === 'undefined')
                || (typeof req.body.userModReq.oldPassword === 'undefined')
                || (typeof req.body.userModReq.newPassword === 'undefined')) {
                return next();
            }
            try {
                yield ObjectManagers_1.ObjectManagers.getInstance().UserManager.changePassword(req.body.userModReq);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, null, err));
            }
        });
    }
    static createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.authenticationRequired === false) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.USER_MANAGEMENT_DISABLED));
            }
            if ((typeof req.body === 'undefined') || (typeof req.body.newUser === 'undefined')) {
                return next();
            }
            try {
                yield ObjectManagers_1.ObjectManagers.getInstance().UserManager.createUser(req.body.newUser);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.USER_CREATION_ERROR, null, err));
            }
        });
    }
    static deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.authenticationRequired === false) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.USER_MANAGEMENT_DISABLED));
            }
            if ((typeof req.params === 'undefined') || (typeof req.params.id === 'undefined')) {
                return next();
            }
            try {
                yield ObjectManagers_1.ObjectManagers.getInstance().UserManager.deleteUser(parseInt(req.params.id, 10));
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, null, err));
            }
        });
    }
    static changeRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.authenticationRequired === false) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.USER_MANAGEMENT_DISABLED));
            }
            if ((typeof req.params === 'undefined') || (typeof req.params.id === 'undefined')
                || (typeof req.body === 'undefined') || (typeof req.body.newRole === 'undefined')) {
                return next();
            }
            try {
                yield ObjectManagers_1.ObjectManagers.getInstance().UserManager.changeRole(parseInt(req.params.id, 10), req.body.newRole);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, null, err));
            }
        });
    }
    static listUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.authenticationRequired === false) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.USER_MANAGEMENT_DISABLED));
            }
            try {
                let result = yield ObjectManagers_1.ObjectManagers.getInstance().UserManager.find({});
                result = Utils_1.Utils.clone(result);
                for (let i = 0; i < result.length; i++) {
                    result[i].password = '';
                }
                req.resultPipe = result;
                next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, null, err));
            }
        });
    }
}
exports.UserMWs = UserMWs;

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
const UserDTO_1 = require("../../../common/entities/UserDTO");
const ObjectManagers_1 = require("../../model/ObjectManagers");
class UserRequestConstrainsMWs {
    static forceSelfRequest(req, res, next) {
        if ((typeof req.params === 'undefined') || (typeof req.params.id === 'undefined')) {
            return next();
        }
        if (req.session.user.id !== parseInt(req.params.id, 10)) {
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.NOT_AUTHORISED));
        }
        return next();
    }
    static notSelfRequest(req, res, next) {
        if ((typeof req.params === 'undefined') || (typeof req.params.id === 'undefined')) {
            return next();
        }
        if (req.session.user.id === parseInt(req.params.id, 10)) {
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.NOT_AUTHORISED));
        }
        return next();
    }
    static notSelfRequestOr2Admins(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.params === 'undefined') || (typeof req.params.id === 'undefined')) {
                return next();
            }
            if (req.session.user.id !== parseInt(req.params.id, 10)) {
                return next();
            }
            // TODO: fix it!
            try {
                const result = yield ObjectManagers_1.ObjectManagers.getInstance().UserManager.find({ minRole: UserDTO_1.UserRoles.Admin });
                if (result.length <= 1) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR));
                }
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR));
            }
        });
    }
}
exports.UserRequestConstrainsMWs = UserRequestConstrainsMWs;

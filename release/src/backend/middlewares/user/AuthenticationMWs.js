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
const Config_1 = require("../../../common/config/private/Config");
const PasswordHelper_1 = require("../../model/PasswordHelper");
const Utils_1 = require("../../../common/Utils");
const QueryParams_1 = require("../../../common/QueryParams");
const path = require("path");
class AuthenticationMWs {
    static tryAuthenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.authenticationRequired === false) {
                req.session.user = { name: UserDTO_1.UserRoles[Config_1.Config.Client.unAuthenticatedUserRole], role: Config_1.Config.Client.unAuthenticatedUserRole };
                return next();
            }
            try {
                const user = yield AuthenticationMWs.getSharingUser(req);
                if (!!user) {
                    req.session.user = user;
                    return next();
                }
            }
            catch (err) {
            }
            return next();
        });
    }
    static authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.authenticationRequired === false) {
                req.session.user = { name: UserDTO_1.UserRoles[Config_1.Config.Client.unAuthenticatedUserRole], role: Config_1.Config.Client.unAuthenticatedUserRole };
                return next();
            }
            // if already authenticated, do not try to use sharing authentication
            if (typeof req.session.user !== 'undefined') {
                return next();
            }
            try {
                const user = yield AuthenticationMWs.getSharingUser(req);
                if (!!user) {
                    req.session.user = user;
                    return next();
                }
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.CREDENTIAL_NOT_FOUND, null, err));
            }
            if (typeof req.session.user === 'undefined') {
                res.status(401);
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.NOT_AUTHENTICATED, 'Not authenticated'));
            }
            return next();
        });
    }
    static normalizePathParam(paramName) {
        return function normalizePathParam(req, res, next) {
            req.params[paramName] = path.normalize(req.params[paramName] || path.sep).replace(/^(\.\.[\/\\])+/, '');
            return next();
        };
    }
    static authorisePath(paramName, isDirectory) {
        return function authorisePath(req, res, next) {
            let p = req.params[paramName];
            if (!isDirectory) {
                p = path.dirname(p);
            }
            if (!UserDTO_1.UserDTO.isDirectoryPathAvailable(p, req.session.user.permissions)) {
                return res.sendStatus(403);
            }
            return next();
        };
    }
    static authorise(role) {
        return function authorise(req, res, next) {
            if (req.session.user.role < role) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.NOT_AUTHORISED));
            }
            return next();
        };
    }
    static shareLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Sharing.enabled === false) {
                return next();
            }
            // not enough parameter
            if ((!req.query[QueryParams_1.QueryParams.gallery.sharingKey_query] && !req.params[QueryParams_1.QueryParams.gallery.sharingKey_params])) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'no sharing key provided'));
            }
            try {
                const password = (req.body ? req.body.password : null) || null;
                const sharingKey = req.query[QueryParams_1.QueryParams.gallery.sharingKey_query] || req.params[QueryParams_1.QueryParams.gallery.sharingKey_params];
                const sharing = yield ObjectManagers_1.ObjectManagers.getInstance().SharingManager.findOne({
                    sharingKey: sharingKey
                });
                if (!sharing || sharing.expires < Date.now() ||
                    (Config_1.Config.Client.Sharing.passwordProtected === true
                        && (sharing.password)
                        && !PasswordHelper_1.PasswordHelper.comparePassword(password, sharing.password))) {
                    res.status(401);
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.CREDENTIAL_NOT_FOUND));
                }
                let sharingPath = sharing.path;
                if (sharing.includeSubfolders === true) {
                    sharingPath += '*';
                }
                req.session.user = {
                    name: 'Guest',
                    role: UserDTO_1.UserRoles.LimitedGuest,
                    permissions: [sharingPath],
                    usedSharingKey: sharing.sharingKey
                };
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, null, err));
            }
        });
    }
    static inverseAuthenticate(req, res, next) {
        if (typeof req.session.user !== 'undefined') {
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.ALREADY_AUTHENTICATED));
        }
        return next();
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.authenticationRequired === false) {
                return res.sendStatus(404);
            }
            // not enough parameter
            if ((typeof req.body === 'undefined') ||
                (typeof req.body.loginCredential === 'undefined') ||
                (typeof req.body.loginCredential.username === 'undefined') ||
                (typeof req.body.loginCredential.password === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'not all parameters are included for loginCredential'));
            }
            try {
                // lets find the user
                const user = Utils_1.Utils.clone(yield ObjectManagers_1.ObjectManagers.getInstance().UserManager.findOne({
                    name: req.body.loginCredential.username,
                    password: req.body.loginCredential.password
                }));
                delete (user.password);
                req.session.user = user;
                if (req.body.loginCredential.rememberMe) {
                    req.sessionOptions.expires = new Date(Date.now() + Config_1.Config.Server.sessionTimeout);
                }
                return next();
            }
            catch (err) {
                console.error(err);
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.CREDENTIAL_NOT_FOUND, 'credentials not found during login'));
            }
        });
    }
    static logout(req, res, next) {
        delete req.session.user;
        return next();
    }
    static getSharingUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Sharing.enabled === true &&
                (!!req.query[QueryParams_1.QueryParams.gallery.sharingKey_query] || !!req.params[QueryParams_1.QueryParams.gallery.sharingKey_params])) {
                const sharingKey = req.query[QueryParams_1.QueryParams.gallery.sharingKey_query] || req.params[QueryParams_1.QueryParams.gallery.sharingKey_params];
                const sharing = yield ObjectManagers_1.ObjectManagers.getInstance().SharingManager.findOne({
                    sharingKey: sharingKey
                });
                if (!sharing || sharing.expires < Date.now()) {
                    return null;
                }
                if (Config_1.Config.Client.Sharing.passwordProtected === true && sharing.password) {
                    return null;
                }
                let sharingPath = sharing.path;
                if (sharing.includeSubfolders === true) {
                    sharingPath += '*';
                }
                return {
                    name: 'Guest',
                    role: UserDTO_1.UserRoles.LimitedGuest,
                    permissions: [sharingPath],
                    usedSharingKey: sharing.sharingKey
                };
            }
            return null;
        });
    }
}
exports.AuthenticationMWs = AuthenticationMWs;

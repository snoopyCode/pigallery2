"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../../common/entities/Error");
const Message_1 = require("../../common/entities/Message");
const Config_1 = require("../../common/config/private/Config");
const UserDTO_1 = require("../../common/entities/UserDTO");
const NotifocationManager_1 = require("../model/NotifocationManager");
const Logger_1 = require("../Logger");
const Utils_1 = require("../../common/Utils");
const LoggerRouter_1 = require("../routes/LoggerRouter");
class RenderingMWs {
    static renderResult(req, res, next) {
        if (typeof req.resultPipe === 'undefined') {
            return next();
        }
        return RenderingMWs.renderMessage(res, req.resultPipe);
    }
    static renderSessionUser(req, res, next) {
        if (!(req.session.user)) {
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'User not exists'));
        }
        const user = {
            id: req.session.user.id,
            name: req.session.user.name,
            csrfToken: req.session.user.csrfToken || req.csrfToken(),
            role: req.session.user.role,
            usedSharingKey: req.session.user.usedSharingKey,
            permissions: req.session.user.permissions
        };
        if (!user.csrfToken && req.csrfToken) {
            user.csrfToken = req.csrfToken();
        }
        RenderingMWs.renderMessage(res, user);
    }
    static renderSharing(req, res, next) {
        if (!req.resultPipe) {
            return next();
        }
        const _a = req.resultPipe, { password, creator } = _a, sharing = __rest(_a, ["password", "creator"]);
        RenderingMWs.renderMessage(res, sharing);
    }
    static renderSharingList(req, res, next) {
        if (!req.resultPipe) {
            return next();
        }
        const shares = Utils_1.Utils.clone(req.resultPipe);
        shares.forEach(s => {
            delete s.password;
            delete s.creator.password;
        });
        return RenderingMWs.renderMessage(res, shares);
    }
    static renderFile(req, res, next) {
        if (!req.resultPipe) {
            return next();
        }
        return res.sendFile(req.resultPipe, { maxAge: 31536000, dotfiles: 'allow' });
    }
    static renderOK(req, res, next) {
        const message = new Message_1.Message(null, 'ok');
        res.json(message);
    }
    static renderConfig(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalConf = yield Config_1.Config.original();
            originalConf.Server.sessionSecret = null;
            const message = new Message_1.Message(null, originalConf.toJSON({
                attachState: true,
                attachVolatile: true
            }));
            res.json(message);
        });
    }
    static renderError(err, req, res, next) {
        if (err instanceof Error_1.ErrorDTO) {
            if (err.details) {
                Logger_1.Logger.warn('Handled error:');
                LoggerRouter_1.LoggerRouter.log(Logger_1.Logger.warn, req, res);
                console.log(err);
                delete (err.details); // do not send back error object to the client side
                // hide error details for non developers
                if (!(req.session.user && req.session.user.role >= UserDTO_1.UserRoles.Developer)) {
                    delete (err.detailsStr);
                }
            }
            const message = new Message_1.Message(err, null);
            return res.json(message);
        }
        NotifocationManager_1.NotificationManager.error('Unknown server error', err, req);
        return next(err);
    }
    static renderMessage(res, content) {
        const message = new Message_1.Message(null, content);
        res.json(message);
    }
}
exports.RenderingMWs = RenderingMWs;

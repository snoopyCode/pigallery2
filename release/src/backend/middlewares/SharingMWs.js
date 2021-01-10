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
const ObjectManagers_1 = require("../model/ObjectManagers");
const Error_1 = require("../../common/entities/Error");
const Config_1 = require("../../common/config/private/Config");
const QueryParams_1 = require("../../common/QueryParams");
const path = require("path");
const UserDTO_1 = require("../../common/entities/UserDTO");
class SharingMWs {
    static getSharing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Sharing.enabled === false) {
                return next();
            }
            const sharingKey = req.params[QueryParams_1.QueryParams.gallery.sharingKey_params];
            try {
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance().SharingManager.findOne({ sharingKey: sharingKey });
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during retrieving sharing link', err));
            }
        });
    }
    static createSharing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Sharing.enabled === false) {
                return next();
            }
            if ((typeof req.body === 'undefined') || (typeof req.body.createSharing === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'createSharing filed is missing'));
            }
            const createSharing = req.body.createSharing;
            let sharingKey = SharingMWs.generateKey();
            // create one not yet used
            while (true) {
                try {
                    yield ObjectManagers_1.ObjectManagers.getInstance().SharingManager.findOne({ sharingKey: sharingKey });
                    sharingKey = this.generateKey();
                }
                catch (err) {
                    break;
                }
            }
            const directoryName = path.normalize(req.params.directory || '/');
            const sharing = {
                id: null,
                sharingKey: sharingKey,
                path: directoryName,
                password: createSharing.password,
                creator: req.session.user,
                expires: Date.now() + createSharing.valid,
                includeSubfolders: createSharing.includeSubfolders,
                timeStamp: Date.now()
            };
            try {
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance().SharingManager.createSharing(sharing);
                return next();
            }
            catch (err) {
                console.warn(err);
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during creating sharing link', err));
            }
        });
    }
    static updateSharing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Sharing.enabled === false) {
                return next();
            }
            if ((typeof req.body === 'undefined') || (typeof req.body.updateSharing === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'updateSharing filed is missing'));
            }
            const updateSharing = req.body.updateSharing;
            const directoryName = path.normalize(req.params.directory || '/');
            const sharing = {
                id: updateSharing.id,
                path: directoryName,
                sharingKey: '',
                password: (updateSharing.password && updateSharing.password !== '') ? updateSharing.password : null,
                creator: req.session.user,
                expires: Date.now() + updateSharing.valid,
                includeSubfolders: updateSharing.includeSubfolders,
                timeStamp: Date.now()
            };
            try {
                const forceUpdate = req.session.user.role >= UserDTO_1.UserRoles.Admin;
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance().SharingManager.updateSharing(sharing, forceUpdate);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during updating sharing link', err));
            }
        });
    }
    static deleteSharing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Sharing.enabled === false) {
                return next();
            }
            if ((typeof req.params === 'undefined') || (typeof req.params.sharingKey === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'sharingKey is missing'));
            }
            const sharingKey = req.params.sharingKey;
            try {
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance().SharingManager.deleteSharing(sharingKey);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during deleting sharing', err));
            }
        });
    }
    static listSharing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Sharing.enabled === false) {
                return next();
            }
            try {
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance().SharingManager.listAll();
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during listing shares', err));
            }
        });
    }
    static generateKey() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4();
    }
}
exports.SharingMWs = SharingMWs;

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
const CustomHeaders_1 = require("../../common/CustomHeaders");
class VersionMWs {
    /**
     * This version data is mainly used on the client side to invalidate the cache
     * @param req
     * @param res
     * @param next
     */
    static injectGalleryVersion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.header(CustomHeaders_1.CustomHeaders.dataVersion, yield ObjectManagers_1.ObjectManagers.getInstance().VersionManager.getDataVersion());
                next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Can not get data version', err.toString()));
            }
        });
    }
}
exports.VersionMWs = VersionMWs;

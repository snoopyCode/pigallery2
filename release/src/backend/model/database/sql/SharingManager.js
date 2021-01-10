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
const SQLConnection_1 = require("./SQLConnection");
const SharingEntity_1 = require("./enitites/SharingEntity");
const Config_1 = require("../../../../common/config/private/Config");
const PasswordHelper_1 = require("../../PasswordHelper");
class SharingManager {
    static removeExpiredLink() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return yield connection
                .getRepository(SharingEntity_1.SharingEntity)
                .createQueryBuilder('share')
                .where('expires < :now', { now: Date.now() })
                .delete()
                .execute();
        });
    }
    deleteSharing(sharingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const sharing = yield connection.getRepository(SharingEntity_1.SharingEntity).findOne({ sharingKey: sharingKey });
            yield connection.getRepository(SharingEntity_1.SharingEntity).remove(sharing);
        });
    }
    listAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield SharingManager.removeExpiredLink();
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return yield connection.getRepository(SharingEntity_1.SharingEntity)
                .createQueryBuilder('share')
                .leftJoinAndSelect('share.creator', 'creator').getMany();
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SharingManager.removeExpiredLink();
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return yield connection.getRepository(SharingEntity_1.SharingEntity).findOne(filter);
        });
    }
    createSharing(sharing) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SharingManager.removeExpiredLink();
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            if (sharing.password) {
                sharing.password = PasswordHelper_1.PasswordHelper.cryptPassword(sharing.password);
            }
            return connection.getRepository(SharingEntity_1.SharingEntity).save(sharing);
        });
    }
    updateSharing(inSharing, forceUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const sharing = yield connection.getRepository(SharingEntity_1.SharingEntity).findOne({
                id: inSharing.id,
                creator: inSharing.creator.id,
                path: inSharing.path
            });
            if (sharing.timeStamp < Date.now() - Config_1.Config.Server.Sharing.updateTimeout && forceUpdate !== true) {
                throw new Error('Sharing is locked, can\'t update anymore');
            }
            if (inSharing.password == null) {
                sharing.password = null;
            }
            else {
                sharing.password = PasswordHelper_1.PasswordHelper.cryptPassword(inSharing.password);
            }
            sharing.includeSubfolders = inSharing.includeSubfolders;
            sharing.expires = inSharing.expires;
            return connection.getRepository(SharingEntity_1.SharingEntity).save(sharing);
        });
    }
}
exports.SharingManager = SharingManager;

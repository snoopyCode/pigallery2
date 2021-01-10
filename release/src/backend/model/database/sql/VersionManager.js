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
const crypto = require("crypto");
const DataStructureVersion_1 = require("../../../../common/DataStructureVersion");
const SQLConnection_1 = require("./SQLConnection");
const DirectoryEntity_1 = require("./enitites/DirectoryEntity");
const MediaEntity_1 = require("./enitites/MediaEntity");
class VersionManager {
    constructor() {
        this.allMediaCount = 0;
        this.latestDirectoryStatus = null;
    }
    getDataVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.latestDirectoryStatus === null) {
                yield this.updateDataVersion();
            }
            if (!this.latestDirectoryStatus) {
                return DataStructureVersion_1.DataStructureVersion.toString();
            }
            const versionString = DataStructureVersion_1.DataStructureVersion + '_' +
                this.latestDirectoryStatus.name + '_' +
                this.latestDirectoryStatus.lastModified + '_' +
                this.latestDirectoryStatus.mediaCount + '_' +
                this.allMediaCount;
            return crypto.createHash('md5').update(versionString).digest('hex');
        });
    }
    updateDataVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const dir = yield connection.getRepository(DirectoryEntity_1.DirectoryEntity)
                .createQueryBuilder('directory')
                .limit(1)
                .orderBy('directory.lastModified').getOne();
            this.allMediaCount = yield connection.getRepository(MediaEntity_1.MediaEntity)
                .createQueryBuilder('media').getCount();
            if (!dir) {
                return;
            }
            this.latestDirectoryStatus = {
                mediaCount: dir.mediaCount,
                lastModified: dir.lastModified,
                name: dir.name
            };
        });
    }
}
exports.VersionManager = VersionManager;

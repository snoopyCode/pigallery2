"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const DiskManger_1 = require("../../DiskManger");
const ProjectPath_1 = require("../../../ProjectPath");
const Config_1 = require("../../../../common/config/private/Config");
const DiskMangerWorker_1 = require("../../threading/DiskMangerWorker");
const PrivateConfig_1 = require("../../../../common/config/private/PrivateConfig");
class GalleryManager {
    listDirectory(relativeDirectoryName, knownLastModified, knownLastScanned) {
        // If it seems that the content did not changed, do not work on it
        if (knownLastModified && knownLastScanned) {
            const stat = fs.statSync(path.join(ProjectPath_1.ProjectPath.ImageFolder, relativeDirectoryName));
            const lastModified = DiskMangerWorker_1.DiskMangerWorker.calcLastModified(stat);
            if (Date.now() - knownLastScanned <= Config_1.Config.Server.Indexing.cachedFolderTimeout &&
                lastModified === knownLastModified &&
                Config_1.Config.Server.Indexing.reIndexingSensitivity < PrivateConfig_1.ServerConfig.ReIndexingSensitivity.high) {
                return Promise.resolve(null);
            }
        }
        return DiskManger_1.DiskManager.scanDirectory(relativeDirectoryName);
    }
    getRandomPhoto(queryFilter) {
        throw new Error('Random media is not supported without database');
    }
}
exports.GalleryManager = GalleryManager;

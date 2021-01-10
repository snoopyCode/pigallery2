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
const fs_1 = require("fs");
const path = require("path");
const ProjectPath_1 = require("../../ProjectPath");
const Config_1 = require("../../../common/config/private/Config");
const MetadataLoader_1 = require("./MetadataLoader");
const Logger_1 = require("../../Logger");
const SupportedFormats_1 = require("../../../common/SupportedFormats");
const VideoProcessing_1 = require("../fileprocessing/VideoProcessing");
const PhotoProcessing_1 = require("../fileprocessing/PhotoProcessing");
class DiskMangerWorker {
    static calcLastModified(stat) {
        return Math.max(stat.ctime.getTime(), stat.mtime.getTime());
    }
    static normalizeDirPath(dirPath) {
        return path.normalize(path.join('.' + path.sep, dirPath));
    }
    static pathFromRelativeDirName(relativeDirectoryName) {
        return path.join(path.dirname(this.normalizeDirPath(relativeDirectoryName)), path.sep);
    }
    static pathFromParent(parent) {
        return path.join(this.normalizeDirPath(path.join(parent.path, parent.name)), path.sep);
    }
    static dirName(name) {
        if (name.trim().length === 0) {
            return '.';
        }
        return path.basename(name);
    }
    static excludeDir(name, relativeDirectoryName, absoluteDirectoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Server.Indexing.excludeFolderList.length === 0 &&
                Config_1.Config.Server.Indexing.excludeFileList.length === 0) {
                return false;
            }
            const absoluteName = path.normalize(path.join(absoluteDirectoryName, name));
            const relativeName = path.normalize(path.join(relativeDirectoryName, name));
            for (let j = 0; j < Config_1.Config.Server.Indexing.excludeFolderList.length; j++) {
                const exclude = Config_1.Config.Server.Indexing.excludeFolderList[j];
                if (exclude.startsWith('/')) {
                    if (exclude === absoluteName) {
                        return true;
                    }
                }
                else if (exclude.includes('/')) {
                    if (path.normalize(exclude) === relativeName) {
                        return true;
                    }
                }
                else {
                    if (exclude === name) {
                        return true;
                    }
                }
            }
            // exclude dirs that have the given files (like .ignore)
            for (let j = 0; j < Config_1.Config.Server.Indexing.excludeFileList.length; j++) {
                const exclude = Config_1.Config.Server.Indexing.excludeFileList[j];
                try {
                    yield fs_1.promises.access(path.join(absoluteName, exclude));
                    return true;
                }
                catch (e) {
                }
            }
            return false;
        });
    }
    static scanDirectoryNoMetadata(relativeDirectoryName, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            settings.noMetadata = true;
            return this.scanDirectory(relativeDirectoryName, settings);
        });
    }
    static scanDirectory(relativeDirectoryName, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            relativeDirectoryName = this.normalizeDirPath(relativeDirectoryName);
            const directoryName = DiskMangerWorker.dirName(relativeDirectoryName);
            const directoryParent = this.pathFromRelativeDirName(relativeDirectoryName);
            const absoluteDirectoryName = path.join(ProjectPath_1.ProjectPath.ImageFolder, relativeDirectoryName);
            const stat = yield fs_1.promises.stat(path.join(ProjectPath_1.ProjectPath.ImageFolder, relativeDirectoryName));
            const directory = {
                id: null,
                parent: null,
                name: directoryName,
                path: directoryParent,
                lastModified: this.calcLastModified(stat),
                lastScanned: Date.now(),
                directories: [],
                isPartial: false,
                mediaCount: 0,
                media: [],
                metaFile: []
            };
            // nothing to scan, we are here for the empty dir
            if (settings.noPhoto === true && settings.noMetadata === true && settings.noVideo === true) {
                return directory;
            }
            const list = yield fs_1.promises.readdir(absoluteDirectoryName);
            for (let i = 0; i < list.length; i++) {
                const file = list[i];
                const fullFilePath = path.normalize(path.join(absoluteDirectoryName, file));
                if ((yield fs_1.promises.stat(fullFilePath)).isDirectory()) {
                    if (settings.noDirectory === true ||
                        (yield DiskMangerWorker.excludeDir(file, relativeDirectoryName, absoluteDirectoryName))) {
                        continue;
                    }
                    // create preview directory
                    const d = yield DiskMangerWorker.scanDirectory(path.join(relativeDirectoryName, file), {
                        maxPhotos: Config_1.Config.Server.Indexing.folderPreviewSize,
                        noMetaFile: true,
                        noVideo: true,
                        noDirectory: true,
                        noPhoto: settings.noChildDirPhotos || settings.noPhoto
                    });
                    d.lastScanned = 0; // it was not a fully scan
                    d.isPartial = true;
                    directory.directories.push(d);
                }
                else if (PhotoProcessing_1.PhotoProcessing.isPhoto(fullFilePath)) {
                    if (settings.noPhoto === true) {
                        continue;
                    }
                    directory.media.push({
                        name: file,
                        directory: null,
                        metadata: settings.noMetadata === true ? null : yield MetadataLoader_1.MetadataLoader.loadPhotoMetadata(fullFilePath)
                    });
                    if (settings.maxPhotos && directory.media.length > settings.maxPhotos) {
                        break;
                    }
                }
                else if (VideoProcessing_1.VideoProcessing.isVideo(fullFilePath)) {
                    if (Config_1.Config.Client.Media.Video.enabled === false || settings.noVideo === true) {
                        continue;
                    }
                    try {
                        directory.media.push({
                            name: file,
                            directory: null,
                            metadata: settings.noMetadata === true ? null : yield MetadataLoader_1.MetadataLoader.loadVideoMetadata(fullFilePath)
                        });
                    }
                    catch (e) {
                        Logger_1.Logger.warn('Media loading error, skipping: ' + file + ', reason: ' + e.toString());
                    }
                }
                else if (DiskMangerWorker.isMetaFile(fullFilePath)) {
                    if (Config_1.Config.Client.MetaFile.enabled === false || settings.noMetaFile === true) {
                        continue;
                    }
                    directory.metaFile.push({
                        name: file,
                        directory: null,
                    });
                }
            }
            directory.mediaCount = directory.media.length;
            return directory;
        });
    }
    static isMetaFile(fullPath) {
        const extension = path.extname(fullPath).toLowerCase();
        return SupportedFormats_1.SupportedFormats.WithDots.MetaFiles.indexOf(extension) !== -1;
    }
}
exports.DiskMangerWorker = DiskMangerWorker;

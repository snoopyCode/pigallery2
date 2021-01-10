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
const path = require("path");
const fs_1 = require("fs");
const os = require("os");
const crypto = require("crypto");
const ProjectPath_1 = require("../../ProjectPath");
const Config_1 = require("../../../common/config/private/Config");
const PhotoWorker_1 = require("../threading/PhotoWorker");
const TaskExecuter_1 = require("../threading/TaskExecuter");
const SupportedFormats_1 = require("../../../common/SupportedFormats");
class PhotoProcessing {
    static init() {
        if (this.initDone === true) {
            return;
        }
        if (Config_1.Config.Server.Threading.enabled === true) {
            if (Config_1.Config.Server.Threading.thumbnailThreads > 0) {
                Config_1.Config.Client.Media.Thumbnail.concurrentThumbnailGenerations = Config_1.Config.Server.Threading.thumbnailThreads;
            }
            else {
                Config_1.Config.Client.Media.Thumbnail.concurrentThumbnailGenerations = Math.max(1, os.cpus().length - 1);
            }
        }
        else {
            Config_1.Config.Client.Media.Thumbnail.concurrentThumbnailGenerations = 1;
        }
        this.taskQue = new TaskExecuter_1.TaskExecuter(Config_1.Config.Client.Media.Thumbnail.concurrentThumbnailGenerations, (input => PhotoWorker_1.PhotoWorker.render(input)));
        this.initDone = true;
    }
    static generatePersonThumbnail(person) {
        return __awaiter(this, void 0, void 0, function* () {
            // load parameters
            const photo = person.sampleRegion.media;
            const mediaPath = path.join(ProjectPath_1.ProjectPath.ImageFolder, photo.directory.path, photo.directory.name, photo.name);
            const size = Config_1.Config.Client.Media.Thumbnail.personThumbnailSize;
            // generate thumbnail path
            const thPath = PhotoProcessing.generatePersonThumbnailPath(mediaPath, person.sampleRegion, size);
            // check if thumbnail already exist
            try {
                yield fs_1.promises.access(thPath, fs_1.constants.R_OK);
                return thPath;
            }
            catch (e) {
            }
            const margin = {
                x: Math.round(person.sampleRegion.box.width * (Config_1.Config.Server.Media.Thumbnail.personFaceMargin)),
                y: Math.round(person.sampleRegion.box.height * (Config_1.Config.Server.Media.Thumbnail.personFaceMargin))
            };
            // run on other thread
            const input = {
                type: PhotoWorker_1.ThumbnailSourceType.Photo,
                mediaPath: mediaPath,
                size: size,
                outPath: thPath,
                makeSquare: false,
                cut: {
                    left: Math.round(Math.max(0, person.sampleRegion.box.left - margin.x / 2)),
                    top: Math.round(Math.max(0, person.sampleRegion.box.top - margin.y / 2)),
                    width: person.sampleRegion.box.width + margin.x,
                    height: person.sampleRegion.box.height + margin.y
                },
                qualityPriority: Config_1.Config.Server.Media.Thumbnail.qualityPriority
            };
            input.cut.width = Math.min(input.cut.width, photo.metadata.size.width - input.cut.left);
            input.cut.height = Math.min(input.cut.height, photo.metadata.size.height - input.cut.top);
            yield fs_1.promises.mkdir(ProjectPath_1.ProjectPath.FacesFolder, { recursive: true });
            yield PhotoProcessing.taskQue.execute(input);
            return thPath;
        });
    }
    static generateConvertedPath(mediaPath, size) {
        const file = path.basename(mediaPath);
        return path.join(ProjectPath_1.ProjectPath.TranscodedFolder, ProjectPath_1.ProjectPath.getRelativePathToImages(path.dirname(mediaPath)), file + '_' + size + '.jpg');
    }
    static generatePersonThumbnailPath(mediaPath, faceRegion, size) {
        return path.join(ProjectPath_1.ProjectPath.FacesFolder, crypto.createHash('md5').update(mediaPath + '_' + faceRegion.name + '_' + faceRegion.box.left + '_' + faceRegion.box.top)
            .digest('hex') + '_' + size + '.jpg');
    }
    static isValidConvertedPath(convertedPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const origFilePath = path.join(ProjectPath_1.ProjectPath.ImageFolder, path.relative(ProjectPath_1.ProjectPath.TranscodedFolder, convertedPath.substring(0, convertedPath.lastIndexOf('_'))));
            const sizeStr = convertedPath.substring(convertedPath.lastIndexOf('_') + 1, convertedPath.length - path.extname(convertedPath).length);
            const size = parseInt(sizeStr, 10);
            if ((size + '').length !== sizeStr.length ||
                (Config_1.Config.Client.Media.Thumbnail.thumbnailSizes.indexOf(size) === -1 &&
                    Config_1.Config.Server.Media.Photo.Converting.resolution !== size)) {
                return false;
            }
            try {
                yield fs_1.promises.access(origFilePath, fs_1.constants.R_OK);
            }
            catch (e) {
                return false;
            }
            return true;
        });
    }
    static convertPhoto(mediaPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.generateThumbnail(mediaPath, Config_1.Config.Server.Media.Photo.Converting.resolution, PhotoWorker_1.ThumbnailSourceType.Photo, false);
        });
    }
    static convertedPhotoExist(mediaPath, size) {
        return __awaiter(this, void 0, void 0, function* () {
            // generate thumbnail path
            const outPath = PhotoProcessing.generateConvertedPath(mediaPath, size);
            // check if file already exist
            try {
                yield fs_1.promises.access(outPath, fs_1.constants.R_OK);
                return true;
            }
            catch (e) {
            }
            return false;
        });
    }
    static generateThumbnail(mediaPath, size, sourceType, makeSquare) {
        return __awaiter(this, void 0, void 0, function* () {
            // generate thumbnail path
            const outPath = PhotoProcessing.generateConvertedPath(mediaPath, size);
            // check if file already exist
            try {
                yield fs_1.promises.access(outPath, fs_1.constants.R_OK);
                return outPath;
            }
            catch (e) {
            }
            // run on other thread
            const input = {
                type: sourceType,
                mediaPath: mediaPath,
                size: size,
                outPath: outPath,
                makeSquare: makeSquare,
                qualityPriority: Config_1.Config.Server.Media.Thumbnail.qualityPriority
            };
            const outDir = path.dirname(input.outPath);
            yield fs_1.promises.mkdir(outDir, { recursive: true });
            yield this.taskQue.execute(input);
            return outPath;
        });
    }
    static isPhoto(fullPath) {
        const extension = path.extname(fullPath).toLowerCase();
        return SupportedFormats_1.SupportedFormats.WithDots.Photos.indexOf(extension) !== -1;
    }
}
PhotoProcessing.initDone = false;
PhotoProcessing.taskQue = null;
exports.PhotoProcessing = PhotoProcessing;

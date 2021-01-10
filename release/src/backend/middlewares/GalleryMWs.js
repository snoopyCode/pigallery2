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
const Error_1 = require("../../common/entities/Error");
const DirectoryDTO_1 = require("../../common/entities/DirectoryDTO");
const ObjectManagers_1 = require("../model/ObjectManagers");
const ConentWrapper_1 = require("../../common/entities/ConentWrapper");
const ProjectPath_1 = require("../ProjectPath");
const Config_1 = require("../../common/config/private/Config");
const UserDTO_1 = require("../../common/entities/UserDTO");
const MediaDTO_1 = require("../../common/entities/MediaDTO");
const Utils_1 = require("../../common/Utils");
const QueryParams_1 = require("../../common/QueryParams");
const VideoProcessing_1 = require("../model/fileprocessing/VideoProcessing");
const DiskMangerWorker_1 = require("../model/threading/DiskMangerWorker");
class GalleryMWs {
    static listDirectory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const directoryName = req.params.directory || '/';
            const absoluteDirectoryName = path.join(ProjectPath_1.ProjectPath.ImageFolder, directoryName);
            try {
                if ((yield fs_1.promises.stat(absoluteDirectoryName)).isDirectory() === false) {
                    return next();
                }
            }
            catch (e) {
                return next();
            }
            try {
                const directory = yield ObjectManagers_1.ObjectManagers.getInstance()
                    .GalleryManager.listDirectory(directoryName, parseInt(req.query[QueryParams_1.QueryParams.gallery.knownLastModified], 10), parseInt(req.query[QueryParams_1.QueryParams.gallery.knownLastScanned], 10));
                if (directory == null) {
                    req.resultPipe = new ConentWrapper_1.ContentWrapper(null, null, true);
                    return next();
                }
                if (req.session.user.permissions &&
                    req.session.user.permissions.length > 0 &&
                    req.session.user.permissions[0] !== '/*') {
                    directory.directories = directory.directories.filter(d => UserDTO_1.UserDTO.isDirectoryAvailable(d, req.session.user.permissions));
                }
                req.resultPipe = new ConentWrapper_1.ContentWrapper(directory, null);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during listing the directory', err));
            }
        });
    }
    static cleanUpGalleryResults(req, res, next) {
        if (!req.resultPipe) {
            return next();
        }
        const cw = req.resultPipe;
        if (cw.notModified === true) {
            return next();
        }
        const cleanUpMedia = (media) => {
            media.forEach(m => {
                if (MediaDTO_1.MediaDTO.isPhoto(m)) {
                    delete m.metadata.bitRate;
                    delete m.metadata.duration;
                }
                else if (MediaDTO_1.MediaDTO.isVideo(m)) {
                    delete m.metadata.rating;
                    delete m.metadata.caption;
                    delete m.metadata.cameraData;
                    delete m.metadata.orientation;
                    delete m.metadata.orientation;
                    delete m.metadata.keywords;
                    delete m.metadata.positionData;
                }
                Utils_1.Utils.removeNullOrEmptyObj(m);
            });
        };
        if (cw.directory) {
            DirectoryDTO_1.DirectoryDTO.removeReferences(cw.directory);
            // TODO: remove when typeorm inheritance is fixed
            cleanUpMedia(cw.directory.media);
        }
        if (cw.searchResult) {
            cleanUpMedia(cw.searchResult.media);
        }
        if (Config_1.Config.Client.Media.Video.enabled === false) {
            if (cw.directory) {
                const removeVideos = (dir) => {
                    dir.media = dir.media.filter(m => !MediaDTO_1.MediaDTO.isVideo(m));
                    if (dir.directories) {
                        dir.directories.forEach(d => removeVideos(d));
                    }
                };
                removeVideos(cw.directory);
            }
            if (cw.searchResult) {
                cw.searchResult.media = cw.searchResult.media.filter(m => !MediaDTO_1.MediaDTO.isVideo(m));
            }
        }
        return next();
    }
    static getRandomImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.RandomPhoto.enabled === false) {
                return next();
            }
            try {
                const query = {};
                if (req.query.directory) {
                    query.directory = DiskMangerWorker_1.DiskMangerWorker.normalizeDirPath(req.query.directory);
                }
                if (req.query.recursive === 'true') {
                    query.recursive = true;
                }
                if (req.query.orientation) {
                    query.orientation = parseInt(req.query.orientation.toString(), 10);
                }
                if (req.query.maxResolution) {
                    query.maxResolution = parseFloat(req.query.maxResolution.toString());
                }
                if (req.query.minResolution) {
                    query.minResolution = parseFloat(req.query.minResolution.toString());
                }
                if (req.query.fromDate) {
                    query.fromDate = new Date(req.query.fromDate);
                }
                if (req.query.toDate) {
                    query.toDate = new Date(req.query.toDate);
                }
                if (query.minResolution && query.maxResolution && query.maxResolution < query.minResolution) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'Input error: min resolution is greater than the max resolution'));
                }
                if (query.toDate && query.fromDate && query.toDate.getTime() < query.fromDate.getTime()) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'Input error: to date is earlier than from date'));
                }
                const photo = yield ObjectManagers_1.ObjectManagers.getInstance()
                    .GalleryManager.getRandomPhoto(query);
                if (!photo) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'No photo found'));
                }
                req.params.mediaPath = path.join(photo.directory.path, photo.directory.name, photo.name);
                return next();
            }
            catch (e) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Can\'t get random photo: ' + e.toString()));
            }
        });
    }
    static loadFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(req.params.mediaPath)) {
                return next();
            }
            const fullMediaPath = path.join(ProjectPath_1.ProjectPath.ImageFolder, req.params.mediaPath);
            // check if file exist
            try {
                if ((yield fs_1.promises.stat(fullMediaPath)).isDirectory()) {
                    return next();
                }
            }
            catch (e) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'no such file:' + req.params.mediaPath, 'can\'t find file: ' + fullMediaPath));
            }
            req.resultPipe = fullMediaPath;
            return next();
        });
    }
    static loadBestFitVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(req.resultPipe)) {
                return next();
            }
            const fullMediaPath = req.resultPipe;
            const convertedVideo = VideoProcessing_1.VideoProcessing.generateConvertedFilePath(fullMediaPath);
            // check if transcoded video exist
            try {
                yield fs_1.promises.access(convertedVideo);
                req.resultPipe = convertedVideo;
            }
            catch (e) {
            }
            return next();
        });
    }
    static search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Search.enabled === false) {
                return next();
            }
            if (!(req.params.text)) {
                return next();
            }
            let type;
            if (req.query[QueryParams_1.QueryParams.gallery.search.type]) {
                type = parseInt(req.query[QueryParams_1.QueryParams.gallery.search.type], 10);
            }
            try {
                const result = yield ObjectManagers_1.ObjectManagers.getInstance().SearchManager.search(req.params.text, type);
                result.directories.forEach(dir => dir.media = dir.media || []);
                req.resultPipe = new ConentWrapper_1.ContentWrapper(null, result);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during searching', err));
            }
        });
    }
    static instantSearch(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Search.instantSearchEnabled === false) {
                return next();
            }
            if (!(req.params.text)) {
                return next();
            }
            try {
                const result = yield ObjectManagers_1.ObjectManagers.getInstance().SearchManager.instantSearch(req.params.text);
                result.directories.forEach(dir => dir.media = dir.media || []);
                req.resultPipe = new ConentWrapper_1.ContentWrapper(null, result);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during searching', err));
            }
        });
    }
    static autocomplete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Client.Search.AutoComplete.enabled === false) {
                return next();
            }
            if (!(req.params.text)) {
                return next();
            }
            try {
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance().SearchManager.autocomplete(req.params.text);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error during searching', err));
            }
        });
    }
}
exports.GalleryMWs = GalleryMWs;

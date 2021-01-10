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
const fs = require("fs");
const Error_1 = require("../../../common/entities/Error");
const ProjectPath_1 = require("../../ProjectPath");
const Config_1 = require("../../../common/config/private/Config");
const PhotoProcessing_1 = require("../../model/fileprocessing/PhotoProcessing");
class ThumbnailGeneratorMWs {
    static addThumbnailInformation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.resultPipe) {
                return next();
            }
            try {
                const cw = req.resultPipe;
                if (cw.notModified === true) {
                    return next();
                }
                if (cw.directory) {
                    ThumbnailGeneratorMWs.addThInfoTODir(cw.directory);
                }
                if (cw.searchResult && cw.searchResult.media) {
                    ThumbnailGeneratorMWs.addThInfoToPhotos(cw.searchResult.media);
                }
            }
            catch (error) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SERVER_ERROR, 'error during postprocessing result (adding thumbnail info)', error.toString()));
            }
            return next();
        });
    }
    static addThumbnailInfoForPersons(req, res, next) {
        if (!req.resultPipe) {
            return next();
        }
        try {
            const size = Config_1.Config.Client.Media.Thumbnail.personThumbnailSize;
            const persons = req.resultPipe;
            for (let i = 0; i < persons.length; i++) {
                // load parameters
                const mediaPath = path.join(ProjectPath_1.ProjectPath.ImageFolder, persons[i].sampleRegion.media.directory.path, persons[i].sampleRegion.media.directory.name, persons[i].sampleRegion.media.name);
                // generate thumbnail path
                const thPath = PhotoProcessing_1.PhotoProcessing.generatePersonThumbnailPath(mediaPath, persons[i].sampleRegion, size);
                persons[i].readyThumbnail = fs.existsSync(thPath);
            }
        }
        catch (error) {
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SERVER_ERROR, 'error during postprocessing result (adding thumbnail info)', error.toString()));
        }
        return next();
    }
    static generatePersonThumbnail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.resultPipe) {
                return next();
            }
            const person = req.resultPipe;
            try {
                req.resultPipe = yield PhotoProcessing_1.PhotoProcessing.generatePersonThumbnail(person);
                return next();
            }
            catch (error) {
                console.error(error);
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.THUMBNAIL_GENERATION_ERROR, 'Error during generating face thumbnail: ' + person.name, error.toString()));
            }
        });
    }
    static generateThumbnailFactory(sourceType) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.resultPipe) {
                return next();
            }
            // load parameters
            const mediaPath = req.resultPipe;
            let size = parseInt(req.params.size, 10) || Config_1.Config.Client.Media.Thumbnail.thumbnailSizes[0];
            // validate size
            if (Config_1.Config.Client.Media.Thumbnail.thumbnailSizes.indexOf(size) === -1) {
                size = Config_1.Config.Client.Media.Thumbnail.thumbnailSizes[0];
            }
            try {
                req.resultPipe = yield PhotoProcessing_1.PhotoProcessing.generateThumbnail(mediaPath, size, sourceType, false);
                return next();
            }
            catch (error) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.THUMBNAIL_GENERATION_ERROR, 'Error during generating thumbnail: ' + mediaPath, error.toString()));
            }
        });
    }
    static generateIconFactory(sourceType) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.resultPipe) {
                return next();
            }
            // load parameters
            const mediaPath = req.resultPipe;
            const size = Config_1.Config.Client.Media.Thumbnail.iconSize;
            try {
                req.resultPipe = yield PhotoProcessing_1.PhotoProcessing.generateThumbnail(mediaPath, size, sourceType, true);
                return next();
            }
            catch (error) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.THUMBNAIL_GENERATION_ERROR, 'Error during generating thumbnail: ' + mediaPath, error.toString()));
            }
        });
    }
    static addThInfoTODir(directory) {
        if (typeof directory.media !== 'undefined') {
            ThumbnailGeneratorMWs.addThInfoToPhotos(directory.media);
        }
        if (typeof directory.directories !== 'undefined') {
            for (let i = 0; i < directory.directories.length; i++) {
                ThumbnailGeneratorMWs.addThInfoTODir(directory.directories[i]);
            }
        }
    }
    static addThInfoToPhotos(photos) {
        for (let i = 0; i < photos.length; i++) {
            const fullMediaPath = path.join(ProjectPath_1.ProjectPath.ImageFolder, photos[i].directory.path, photos[i].directory.name, photos[i].name);
            for (let j = 0; j < Config_1.Config.Client.Media.Thumbnail.thumbnailSizes.length; j++) {
                const size = Config_1.Config.Client.Media.Thumbnail.thumbnailSizes[j];
                const thPath = PhotoProcessing_1.PhotoProcessing.generateConvertedPath(fullMediaPath, size);
                if (fs.existsSync(thPath) === true) {
                    if (typeof photos[i].readyThumbnails === 'undefined') {
                        photos[i].readyThumbnails = [];
                    }
                    photos[i].readyThumbnails.push(size);
                }
            }
            const iconPath = PhotoProcessing_1.PhotoProcessing.generateConvertedPath(fullMediaPath, Config_1.Config.Client.Media.Thumbnail.iconSize);
            if (fs.existsSync(iconPath) === true) {
                photos[i].readyIcon = true;
            }
        }
    }
}
exports.ThumbnailGeneratorMWs = ThumbnailGeneratorMWs;

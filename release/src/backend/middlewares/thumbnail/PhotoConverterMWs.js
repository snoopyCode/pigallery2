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
const fs = require("fs");
const PhotoProcessing_1 = require("../../model/fileprocessing/PhotoProcessing");
const Config_1 = require("../../../common/config/private/Config");
class PhotoConverterMWs {
    static convertPhoto(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.resultPipe) {
                return next();
            }
            // if conversion is not enabled redirect, so browser can cache the full
            if (Config_1.Config.Client.Media.Photo.Converting.enabled === false) {
                return res.redirect(req.originalUrl.slice(0, -1 * '\\bestFit'.length));
            }
            const fullMediaPath = req.resultPipe;
            const convertedVideo = PhotoProcessing_1.PhotoProcessing.generateConvertedPath(fullMediaPath, Config_1.Config.Server.Media.Photo.Converting.resolution);
            // check if converted photo exist
            if (fs.existsSync(convertedVideo) === true) {
                req.resultPipe = convertedVideo;
                return next();
            }
            if (Config_1.Config.Server.Media.Photo.Converting.onTheFly === true) {
                req.resultPipe = yield PhotoProcessing_1.PhotoProcessing.convertPhoto(fullMediaPath);
                return next();
            }
            // not converted and won't be now
            return res.redirect(req.originalUrl.slice(0, -1 * '\\bestFit'.length));
        });
    }
}
exports.PhotoConverterMWs = PhotoConverterMWs;

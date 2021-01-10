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
const TaskExecuter_1 = require("../threading/TaskExecuter");
const VideoConverterWorker_1 = require("../threading/VideoConverterWorker");
const MetadataLoader_1 = require("../threading/MetadataLoader");
const Config_1 = require("../../../common/config/private/Config");
const ProjectPath_1 = require("../../ProjectPath");
const SupportedFormats_1 = require("../../../common/SupportedFormats");
class VideoProcessing {
    static generateConvertedFilePath(videoPath) {
        return path.join(ProjectPath_1.ProjectPath.TranscodedFolder, ProjectPath_1.ProjectPath.getRelativePathToImages(path.dirname(videoPath)), path.basename(videoPath) + '_' + this.getConvertedFilePostFix());
    }
    static isValidConvertedPath(convertedPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const origFilePath = path.join(ProjectPath_1.ProjectPath.ImageFolder, path.relative(ProjectPath_1.ProjectPath.TranscodedFolder, convertedPath.substring(0, convertedPath.lastIndexOf('_'))));
            const postfix = convertedPath.substring(convertedPath.lastIndexOf('_') + 1, convertedPath.length);
            if (postfix !== this.getConvertedFilePostFix()) {
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
    static convertedVideoExist(videoPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const outPath = this.generateConvertedFilePath(videoPath);
            try {
                yield fs_1.promises.access(outPath, fs_1.constants.R_OK);
                return true;
            }
            catch (e) {
            }
            return false;
        });
    }
    static convertVideo(videoPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const outPath = this.generateConvertedFilePath(videoPath);
            try {
                yield fs_1.promises.access(outPath, fs_1.constants.R_OK);
                return;
            }
            catch (e) {
            }
            const metaData = yield MetadataLoader_1.MetadataLoader.loadVideoMetadata(videoPath);
            const renderInput = {
                videoPath: videoPath,
                output: {
                    path: outPath,
                    codec: Config_1.Config.Server.Media.Video.transcoding.codec,
                    format: Config_1.Config.Server.Media.Video.transcoding.format,
                    crf: Config_1.Config.Server.Media.Video.transcoding.crf,
                    preset: Config_1.Config.Server.Media.Video.transcoding.preset,
                    customOptions: Config_1.Config.Server.Media.Video.transcoding.customOptions,
                }
            };
            if (metaData.bitRate > Config_1.Config.Server.Media.Video.transcoding.bitRate) {
                renderInput.output.bitRate = Config_1.Config.Server.Media.Video.transcoding.bitRate;
            }
            if (metaData.fps > Config_1.Config.Server.Media.Video.transcoding.fps) {
                renderInput.output.fps = Config_1.Config.Server.Media.Video.transcoding.fps;
            }
            if (Config_1.Config.Server.Media.Video.transcoding.resolution < metaData.size.height) {
                renderInput.output.resolution = Config_1.Config.Server.Media.Video.transcoding.resolution;
            }
            const outDir = path.dirname(renderInput.output.path);
            yield fs_1.promises.mkdir(outDir, { recursive: true });
            yield VideoProcessing.taskQue.execute(renderInput);
        });
    }
    static isVideo(fullPath) {
        const extension = path.extname(fullPath).toLowerCase();
        return SupportedFormats_1.SupportedFormats.WithDots.Videos.indexOf(extension) !== -1;
    }
    static getConvertedFilePostFix() {
        return Math.round(Config_1.Config.Server.Media.Video.transcoding.bitRate / 1024) + 'k' +
            Config_1.Config.Server.Media.Video.transcoding.codec.toString().toLowerCase() +
            Config_1.Config.Server.Media.Video.transcoding.resolution +
            '.' + Config_1.Config.Server.Media.Video.transcoding.format.toLowerCase();
    }
}
VideoProcessing.taskQue = new TaskExecuter_1.TaskExecuter(1, (input => VideoConverterWorker_1.VideoConverterWorker.convert(input)));
exports.VideoProcessing = VideoProcessing;

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
const Config_1 = require("../../../../common/config/private/Config");
const JobDTO_1 = require("../../../../common/entities/job/JobDTO");
const FileJob_1 = require("./FileJob");
const VideoProcessing_1 = require("../../fileprocessing/VideoProcessing");
class VideoConvertingJob extends FileJob_1.FileJob {
    constructor() {
        super({ noPhoto: true, noMetaFile: true });
        this.Name = JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Video Converting']];
    }
    get Supported() {
        return Config_1.Config.Client.Media.Video.enabled === true;
    }
    shouldProcess(mPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return !(yield VideoProcessing_1.VideoProcessing.convertedVideoExist(mPath));
        });
    }
    processFile(mPath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield VideoProcessing_1.VideoProcessing.convertVideo(mPath);
            if (global.gc) {
                global.gc();
            }
        });
    }
}
exports.VideoConvertingJob = VideoConvertingJob;

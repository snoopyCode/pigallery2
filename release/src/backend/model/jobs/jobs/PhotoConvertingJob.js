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
const PhotoProcessing_1 = require("../../fileprocessing/PhotoProcessing");
class PhotoConvertingJob extends FileJob_1.FileJob {
    constructor() {
        super({ noVideo: true, noMetaFile: true });
        this.Name = JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Photo Converting']];
    }
    get Supported() {
        return Config_1.Config.Client.Media.Photo.Converting.enabled === true;
    }
    shouldProcess(mPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return !(yield PhotoProcessing_1.PhotoProcessing.convertedPhotoExist(mPath, Config_1.Config.Server.Media.Photo.Converting.resolution));
        });
    }
    processFile(mPath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield PhotoProcessing_1.PhotoProcessing.convertPhoto(mPath);
        });
    }
}
exports.PhotoConvertingJob = PhotoConvertingJob;

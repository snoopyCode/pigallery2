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
const PhotoWorker_1 = require("../../threading/PhotoWorker");
const MediaDTO_1 = require("../../../../common/entities/MediaDTO");
const BackendTexts_1 = require("../../../../common/BackendTexts");
class ThumbnailGenerationJob extends FileJob_1.FileJob {
    constructor() {
        super({ noMetaFile: true });
        this.Name = JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Thumbnail Generation']];
        this.ConfigTemplate.push({
            id: 'sizes',
            type: 'number-array',
            name: BackendTexts_1.backendTexts.sizeToGenerate.name,
            description: BackendTexts_1.backendTexts.sizeToGenerate.description,
            defaultValue: [Config_1.Config.Client.Media.Thumbnail.thumbnailSizes[0]]
        });
    }
    get Supported() {
        return true;
    }
    start(config, soloRun = false, allowParallelRun = false) {
        for (let i = 0; i < config.sizes.length; ++i) {
            if (Config_1.Config.Client.Media.Thumbnail.thumbnailSizes.indexOf(config.sizes[i]) === -1) {
                throw new Error('unknown thumbnails size: ' + config.sizes[i] + '. Add it to the possible thumbnail sizes.');
            }
        }
        return super.start(config, soloRun, allowParallelRun);
    }
    filterMediaFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return files;
        });
    }
    filterMetaFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    shouldProcess(mPath) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.config.sizes.length; ++i) {
                if (!(yield PhotoProcessing_1.PhotoProcessing.convertedPhotoExist(mPath, this.config.sizes[i]))) {
                    return true;
                }
            }
        });
    }
    processFile(mPath) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.config.sizes.length; ++i) {
                yield PhotoProcessing_1.PhotoProcessing.generateThumbnail(mPath, this.config.sizes[i], MediaDTO_1.MediaDTO.isVideoPath(mPath) ? PhotoWorker_1.ThumbnailSourceType.Video : PhotoWorker_1.ThumbnailSourceType.Photo, false);
            }
        });
    }
}
exports.ThumbnailGenerationJob = ThumbnailGenerationJob;

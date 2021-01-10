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
const JobDTO_1 = require("../../../../common/entities/job/JobDTO");
const path = require("path");
const fs = require("fs");
const Job_1 = require("./Job");
const ProjectPath_1 = require("../../../ProjectPath");
const PhotoProcessing_1 = require("../../fileprocessing/PhotoProcessing");
const VideoProcessing_1 = require("../../fileprocessing/VideoProcessing");
class TempFolderCleaningJob extends Job_1.Job {
    constructor() {
        super(...arguments);
        this.Name = JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Temp Folder Cleaning']];
        this.ConfigTemplate = null;
        this.Supported = true;
        this.directoryQueue = [];
        this.tempRootCleaned = false;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tempRootCleaned = false;
            this.directoryQueue = [];
            this.directoryQueue.push(ProjectPath_1.ProjectPath.TranscodedFolder);
        });
    }
    isValidFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (PhotoProcessing_1.PhotoProcessing.isPhoto(filePath)) {
                return PhotoProcessing_1.PhotoProcessing.isValidConvertedPath(filePath);
            }
            if (VideoProcessing_1.VideoProcessing.isVideo(filePath)) {
                return VideoProcessing_1.VideoProcessing.isValidConvertedPath(filePath);
            }
            return false;
        });
    }
    isValidDirectory(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalPath = path.join(ProjectPath_1.ProjectPath.ImageFolder, path.relative(ProjectPath_1.ProjectPath.TranscodedFolder, filePath));
            try {
                yield fs.promises.access(originalPath);
                return true;
            }
            catch (e) {
            }
            return false;
        });
    }
    readDir(dirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield fs.promises.readdir(dirPath)).map(f => path.normalize(path.join(dirPath, f)));
        });
    }
    stepTempDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.readDir(ProjectPath_1.ProjectPath.TempFolder);
            const validFiles = [ProjectPath_1.ProjectPath.TranscodedFolder, ProjectPath_1.ProjectPath.FacesFolder];
            for (let i = 0; i < files.length; ++i) {
                if (validFiles.indexOf(files[i]) === -1) {
                    this.Progress.log('processing: ' + files[i]);
                    this.Progress.Processed++;
                    if ((yield fs.promises.stat(files[i])).isDirectory()) {
                        yield fs.promises.rmdir(files[i], { recursive: true });
                    }
                    else {
                        yield fs.promises.unlink(files[i]);
                    }
                }
                else {
                    this.Progress.log('skipping: ' + files[i]);
                    this.Progress.Skipped++;
                }
            }
            return true;
        });
    }
    stepConvertedDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this.directoryQueue.shift();
            const stat = yield fs.promises.stat(filePath);
            this.Progress.Left = this.directoryQueue.length;
            if (stat.isDirectory()) {
                if ((yield this.isValidDirectory(filePath)) === false) {
                    this.Progress.log('processing: ' + filePath);
                    this.Progress.Processed++;
                    yield fs.promises.rmdir(filePath, { recursive: true });
                }
                else {
                    this.Progress.log('skipping: ' + filePath);
                    this.Progress.Skipped++;
                    this.directoryQueue = this.directoryQueue.concat(yield this.readDir(filePath));
                }
            }
            else {
                if ((yield this.isValidFile(filePath)) === false) {
                    this.Progress.log('processing: ' + filePath);
                    this.Progress.Processed++;
                    yield fs.promises.unlink(filePath);
                }
                else {
                    this.Progress.log('skipping: ' + filePath);
                    this.Progress.Skipped++;
                }
            }
            return true;
        });
    }
    step() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.directoryQueue.length === 0) {
                return false;
            }
            if (this.tempRootCleaned === false) {
                this.tempRootCleaned = true;
                return this.stepTempDirectory();
            }
            return this.stepConvertedDirectory();
        });
    }
}
exports.TempFolderCleaningJob = TempFolderCleaningJob;

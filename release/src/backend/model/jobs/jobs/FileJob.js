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
const Job_1 = require("./Job");
const path = require("path");
const DiskManger_1 = require("../../DiskManger");
const Logger_1 = require("../../../Logger");
const Config_1 = require("../../../../common/config/private/Config");
const SQLConnection_1 = require("../../database/sql/SQLConnection");
const MediaEntity_1 = require("../../database/sql/enitites/MediaEntity");
const PhotoEntity_1 = require("../../database/sql/enitites/PhotoEntity");
const VideoEntity_1 = require("../../database/sql/enitites/VideoEntity");
const BackendTexts_1 = require("../../../../common/BackendTexts");
const ProjectPath_1 = require("../../../ProjectPath");
const PrivateConfig_1 = require("../../../../common/config/private/PrivateConfig");
const LOG_TAG = '[FileJob]';
class FileJob extends Job_1.Job {
    constructor(scanFilter) {
        super();
        this.scanFilter = scanFilter;
        this.ConfigTemplate = [];
        this.directoryQueue = [];
        this.fileQueue = [];
        this.scanFilter.noChildDirPhotos = true;
        if (Config_1.Config.Server.Database.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory) {
            this.ConfigTemplate.push({
                id: 'indexedOnly',
                type: 'boolean',
                name: BackendTexts_1.backendTexts.indexedFilesOnly.name,
                description: BackendTexts_1.backendTexts.indexedFilesOnly.description,
                defaultValue: true
            });
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.directoryQueue = [];
            this.fileQueue = [];
            this.directoryQueue.push('/');
        });
    }
    filterMediaFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return files;
        });
    }
    filterMetaFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            return files;
        });
    }
    step() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.directoryQueue.length === 0 && this.fileQueue.length === 0) {
                return false;
            }
            if (this.directoryQueue.length > 0) {
                if (this.config.indexedOnly === true &&
                    Config_1.Config.Server.Database.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                    yield this.loadAllMediaFilesFromDB();
                    this.directoryQueue = [];
                }
                else {
                    yield this.loadADirectoryFromDisk();
                }
            }
            else if (this.fileQueue.length > 0) {
                this.Progress.Left = this.fileQueue.length;
                const filePath = this.fileQueue.shift();
                try {
                    if ((yield this.shouldProcess(filePath)) === true) {
                        this.Progress.Processed++;
                        this.Progress.log('processing: ' + filePath);
                        yield this.processFile(filePath);
                    }
                    else {
                        this.Progress.log('skipping: ' + filePath);
                        this.Progress.Skipped++;
                    }
                }
                catch (e) {
                    console.error(e);
                    Logger_1.Logger.error(LOG_TAG, 'Error during processing file:' + filePath + ', ' + e.toString());
                    this.Progress.log('Error during processing file:' + filePath + ', ' + e.toString());
                }
            }
            return true;
        });
    }
    loadADirectoryFromDisk() {
        return __awaiter(this, void 0, void 0, function* () {
            const directory = this.directoryQueue.shift();
            this.Progress.log('scanning directory: ' + directory);
            const scanned = yield DiskManger_1.DiskManager.scanDirectoryNoMetadata(directory, this.scanFilter);
            for (let i = 0; i < scanned.directories.length; i++) {
                this.directoryQueue.push(path.join(scanned.directories[i].path, scanned.directories[i].name));
            }
            if (this.scanFilter.noPhoto !== true || this.scanFilter.noVideo !== true) {
                this.fileQueue.push(...(yield this.filterMediaFiles(scanned.media))
                    .map(f => path.join(ProjectPath_1.ProjectPath.ImageFolder, f.directory.path, f.directory.name, f.name)));
            }
            if (this.scanFilter.noMetaFile !== true) {
                this.fileQueue.push(...(yield this.filterMetaFiles(scanned.metaFile))
                    .map(f => path.join(ProjectPath_1.ProjectPath.ImageFolder, f.directory.path, f.directory.name, f.name)));
            }
        });
    }
    loadAllMediaFilesFromDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.scanFilter.noVideo === true && this.scanFilter.noPhoto === true) {
                return;
            }
            this.Progress.log('Loading files from db');
            Logger_1.Logger.silly(LOG_TAG, 'Loading files from db');
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            let usedEntity = MediaEntity_1.MediaEntity;
            if (this.scanFilter.noVideo === true) {
                usedEntity = PhotoEntity_1.PhotoEntity;
            }
            else if (this.scanFilter.noPhoto === true) {
                usedEntity = VideoEntity_1.VideoEntity;
            }
            const result = yield connection
                .getRepository(usedEntity)
                .createQueryBuilder('media')
                .select(['media.name', 'media.id'])
                .leftJoinAndSelect('media.directory', 'directory')
                .getMany();
            this.fileQueue.push(...(result
                .map(f => path.join(ProjectPath_1.ProjectPath.ImageFolder, f.directory.path, f.directory.name, f.name))));
        });
    }
}
exports.FileJob = FileJob;

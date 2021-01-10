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
const ObjectManagers_1 = require("../../ObjectManagers");
const path = require("path");
const Config_1 = require("../../../../common/config/private/Config");
const Job_1 = require("./Job");
const JobDTO_1 = require("../../../../common/entities/job/JobDTO");
const JobProgressDTO_1 = require("../../../../common/entities/job/JobProgressDTO");
const PrivateConfig_1 = require("../../../../common/config/private/PrivateConfig");
class IndexingJob extends Job_1.Job {
    constructor() {
        super(...arguments);
        this.Name = JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs.Indexing];
        this.directoriesToIndex = [];
        this.ConfigTemplate = null;
    }
    get Supported() {
        return Config_1.Config.Server.Database.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.directoriesToIndex.push('/');
        });
    }
    step() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.directoriesToIndex.length === 0) {
                if (ObjectManagers_1.ObjectManagers.getInstance().IndexingManager.IsSavingInProgress) {
                    yield ObjectManagers_1.ObjectManagers.getInstance().IndexingManager.SavingReady;
                }
                return false;
            }
            const directory = this.directoriesToIndex.shift();
            this.Progress.log(directory);
            this.Progress.Left = this.directoriesToIndex.length;
            const scanned = yield ObjectManagers_1.ObjectManagers.getInstance().IndexingManager.indexDirectory(directory);
            if (this.Progress.State !== JobProgressDTO_1.JobProgressStates.running) {
                return false;
            }
            this.Progress.Processed++;
            for (let i = 0; i < scanned.directories.length; i++) {
                this.directoriesToIndex.push(path.join(scanned.directories[i].path, scanned.directories[i].name));
            }
            return true;
        });
    }
}
exports.IndexingJob = IndexingJob;

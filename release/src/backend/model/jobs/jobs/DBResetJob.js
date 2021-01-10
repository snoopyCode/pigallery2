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
const Config_1 = require("../../../../common/config/private/Config");
const JobDTO_1 = require("../../../../common/entities/job/JobDTO");
const Job_1 = require("./Job");
const PrivateConfig_1 = require("../../../../common/config/private/PrivateConfig");
class DBRestJob extends Job_1.Job {
    constructor() {
        super(...arguments);
        this.Name = JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Database Reset']];
        this.ConfigTemplate = null;
        this.IsInstant = true;
    }
    get Supported() {
        return Config_1.Config.Server.Database.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    step() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Progress.Left = 1;
            this.Progress.Processed++;
            yield ObjectManagers_1.ObjectManagers.getInstance().IndexingManager.resetDB();
            return false;
        });
    }
}
exports.DBRestJob = DBRestJob;

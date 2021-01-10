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
const fs_1 = require("fs");
const path = require("path");
const ProjectPath_1 = require("../../ProjectPath");
const Config_1 = require("../../../common/config/private/Config");
const JobProgressDTO_1 = require("../../../common/entities/job/JobProgressDTO");
class JobProgressManager {
    constructor() {
        this.db = {
            version: JobProgressManager.VERSION,
            progresses: {}
        };
        this.timer = null;
        this.dbPath = path.join(ProjectPath_1.ProjectPath.DBFolder, 'jobs.db');
        this.loadDB().catch(console.error);
    }
    get Progresses() {
        const m = {};
        for (const key of Object.keys(this.db.progresses)) {
            m[key] = this.db.progresses[key].progress;
            if (this.db.progresses[key].progress.state === JobProgressDTO_1.JobProgressStates.running) {
                m[key].time.end = Date.now();
            }
        }
        return m;
    }
    onJobProgressUpdate(progress) {
        this.db.progresses[progress.HashName] = { progress: progress, timestamp: Date.now() };
        this.delayedSave();
    }
    loadDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.promises.access(this.dbPath);
            }
            catch (e) {
                return;
            }
            const data = yield fs_1.promises.readFile(this.dbPath, 'utf8');
            const db = JSON.parse(data);
            if (db.version !== JobProgressManager.VERSION) {
                return;
            }
            this.db = db;
            while (Object.keys(this.db.progresses).length > Config_1.Config.Server.Jobs.maxSavedProgress) {
                let min = null;
                for (const key of Object.keys(this.db.progresses)) {
                    if (min === null || this.db.progresses[min].timestamp > this.db.progresses[key].timestamp) {
                        min = key;
                    }
                }
                delete this.db.progresses[min];
            }
            for (const key of Object.keys(this.db.progresses)) {
                if (this.db.progresses[key].progress.state === JobProgressDTO_1.JobProgressStates.running ||
                    this.db.progresses[key].progress.state === JobProgressDTO_1.JobProgressStates.cancelling) {
                    this.db.progresses[key].progress.state = JobProgressDTO_1.JobProgressStates.interrupted;
                }
            }
        });
    }
    saveDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.writeFile(this.dbPath, JSON.stringify(this.db));
        });
    }
    delayedSave() {
        if (this.timer !== null) {
            return;
        }
        this.timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this.saveDB().catch(console.error);
            this.timer = null;
        }), 5000);
    }
}
JobProgressManager.VERSION = 3;
exports.JobProgressManager = JobProgressManager;

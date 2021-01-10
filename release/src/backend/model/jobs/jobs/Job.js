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
const Logger_1 = require("../../../Logger");
const JobDTO_1 = require("../../../../common/entities/job/JobDTO");
const JobProgress_1 = require("./JobProgress");
const JobProgressDTO_1 = require("../../../../common/entities/job/JobProgressDTO");
const LOG_TAG = '[JOB]';
class Job {
    constructor() {
        this.allowParallelRun = null;
        this.progress = null;
        this.IsInstant = false;
    }
    set JobListener(value) {
        this.jobListener = value;
    }
    get Progress() {
        return this.progress;
    }
    get InProgress() {
        return this.Progress !== null && (this.Progress.State === JobProgressDTO_1.JobProgressStates.running ||
            this.Progress.State === JobProgressDTO_1.JobProgressStates.cancelling);
    }
    start(config, soloRun = false, allowParallelRun = false) {
        if (this.InProgress === false && this.Supported === true) {
            Logger_1.Logger.info(LOG_TAG, 'Running job ' + (soloRun === true ? 'solo' : '') + ': ' + this.Name);
            this.soloRun = soloRun;
            this.allowParallelRun = allowParallelRun;
            this.config = config;
            this.progress = new JobProgress_1.JobProgress(this.Name, JobDTO_1.JobDTO.getHashName(this.Name, this.config));
            this.progress.OnChange = this.jobListener.onProgressUpdate;
            const pr = new Promise((resolve) => {
                this.prResolve = resolve;
            });
            this.init().catch(console.error);
            this.run();
            if (!this.IsInstant) { // if instant, wait for execution, otherwise, return right away
                return Promise.resolve();
            }
            return pr;
        }
        else {
            Logger_1.Logger.info(LOG_TAG, 'Job already running or not supported: ' + this.Name);
            return Promise.reject('Job already running or not supported: ' + this.Name);
        }
    }
    cancel() {
        if (this.InProgress === false) {
            return;
        }
        Logger_1.Logger.info(LOG_TAG, 'Stopping job: ' + this.Name);
        this.Progress.State = JobProgressDTO_1.JobProgressStates.cancelling;
    }
    toJSON() {
        return {
            Name: this.Name,
            ConfigTemplate: this.ConfigTemplate
        };
    }
    onFinish() {
        if (this.InProgress === false) {
            return;
        }
        if (this.Progress.State === JobProgressDTO_1.JobProgressStates.running) {
            this.Progress.State = JobProgressDTO_1.JobProgressStates.finished;
        }
        else if (this.Progress.State === JobProgressDTO_1.JobProgressStates.cancelling) {
            this.Progress.State = JobProgressDTO_1.JobProgressStates.canceled;
        }
        const finishState = this.Progress.State;
        this.progress = null;
        if (global.gc) {
            global.gc();
        }
        Logger_1.Logger.info(LOG_TAG, 'Job finished: ' + this.Name);
        if (this.IsInstant) {
            this.prResolve();
        }
        this.jobListener.onJobFinished(this, finishState, this.soloRun);
    }
    run() {
        process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.Progress == null || this.Progress.State !== JobProgressDTO_1.JobProgressStates.running) {
                    this.onFinish();
                    return;
                }
                if ((yield this.step()) === false) { // finished
                    this.onFinish();
                    return;
                }
                this.run();
            }
            catch (e) {
                Logger_1.Logger.error(LOG_TAG, e);
            }
        }));
    }
}
exports.Job = Job;

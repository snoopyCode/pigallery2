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
const JobProgressDTO_1 = require("../../../common/entities/job/JobProgressDTO");
const JobRepository_1 = require("./JobRepository");
const Config_1 = require("../../../common/config/private/Config");
const JobScheduleDTO_1 = require("../../../common/entities/job/JobScheduleDTO");
const Logger_1 = require("../../Logger");
const NotifocationManager_1 = require("../NotifocationManager");
const JobProgressManager_1 = require("./JobProgressManager");
const LOG_TAG = '[JobManager]';
class JobManager {
    constructor() {
        this.timers = [];
        this.progressManager = null;
        this.onProgressUpdate = (progress) => {
            this.progressManager.onJobProgressUpdate(progress.toDTO());
        };
        this.onJobFinished = (job, state, soloRun) => __awaiter(this, void 0, void 0, function* () {
            // if it was not finished peacefully or was a soloRun, do not start the next one
            if (state !== JobProgressDTO_1.JobProgressStates.finished || soloRun === true) {
                return;
            }
            const sch = Config_1.Config.Server.Jobs.scheduled.find(s => s.jobName === job.Name);
            if (sch) {
                const children = Config_1.Config.Server.Jobs.scheduled.filter(s => s.trigger.type === JobScheduleDTO_1.JobTriggerType.after &&
                    s.trigger.afterScheduleName === sch.name);
                for (let i = 0; i < children.length; ++i) {
                    try {
                        yield this.run(children[i].jobName, children[i].config, false, children[i].allowParallelRun);
                    }
                    catch (e) {
                        NotifocationManager_1.NotificationManager.warning('Job running error:' + children[i].name, e.toString());
                    }
                }
            }
        });
        this.progressManager = new JobProgressManager_1.JobProgressManager();
        this.runSchedules();
    }
    get JobRunning() {
        return JobRepository_1.JobRepository.Instance.getAvailableJobs().findIndex(j => j.InProgress === true) !== -1;
    }
    get JobNoParallelRunning() {
        return JobRepository_1.JobRepository.Instance.getAvailableJobs()
            .findIndex(j => j.InProgress === true && j.allowParallelRun) !== -1;
    }
    getProgresses() {
        return this.progressManager.Progresses;
    }
    run(jobName, config, soloRun, allowParallelRun) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((allowParallelRun === false && this.JobRunning === true) || this.JobNoParallelRunning === true) {
                throw new Error('Can\'t start this job while an other is running');
            }
            const t = this.findJob(jobName);
            if (t) {
                t.JobListener = this;
                yield t.start(config, soloRun, allowParallelRun);
            }
            else {
                Logger_1.Logger.warn(LOG_TAG, 'cannot find job to start:' + jobName);
            }
        });
    }
    stop(jobName) {
        const t = this.findJob(jobName);
        if (t) {
            t.cancel();
        }
        else {
            Logger_1.Logger.warn(LOG_TAG, 'cannot find job to stop:' + jobName);
        }
    }
    getAvailableJobs() {
        return JobRepository_1.JobRepository.Instance.getAvailableJobs();
    }
    stopSchedules() {
        this.timers.forEach(t => clearTimeout(t.timer));
        this.timers = [];
    }
    runSchedules() {
        this.stopSchedules();
        Logger_1.Logger.info(LOG_TAG, 'Running job schedules');
        Config_1.Config.Server.Jobs.scheduled.forEach(s => this.runSchedule(s));
    }
    findJob(jobName) {
        return this.getAvailableJobs().find(t => t.Name === jobName);
    }
    runSchedule(schedule) {
        const nextDate = JobScheduleDTO_1.JobScheduleDTO.getNextRunningDate(new Date(), schedule);
        if (nextDate && nextDate.getTime() > Date.now()) {
            Logger_1.Logger.debug(LOG_TAG, 'running schedule: ' + schedule.jobName +
                ' at ' + nextDate.toLocaleString(undefined, { hour12: false }));
            const timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                this.timers = this.timers.filter(t => t.timer !== timer);
                yield this.run(schedule.jobName, schedule.config, false, schedule.allowParallelRun);
                this.runSchedule(schedule);
            }), nextDate.getTime() - Date.now());
            this.timers.push({ schedule: schedule, timer: timer });
        }
        else {
            Logger_1.Logger.debug(LOG_TAG, 'skipping schedule:' + schedule.jobName);
        }
    }
}
exports.JobManager = JobManager;

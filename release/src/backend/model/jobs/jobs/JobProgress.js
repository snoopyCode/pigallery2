"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JobProgressDTO_1 = require("../../../../common/entities/job/JobProgressDTO");
class JobProgress {
    constructor(jobName, HashName) {
        this.jobName = jobName;
        this.HashName = HashName;
        this.steps = {
            all: 0,
            processed: 0,
            skipped: 0,
        };
        this.state = JobProgressDTO_1.JobProgressStates.running;
        this.time = {
            start: Date.now(),
            end: null,
        };
        this.logCounter = 0;
        this.logs = [];
        this.onChange = (progress) => {
        };
    }
    set OnChange(val) {
        this.onChange = val;
    }
    get Skipped() {
        return this.steps.skipped;
    }
    set Skipped(value) {
        this.steps.skipped = value;
        this.time.end = Date.now();
        this.onChange(this);
    }
    get Processed() {
        return this.steps.processed;
    }
    set Processed(value) {
        this.steps.processed = value;
        this.time.end = Date.now();
        this.onChange(this);
    }
    get Left() {
        return this.steps.all - this.steps.processed - this.steps.skipped;
    }
    set Left(value) {
        this.steps.all = value + this.steps.skipped + this.steps.processed;
        this.time.end = Date.now();
        this.onChange(this);
    }
    get All() {
        return this.steps.all;
    }
    set All(value) {
        this.steps.all = value;
        this.time.end = Date.now();
        this.onChange(this);
    }
    get State() {
        return this.state;
    }
    set State(value) {
        this.state = value;
        this.time.end = Date.now();
        this.onChange(this);
    }
    get Logs() {
        return this.logs;
    }
    log(log) {
        while (this.logs.length > 10) {
            this.logs.shift();
        }
        this.logs.push({ id: this.logCounter++, timestamp: (new Date()).toISOString(), comment: log });
        this.onChange(this);
    }
    toDTO() {
        return {
            jobName: this.jobName,
            HashName: this.HashName,
            state: this.state,
            time: {
                start: this.time.start,
                end: this.time.end
            },
            logs: this.logs,
            steps: this.steps
        };
    }
}
exports.JobProgress = JobProgress;

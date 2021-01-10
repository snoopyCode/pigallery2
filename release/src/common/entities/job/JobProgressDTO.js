"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JobProgressStates;
(function (JobProgressStates) {
    JobProgressStates[JobProgressStates["running"] = 1] = "running";
    JobProgressStates[JobProgressStates["cancelling"] = 2] = "cancelling";
    JobProgressStates[JobProgressStates["interrupted"] = 3] = "interrupted";
    JobProgressStates[JobProgressStates["canceled"] = 4] = "canceled";
    JobProgressStates[JobProgressStates["finished"] = 5] = "finished";
})(JobProgressStates = exports.JobProgressStates || (exports.JobProgressStates = {}));

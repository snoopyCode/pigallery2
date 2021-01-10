"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultsJobs;
(function (DefaultsJobs) {
    DefaultsJobs[DefaultsJobs["Indexing"] = 1] = "Indexing";
    DefaultsJobs[DefaultsJobs["Database Reset"] = 2] = "Database Reset";
    DefaultsJobs[DefaultsJobs["Video Converting"] = 3] = "Video Converting";
    DefaultsJobs[DefaultsJobs["Photo Converting"] = 4] = "Photo Converting";
    DefaultsJobs[DefaultsJobs["Thumbnail Generation"] = 5] = "Thumbnail Generation";
    DefaultsJobs[DefaultsJobs["Temp Folder Cleaning"] = 6] = "Temp Folder Cleaning";
})(DefaultsJobs = exports.DefaultsJobs || (exports.DefaultsJobs = {}));
var JobDTO;
(function (JobDTO) {
    JobDTO.getHashName = (jobName, config = {}) => {
        return jobName + '-' + JSON.stringify(config);
    };
})(JobDTO = exports.JobDTO || (exports.JobDTO = {}));

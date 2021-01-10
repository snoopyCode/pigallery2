"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JobTriggerType;
(function (JobTriggerType) {
    JobTriggerType[JobTriggerType["never"] = 1] = "never";
    JobTriggerType[JobTriggerType["scheduled"] = 2] = "scheduled";
    JobTriggerType[JobTriggerType["periodic"] = 3] = "periodic";
    JobTriggerType[JobTriggerType["after"] = 4] = "after";
})(JobTriggerType = exports.JobTriggerType || (exports.JobTriggerType = {}));
var JobScheduleDTO;
(function (JobScheduleDTO) {
    const getNextDayOfTheWeek = (refDate, dayOfWeek) => {
        const date = new Date(refDate);
        date.setDate(refDate.getDate() + (dayOfWeek + 1 + 7 - refDate.getDay()) % 7);
        if (date.getDay() === refDate.getDay()) {
            return new Date(refDate);
        }
        date.setHours(0, 0, 0, 0);
        return date;
    };
    const nextValidDate = (date, h, m, dayDiff) => {
        date.setSeconds(0);
        if (date.getHours() < h || (date.getHours() === h && date.getMinutes() < m)) {
            date.setHours(h);
            date.setMinutes(m);
        }
        else {
            date.setTime(date.getTime() + dayDiff);
            date.setHours(h);
            date.setMinutes(m);
        }
        return date;
    };
    JobScheduleDTO.getNextRunningDate = (refDate, schedule) => {
        switch (schedule.trigger.type) {
            case JobTriggerType.scheduled:
                return new Date(schedule.trigger.time);
            case JobTriggerType.periodic:
                const hour = Math.floor(schedule.trigger.atTime / 1000 / (60 * 60));
                const minute = (schedule.trigger.atTime / 1000 / 60) % 60;
                if (schedule.trigger.periodicity <= 6) { // Between Monday and Sunday
                    const nextRunDate = getNextDayOfTheWeek(refDate, schedule.trigger.periodicity);
                    return nextValidDate(nextRunDate, hour, minute, 7 * 24 * 60 * 60 * 1000);
                }
                // every day
                return nextValidDate(new Date(refDate), hour, minute, 24 * 60 * 60 * 1000);
        }
        return null;
    };
})(JobScheduleDTO = exports.JobScheduleDTO || (exports.JobScheduleDTO = {}));

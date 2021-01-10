"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../../../common/Utils");
class TaskQue {
    constructor() {
        this.tasks = [];
        this.processing = [];
    }
    getSameTask(input) {
        return this.tasks.find(t => Utils_1.Utils.equalsFilter(t.data, input)) ||
            this.processing.find(t => Utils_1.Utils.equalsFilter(t.data, input));
    }
    putNewTask(input) {
        const taskEntry = {
            data: input,
            promise: {
                obj: null,
                resolve: null,
                reject: null
            }
        };
        this.tasks.push(taskEntry);
        taskEntry.promise.obj = new Promise((resolve, reject) => {
            taskEntry.promise.reject = reject;
            taskEntry.promise.resolve = resolve;
        });
        return taskEntry;
    }
    isEmpty() {
        return this.tasks.length === 0;
    }
    add(input) {
        return (this.getSameTask(input) || this.putNewTask(input));
    }
    get() {
        const task = this.tasks.shift();
        this.processing.push(task);
        return task;
    }
    ready(task) {
        const index = this.processing.indexOf(task);
        if (index === -1) {
            throw new Error('Task does not exist');
        }
        this.processing.splice(index, 1);
    }
}
exports.TaskQue = TaskQue;

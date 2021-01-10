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
const TaskQue_1 = require("./TaskQue");
class TaskExecuter {
    constructor(size, worker) {
        this.size = size;
        this.worker = worker;
        this.taskQue = new TaskQue_1.TaskQue();
        this.taskInProgress = 0;
        this.run = () => __awaiter(this, void 0, void 0, function* () {
            if (this.taskQue.isEmpty() || this.taskInProgress >= this.size) {
                return;
            }
            this.taskInProgress++;
            const task = this.taskQue.get();
            try {
                task.promise.resolve(yield this.worker(task.data));
            }
            catch (err) {
                task.promise.reject(err);
            }
            this.taskQue.ready(task);
            this.taskInProgress--;
            process.nextTick(this.run);
        });
    }
    execute(input) {
        const promise = this.taskQue.add(input).promise.obj;
        this.run().catch(console.error);
        return promise;
    }
}
exports.TaskExecuter = TaskExecuter;

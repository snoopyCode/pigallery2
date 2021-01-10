"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cluster = require("cluster");
const Logger_1 = require("../../Logger");
const Worker_1 = require("./Worker");
const TaskQue_1 = require("./TaskQue");
class ThreadPool {
    constructor(size) {
        this.size = size;
        this.workers = [];
        this.taskQue = new TaskQue_1.TaskQue();
        this.run = () => {
            if (this.taskQue.isEmpty()) {
                return;
            }
            const worker = this.getFreeWorker();
            if (worker == null) {
                return;
            }
            const poolTask = this.taskQue.get();
            worker.poolTask = poolTask;
            worker.worker.send(poolTask.data);
        };
        Logger_1.Logger.silly('Creating thread pool with', size, 'workers');
        for (let i = 0; i < size; i++) {
            this.startWorker();
        }
    }
    executeTask(task) {
        const promise = this.taskQue.add(task).promise.obj;
        this.run();
        return promise;
    }
    getFreeWorker() {
        for (let i = 0; i < this.workers.length; i++) {
            if (this.workers[i].poolTask == null) {
                return this.workers[i];
            }
        }
        return null;
    }
    startWorker() {
        const worker = { poolTask: null, worker: cluster.fork() };
        this.workers.push(worker);
        worker.worker.on('online', () => {
            ThreadPool.WorkerCount++;
            Logger_1.Logger.debug('Worker ' + worker.worker.process.pid + ' is online, worker count:', ThreadPool.WorkerCount);
        });
        worker.worker.on('exit', (code, signal) => {
            ThreadPool.WorkerCount--;
            Logger_1.Logger.warn('Worker ' + worker.worker.process.pid + ' died with code: ' + code +
                ', and signal: ' + signal + ', worker count:', ThreadPool.WorkerCount);
            Logger_1.Logger.debug('Starting a new worker');
            this.startWorker();
        });
        worker.worker.on('message', (msg) => {
            if (worker.poolTask == null) {
                throw new Error('No worker task after worker task is completed');
            }
            if (msg.error) {
                worker.poolTask.promise.reject(msg.error);
            }
            else {
                worker.poolTask.promise.resolve(msg.result);
            }
            this.taskQue.ready(worker.poolTask);
            worker.poolTask = null;
            this.run();
        });
    }
}
ThreadPool.WorkerCount = 0;
exports.ThreadPool = ThreadPool;
class DiskManagerTH extends ThreadPool {
    execute(relativeDirectoryName, settings = {}) {
        return super.executeTask({
            type: Worker_1.WorkerTaskTypes.diskManager,
            relativeDirectoryName: relativeDirectoryName,
            settings: settings
        });
    }
}
exports.DiskManagerTH = DiskManagerTH;
class ThumbnailTH extends ThreadPool {
    execute(input) {
        return super.executeTask({
            type: Worker_1.WorkerTaskTypes.thumbnail,
            input: input,
        });
    }
}
exports.ThumbnailTH = ThumbnailTH;

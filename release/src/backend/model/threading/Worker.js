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
const DiskMangerWorker_1 = require("./DiskMangerWorker");
const Logger_1 = require("../../Logger");
const PhotoWorker_1 = require("./PhotoWorker");
const Utils_1 = require("../../../common/Utils");
class Worker {
    static process() {
        Logger_1.Logger.debug('Worker is waiting for tasks');
        process.on('message', (task) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = null;
                switch (task.type) {
                    case WorkerTaskTypes.diskManager:
                        result = yield DiskMangerWorker_1.DiskMangerWorker.scanDirectory(task.relativeDirectoryName, task.settings);
                        if (global.gc) {
                            global.gc();
                        }
                        break;
                    case WorkerTaskTypes.thumbnail:
                        result = yield PhotoWorker_1.PhotoWorker.render(task.input);
                        break;
                    default:
                        throw new Error('Unknown worker task type');
                }
                process.send({
                    error: null,
                    result: result
                });
            }
            catch (err) {
                process.send({ error: err, result: null });
            }
        }));
    }
}
exports.Worker = Worker;
var WorkerTaskTypes;
(function (WorkerTaskTypes) {
    WorkerTaskTypes[WorkerTaskTypes["thumbnail"] = 1] = "thumbnail";
    WorkerTaskTypes[WorkerTaskTypes["diskManager"] = 2] = "diskManager";
})(WorkerTaskTypes = exports.WorkerTaskTypes || (exports.WorkerTaskTypes = {}));
var WorkerTask;
(function (WorkerTask) {
    WorkerTask.equals = (t1, t2) => {
        return Utils_1.Utils.equalsFilter(t1, t2);
    };
})(WorkerTask = exports.WorkerTask || (exports.WorkerTask = {}));

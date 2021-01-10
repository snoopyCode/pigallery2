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
const Logger_1 = require("../Logger");
const Config_1 = require("../../common/config/private/Config");
const ThreadPool_1 = require("./threading/ThreadPool");
const DiskMangerWorker_1 = require("./threading/DiskMangerWorker");
const LOG_TAG = '[DiskManager]';
class DiskManager {
    static init() {
        if (Config_1.Config.Server.Threading.enabled === true) {
            DiskManager.threadPool = new ThreadPool_1.DiskManagerTH(1);
        }
    }
    static scanDirectoryNoMetadata(relativeDirectoryName, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            settings.noMetadata = true;
            return this.scanDirectory(relativeDirectoryName, settings);
        });
    }
    static scanDirectory(relativeDirectoryName, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.Logger.silly(LOG_TAG, 'scanning directory:', relativeDirectoryName);
            let directory;
            if (Config_1.Config.Server.Threading.enabled === true) {
                directory = yield DiskManager.threadPool.execute(relativeDirectoryName, settings);
            }
            else {
                directory = yield DiskMangerWorker_1.DiskMangerWorker.scanDirectory(relativeDirectoryName, settings);
            }
            const addDirs = (dir) => {
                dir.media.forEach((ph) => {
                    ph.directory = dir;
                });
                dir.directories.forEach((d) => {
                    addDirs(d);
                });
            };
            addDirs(directory);
            return directory;
        });
    }
}
DiskManager.threadPool = null;
exports.DiskManager = DiskManager;

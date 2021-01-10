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
const Error_1 = require("../../../common/entities/Error");
const ObjectManagers_1 = require("../../model/ObjectManagers");
const Config_1 = require("../../../common/config/private/Config");
const PrivateConfig_1 = require("../../../common/config/private/PrivateConfig");
class AdminMWs {
    static loadStatistic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Statistic is only available for indexed content'));
            }
            const galleryManager = ObjectManagers_1.ObjectManagers.getInstance().GalleryManager;
            const personManager = ObjectManagers_1.ObjectManagers.getInstance().PersonManager;
            try {
                req.resultPipe = {
                    directories: yield galleryManager.countDirectories(),
                    photos: yield galleryManager.countPhotos(),
                    videos: yield galleryManager.countVideos(),
                    diskUsage: yield galleryManager.countMediaSize(),
                    persons: yield personManager.countFaces(),
                };
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error while getting statistic: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error while getting statistic', err));
            }
        });
    }
    static getDuplicates(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Statistic is only available for indexed content'));
            }
            const galleryManager = ObjectManagers_1.ObjectManagers.getInstance().GalleryManager;
            try {
                req.resultPipe = yield galleryManager.getPossibleDuplicates();
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error while getting duplicates: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, 'Error while getting duplicates', err));
            }
        });
    }
    static startJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const JobConfig = req.body.config;
                const soloRun = req.body.soloRun;
                const allowParallelRun = req.body.allowParallelRun;
                yield ObjectManagers_1.ObjectManagers.getInstance().JobManager.run(id, JobConfig, soloRun, allowParallelRun);
                req.resultPipe = 'ok';
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.JOB_ERROR, 'Job error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.JOB_ERROR, 'Job error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static stopJob(req, res, next) {
        try {
            const id = req.params.id;
            ObjectManagers_1.ObjectManagers.getInstance().JobManager.stop(id);
            req.resultPipe = 'ok';
            return next();
        }
        catch (err) {
            if (err instanceof Error) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.JOB_ERROR, 'Job error: ' + err.toString(), err));
            }
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.JOB_ERROR, 'Job error: ' + JSON.stringify(err, null, '  '), err));
        }
    }
    static getAvailableJobs(req, res, next) {
        try {
            req.resultPipe = ObjectManagers_1.ObjectManagers.getInstance().JobManager.getAvailableJobs();
            return next();
        }
        catch (err) {
            if (err instanceof Error) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.JOB_ERROR, 'Job error: ' + err.toString(), err));
            }
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.JOB_ERROR, 'Job error: ' + JSON.stringify(err, null, '  '), err));
        }
    }
    static getJobProgresses(req, res, next) {
        try {
            req.resultPipe = ObjectManagers_1.ObjectManagers.getInstance().JobManager.getProgresses();
            return next();
        }
        catch (err) {
            if (err instanceof Error) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.JOB_ERROR, 'Job error: ' + err.toString(), err));
            }
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.JOB_ERROR, 'Job error: ' + JSON.stringify(err, null, '  '), err));
        }
    }
}
exports.AdminMWs = AdminMWs;

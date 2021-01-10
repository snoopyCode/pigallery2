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
const Logger_1 = require("../../Logger");
const Config_1 = require("../../../common/config/private/Config");
const ConfigDiagnostics_1 = require("../../model/diagnostics/ConfigDiagnostics");
const ProjectPath_1 = require("../../ProjectPath");
const PrivateConfig_1 = require("../../../common/config/private/PrivateConfig");
const LOG_TAG = '[SettingsMWs]';
class SettingsMWs {
    static updateDatabaseSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            const databaseSettings = req.body.settings;
            try {
                if (databaseSettings.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                    yield ConfigDiagnostics_1.ConfigDiagnostics.testDatabase(databaseSettings);
                }
                Config_1.Config.Server.Database = databaseSettings;
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                original.Server.Database = databaseSettings;
                if (databaseSettings.type === PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                    original.Client.Sharing.enabled = false;
                    original.Client.Search.enabled = false;
                }
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                yield ObjectManagers_1.ObjectManagers.reset();
                if (Config_1.Config.Server.Database.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                    yield ObjectManagers_1.ObjectManagers.InitSQLManagers();
                }
                else {
                    yield ObjectManagers_1.ObjectManagers.InitMemoryManagers();
                }
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Error while saving database settings: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Error while saving database settings', err));
            }
        });
    }
    static updateMapSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                yield ConfigDiagnostics_1.ConfigDiagnostics.testMapConfig(req.body.settings);
                Config_1.Config.Client.Map = req.body.settings;
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                original.Client.Map = req.body.settings;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateVideoSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                const settings = req.body.settings;
                const original = yield Config_1.Config.original();
                yield ConfigDiagnostics_1.ConfigDiagnostics.testClientVideoConfig(settings.client);
                yield ConfigDiagnostics_1.ConfigDiagnostics.testServerVideoConfig(settings.server, original);
                Config_1.Config.Server.Media.Video = settings.server;
                Config_1.Config.Client.Media.Video = settings.client;
                // only updating explicitly set config (not saving config set by the diagnostics)
                original.Server.Media.Video = settings.server;
                original.Client.Media.Video = settings.client;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateMetaFileSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                const original = yield Config_1.Config.original();
                yield ConfigDiagnostics_1.ConfigDiagnostics.testMetaFileConfig(req.body.settings, original);
                Config_1.Config.Client.MetaFile = req.body.settings;
                // only updating explicitly set config (not saving config set by the diagnostics)
                original.Client.MetaFile = req.body.settings;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateShareSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                yield ConfigDiagnostics_1.ConfigDiagnostics.testSharingConfig(req.body.settings, original);
                Config_1.Config.Client.Sharing = req.body.settings;
                original.Client.Sharing = req.body.settings;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateRandomPhotoSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                yield ConfigDiagnostics_1.ConfigDiagnostics.testRandomPhotoConfig(req.body.settings, original);
                Config_1.Config.Client.RandomPhoto = req.body.settings;
                original.Client.RandomPhoto = req.body.settings;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateSearchSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                yield ConfigDiagnostics_1.ConfigDiagnostics.testSearchConfig(req.body.settings, original);
                Config_1.Config.Client.Search = req.body.settings;
                original.Client.Search = req.body.settings;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateFacesSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                yield ConfigDiagnostics_1.ConfigDiagnostics.testFacesConfig(req.body.settings, original);
                Config_1.Config.Client.Faces = req.body.settings;
                original.Client.Faces = req.body.settings;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateAuthenticationSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                Config_1.Config.Client.authenticationRequired = req.body.settings;
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                original.Client.authenticationRequired = req.body.settings;
                if (original.Client.authenticationRequired === false) {
                    original.Client.Sharing.enabled = false;
                }
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateThumbnailSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                const settings = req.body.settings;
                yield ConfigDiagnostics_1.ConfigDiagnostics.testServerThumbnailConfig(settings.server);
                yield ConfigDiagnostics_1.ConfigDiagnostics.testClientThumbnailConfig(settings.client);
                Config_1.Config.Server.Media.Thumbnail = settings.server;
                Config_1.Config.Client.Media.Thumbnail = settings.client;
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                original.Server.Media.Thumbnail = settings.server;
                original.Client.Media.Thumbnail = settings.client;
                original.save();
                ProjectPath_1.ProjectPath.reset();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updatePhotoSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                const settings = req.body.settings;
                yield ConfigDiagnostics_1.ConfigDiagnostics.testServerPhotoConfig(settings.server);
                yield ConfigDiagnostics_1.ConfigDiagnostics.testClientPhotoConfig(settings.client);
                Config_1.Config.Server.Media.Photo = settings.server;
                Config_1.Config.Client.Media.Photo = settings.client;
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                original.Server.Media.Photo = settings.server;
                original.Client.Media.Photo = settings.client;
                original.save();
                ProjectPath_1.ProjectPath.reset();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateBasicSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                const settings = req.body.settings;
                yield ConfigDiagnostics_1.ConfigDiagnostics.testImageFolder(settings.imagesFolder);
                Config_1.Config.Server.port = settings.port;
                Config_1.Config.Server.host = settings.host;
                Config_1.Config.Server.Media.folder = settings.imagesFolder;
                Config_1.Config.Client.publicUrl = settings.publicUrl;
                Config_1.Config.Client.urlBase = settings.urlBase;
                Config_1.Config.Client.applicationTitle = settings.applicationTitle;
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                original.Server.port = settings.port;
                original.Server.host = settings.host;
                original.Server.Media.folder = settings.imagesFolder;
                original.Client.publicUrl = settings.publicUrl;
                original.Client.urlBase = settings.urlBase;
                original.Client.applicationTitle = settings.applicationTitle;
                original.save();
                ProjectPath_1.ProjectPath.reset();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateOtherSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                const settings = req.body.settings;
                Config_1.Config.Client.Other.enableCache = settings.Client.enableCache;
                Config_1.Config.Client.Other.captionFirstNaming = settings.Client.captionFirstNaming;
                Config_1.Config.Client.Other.enableOnScrollRendering = settings.Client.enableOnScrollRendering;
                Config_1.Config.Client.Other.enableOnScrollThumbnailPrioritising = settings.Client.enableOnScrollThumbnailPrioritising;
                Config_1.Config.Client.Other.defaultPhotoSortingMethod = settings.Client.defaultPhotoSortingMethod;
                Config_1.Config.Client.Other.NavBar.showItemCount = settings.Client.NavBar.showItemCount;
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                original.Client.Other.enableCache = settings.Client.enableCache;
                original.Client.Other.captionFirstNaming = settings.Client.captionFirstNaming;
                original.Client.Other.enableOnScrollRendering = settings.Client.enableOnScrollRendering;
                original.Client.Other.enableOnScrollThumbnailPrioritising = settings.Client.enableOnScrollThumbnailPrioritising;
                original.Client.Other.defaultPhotoSortingMethod = settings.Client.defaultPhotoSortingMethod;
                original.Client.Other.NavBar.showItemCount = settings.Client.NavBar.showItemCount;
                original.Server.Threading.enabled = settings.Server.enabled;
                original.Server.Threading.thumbnailThreads = settings.Server.thumbnailThreads;
                yield original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateIndexingSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                const settings = req.body.settings;
                Config_1.Config.Server.Indexing = settings;
                // only updating explicitly set config (not saving config set by the diagnostics)
                const original = yield Config_1.Config.original();
                original.Server.Indexing = settings;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
    static updateJobSettings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((typeof req.body === 'undefined') || (typeof req.body.settings === 'undefined')) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.INPUT_ERROR, 'settings is needed'));
            }
            try {
                // only updating explicitly set config (not saving config set by the diagnostics)
                const settings = req.body.settings;
                const original = yield Config_1.Config.original();
                yield ConfigDiagnostics_1.ConfigDiagnostics.testTasksConfig(settings, original);
                Config_1.Config.Server.Jobs = settings;
                original.Server.Jobs = settings;
                original.save();
                yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
                ObjectManagers_1.ObjectManagers.getInstance().JobManager.runSchedules();
                Logger_1.Logger.info(LOG_TAG, 'new config:');
                Logger_1.Logger.info(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
                return next();
            }
            catch (err) {
                if (err instanceof Error) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + err.toString(), err));
                }
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SETTINGS_ERROR, 'Settings error: ' + JSON.stringify(err, null, '  '), err));
            }
        });
    }
}
exports.SettingsMWs = SettingsMWs;

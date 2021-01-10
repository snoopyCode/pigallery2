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
const Config_1 = require("../../../common/config/private/Config");
const Logger_1 = require("../../Logger");
const NotifocationManager_1 = require("../NotifocationManager");
const SQLConnection_1 = require("../database/sql/SQLConnection");
const fs = require("fs");
const FFmpegFactory_1 = require("../FFmpegFactory");
const ClientConfig_1 = require("../../../common/config/public/ClientConfig");
const PrivateConfig_1 = require("../../../common/config/private/PrivateConfig");
const LOG_TAG = '[ConfigDiagnostics]';
class ConfigDiagnostics {
    static checkReadWritePermission(path) {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line:no-bitwise
            fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
    static testDatabase(databaseConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (databaseConfig.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                yield SQLConnection_1.SQLConnection.tryConnection(databaseConfig);
            }
            if (databaseConfig.type !== PrivateConfig_1.ServerConfig.DatabaseType.sqlite) {
                try {
                    yield this.checkReadWritePermission(SQLConnection_1.SQLConnection.getSQLiteDB(databaseConfig));
                }
                catch (e) {
                    throw new Error('Cannot read or write sqlite storage file: ' + SQLConnection_1.SQLConnection.getSQLiteDB(databaseConfig));
                }
            }
        });
    }
    static testMetaFileConfig(metaFileConfig, config) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: now we have metadata for pg2conf files too not only gpx that also runs without map
            if (metaFileConfig.enabled === true &&
                config.Client.Map.enabled === false) {
                throw new Error('*.gpx meta files are not supported without MAP');
            }
        });
    }
    static testClientVideoConfig(videoConfig) {
        return new Promise((resolve, reject) => {
            try {
                if (videoConfig.enabled === true) {
                    const ffmpeg = FFmpegFactory_1.FFmpegFactory.get();
                    ffmpeg().getAvailableCodecs((err) => {
                        if (err) {
                            return reject(new Error('Error accessing ffmpeg, cant find executable: ' + err.toString()));
                        }
                        ffmpeg(__dirname + '/blank.jpg').ffprobe((err2) => {
                            if (err2) {
                                return reject(new Error('Error accessing ffmpeg-probe, cant find executable: ' + err2.toString()));
                            }
                            return resolve();
                        });
                    });
                }
                else {
                    return resolve();
                }
            }
            catch (e) {
                return reject(new Error('unknown video error: ' + e.toString()));
            }
        });
    }
    static testServerVideoConfig(videoConfig, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config.Client.Media.Video.enabled === true) {
                if (videoConfig.transcoding.fps <= 0) {
                    throw new Error('fps should be grater than 0');
                }
            }
        });
    }
    static testSharp() {
        return __awaiter(this, void 0, void 0, function* () {
            const sharp = require('sharp');
            sharp();
        });
    }
    static testTempFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkReadWritePermission(folder);
        });
    }
    static testImageFolder(folder) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(folder)) {
                reject('Images folder not exists: \'' + folder + '\'');
            }
            fs.access(folder, fs.constants.R_OK, (err) => {
                if (err) {
                    reject({ message: 'Error during getting read access to images folder', error: err.toString() });
                }
            });
            resolve();
        });
    }
    static testServerPhotoConfig(server) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static testClientPhotoConfig(client) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static testServerThumbnailConfig(server) {
        return __awaiter(this, void 0, void 0, function* () {
            if (server.personFaceMargin < 0 || server.personFaceMargin > 1) {
                throw new Error('personFaceMargin should be between 0 and 1');
            }
        });
    }
    static testClientThumbnailConfig(thumbnailConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(thumbnailConfig.iconSize) || thumbnailConfig.iconSize <= 0) {
                throw new Error('IconSize has to be >= 0 integer, got: ' + thumbnailConfig.iconSize);
            }
            if (!thumbnailConfig.thumbnailSizes.length) {
                throw new Error('At least one thumbnail size is needed');
            }
            for (let i = 0; i < thumbnailConfig.thumbnailSizes.length; i++) {
                if (isNaN(thumbnailConfig.thumbnailSizes[i]) || thumbnailConfig.thumbnailSizes[i] <= 0) {
                    throw new Error('Thumbnail size has to be >= 0 integer, got: ' + thumbnailConfig.thumbnailSizes[i]);
                }
            }
        });
    }
    static testTasksConfig(task, config) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static testFacesConfig(faces, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (faces.enabled === true) {
                if (config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                    throw new Error('Memory Database do not support faces');
                }
                if (config.Client.Search.enabled === false) {
                    throw new Error('Faces support needs enabled search');
                }
            }
        });
    }
    static testSearchConfig(search, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (search.enabled === true &&
                config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                throw new Error('Memory Database do not support searching');
            }
        });
    }
    static testSharingConfig(sharing, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sharing.enabled === true &&
                config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                throw new Error('Memory Database do not support sharing');
            }
            if (sharing.enabled === true &&
                config.Client.authenticationRequired === false) {
                throw new Error('In case of no authentication, sharing is not supported');
            }
        });
    }
    static testRandomPhotoConfig(sharing, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sharing.enabled === true &&
                config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                throw new Error('Memory Database do not support random photo');
            }
        });
    }
    static testMapConfig(map) {
        return __awaiter(this, void 0, void 0, function* () {
            if (map.enabled === false) {
                return;
            }
            if (map.mapProvider === ClientConfig_1.ClientConfig.MapProviders.Mapbox &&
                (!map.mapboxAccessToken || map.mapboxAccessToken.length === 0)) {
                throw new Error('Mapbox needs a valid api key.');
            }
            if (map.mapProvider === ClientConfig_1.ClientConfig.MapProviders.Custom &&
                (!map.customLayers || map.customLayers.length === 0)) {
                throw new Error('Custom maps need at least one valid layer');
            }
            if (map.mapProvider === ClientConfig_1.ClientConfig.MapProviders.Custom) {
                map.customLayers.forEach((l) => {
                    if (!l.url || l.url.length === 0) {
                        throw new Error('Custom maps url need to be a valid layer');
                    }
                });
            }
        });
    }
    static runDiagnostics() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Config_1.Config.Server.Database.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                try {
                    yield ConfigDiagnostics.testDatabase(Config_1.Config.Server.Database);
                }
                catch (ex) {
                    const err = ex;
                    Logger_1.Logger.warn(LOG_TAG, '[SQL error]', err.toString());
                    Logger_1.Logger.error(LOG_TAG, 'Error during initializing SQL DB, check DB connection and settings');
                    process.exit(1);
                }
            }
            try {
                yield ConfigDiagnostics.testSharp();
            }
            catch (ex) {
                const err = ex;
                Logger_1.Logger.warn(LOG_TAG, '[Thumbnail hardware acceleration] module error: ', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Thumbnail hardware acceleration is not possible.' +
                    ' \'sharp\' node module is not found.' +
                    ' Falling back temporally to JS based thumbnail generation');
                process.exit(1);
            }
            try {
                yield ConfigDiagnostics.testTempFolder(Config_1.Config.Server.Media.tempFolder);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.error('Thumbnail folder error', err.toString());
                Logger_1.Logger.error(LOG_TAG, 'Thumbnail folder error', err.toString());
            }
            try {
                yield ConfigDiagnostics.testClientVideoConfig(Config_1.Config.Client.Media.Video);
                yield ConfigDiagnostics.testServerVideoConfig(Config_1.Config.Server.Media.Video, Config_1.Config);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.warning('Video support error, switching off..', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Video support error, switching off..', err.toString());
                Config_1.Config.Client.Media.Video.enabled = false;
            }
            try {
                yield ConfigDiagnostics.testMetaFileConfig(Config_1.Config.Client.MetaFile, Config_1.Config);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.warning('Meta file support error, switching off..', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Meta file support error, switching off..', err.toString());
                Config_1.Config.Client.MetaFile.enabled = false;
            }
            try {
                yield ConfigDiagnostics.testImageFolder(Config_1.Config.Server.Media.folder);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.error('Images folder error', err.toString());
                Logger_1.Logger.error(LOG_TAG, 'Images folder error', err.toString());
            }
            try {
                yield ConfigDiagnostics.testClientThumbnailConfig(Config_1.Config.Client.Media.Thumbnail);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.error('Thumbnail settings error', err.toString());
                Logger_1.Logger.error(LOG_TAG, 'Thumbnail settings error', err.toString());
            }
            try {
                yield ConfigDiagnostics.testSearchConfig(Config_1.Config.Client.Search, Config_1.Config);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.warning('Search is not supported with these settings. Disabling temporally. ' +
                    'Please adjust the config properly.', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Search is not supported with these settings, switching off..', err.toString());
                Config_1.Config.Client.Search.enabled = false;
            }
            try {
                yield ConfigDiagnostics.testFacesConfig(Config_1.Config.Client.Faces, Config_1.Config);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.warning('Faces are not supported with these settings. Disabling temporally. ' +
                    'Please adjust the config properly.', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Faces are not supported with these settings, switching off..', err.toString());
                Config_1.Config.Client.Faces.enabled = false;
            }
            try {
                yield ConfigDiagnostics.testTasksConfig(Config_1.Config.Server.Jobs, Config_1.Config);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.warning('Some Tasks are not supported with these settings. Disabling temporally. ' +
                    'Please adjust the config properly.', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Some Tasks not supported with these settings, switching off..', err.toString());
                Config_1.Config.Client.Faces.enabled = false;
            }
            try {
                yield ConfigDiagnostics.testSharingConfig(Config_1.Config.Client.Sharing, Config_1.Config);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.warning('Sharing is not supported with these settings. Disabling temporally. ' +
                    'Please adjust the config properly.', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Sharing is not supported with these settings, switching off..', err.toString());
                Config_1.Config.Client.Sharing.enabled = false;
            }
            try {
                yield ConfigDiagnostics.testRandomPhotoConfig(Config_1.Config.Client.Sharing, Config_1.Config);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.warning('Random Media is not supported with these settings. Disabling temporally. ' +
                    'Please adjust the config properly.', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Random Media is not supported with these settings, switching off..', err.toString());
                Config_1.Config.Client.Sharing.enabled = false;
            }
            try {
                yield ConfigDiagnostics.testMapConfig(Config_1.Config.Client.Map);
            }
            catch (ex) {
                const err = ex;
                NotifocationManager_1.NotificationManager.warning('Maps is not supported with these settings. Using open street maps temporally. ' +
                    'Please adjust the config properly.', err.toString());
                Logger_1.Logger.warn(LOG_TAG, 'Maps is not supported with these settings. Using open street maps temporally ' +
                    'Please adjust the config properly.', err.toString());
                Config_1.Config.Client.Map.mapProvider = ClientConfig_1.ClientConfig.MapProviders.OpenStreetMap;
            }
        });
    }
}
exports.ConfigDiagnostics = ConfigDiagnostics;

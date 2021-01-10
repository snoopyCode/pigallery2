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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const UserEntity_1 = require("./enitites/UserEntity");
const UserDTO_1 = require("../../../../common/entities/UserDTO");
const PhotoEntity_1 = require("./enitites/PhotoEntity");
const DirectoryEntity_1 = require("./enitites/DirectoryEntity");
const Config_1 = require("../../../../common/config/private/Config");
const SharingEntity_1 = require("./enitites/SharingEntity");
const PasswordHelper_1 = require("../../PasswordHelper");
const ProjectPath_1 = require("../../../ProjectPath");
const VersionEntity_1 = require("./enitites/VersionEntity");
const Logger_1 = require("../../../Logger");
const MediaEntity_1 = require("./enitites/MediaEntity");
const VideoEntity_1 = require("./enitites/VideoEntity");
const DataStructureVersion_1 = require("../../../../common/DataStructureVersion");
const FileEntity_1 = require("./enitites/FileEntity");
const FaceRegionEntry_1 = require("./enitites/FaceRegionEntry");
const PersonEntry_1 = require("./enitites/PersonEntry");
const Utils_1 = require("../../../../common/Utils");
const path = require("path");
const PrivateConfig_1 = require("../../../../common/config/private/PrivateConfig");
class SQLConnection {
    constructor() {
    }
    static getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection == null) {
                const options = this.getDriver(Config_1.Config.Server.Database);
                //   options.name = 'main';
                options.entities = [
                    UserEntity_1.UserEntity,
                    FileEntity_1.FileEntity,
                    FaceRegionEntry_1.FaceRegionEntry,
                    PersonEntry_1.PersonEntry,
                    MediaEntity_1.MediaEntity,
                    PhotoEntity_1.PhotoEntity,
                    VideoEntity_1.VideoEntity,
                    DirectoryEntity_1.DirectoryEntity,
                    SharingEntity_1.SharingEntity,
                    VersionEntity_1.VersionEntity
                ];
                options.synchronize = false;
                if (Config_1.Config.Server.Log.sqlLevel !== PrivateConfig_1.ServerConfig.SQLLogLevel.none) {
                    options.logging = PrivateConfig_1.ServerConfig.SQLLogLevel[Config_1.Config.Server.Log.sqlLevel];
                }
                this.connection = yield this.createConnection(options);
                yield SQLConnection.schemeSync(this.connection);
            }
            return this.connection;
        });
    }
    static tryConnection(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.getConnection('test').close();
            }
            catch (err) {
            }
            const options = this.getDriver(config);
            options.name = 'test';
            options.entities = [
                UserEntity_1.UserEntity,
                FileEntity_1.FileEntity,
                FaceRegionEntry_1.FaceRegionEntry,
                PersonEntry_1.PersonEntry,
                MediaEntity_1.MediaEntity,
                PhotoEntity_1.PhotoEntity,
                VideoEntity_1.VideoEntity,
                DirectoryEntity_1.DirectoryEntity,
                SharingEntity_1.SharingEntity,
                VersionEntity_1.VersionEntity
            ];
            options.synchronize = false;
            if (Config_1.Config.Server.Log.sqlLevel !== PrivateConfig_1.ServerConfig.SQLLogLevel.none) {
                options.logging = PrivateConfig_1.ServerConfig.SQLLogLevel[Config_1.Config.Server.Log.sqlLevel];
            }
            const conn = yield this.createConnection(options);
            yield SQLConnection.schemeSync(conn);
            yield conn.close();
            return true;
        });
    }
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.getConnection();
            // Add dummy Admin to the db
            const userRepository = connection.getRepository(UserEntity_1.UserEntity);
            const admins = yield userRepository.find({ role: UserDTO_1.UserRoles.Admin });
            if (admins.length === 0) {
                const a = new UserEntity_1.UserEntity();
                a.name = 'admin';
                a.password = PasswordHelper_1.PasswordHelper.cryptPassword('admin');
                a.role = UserDTO_1.UserRoles.Admin;
                yield userRepository.save(a);
            }
        });
    }
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.connection != null) {
                    yield this.connection.close();
                    this.connection = null;
                }
            }
            catch (err) {
                console.error('Error during closing sql db:');
                console.error(err);
            }
        });
    }
    static getSQLiteDB(config) {
        return path.join(ProjectPath_1.ProjectPath.getAbsolutePath(config.dbFolder), 'sqlite.db');
    }
    static createConnection(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.type === 'sqlite') {
                return yield typeorm_1.createConnection(options);
            }
            try {
                return yield typeorm_1.createConnection(options);
            }
            catch (e) {
                if (e.sqlMessage === 'Unknown database \'' + options.database + '\'') {
                    Logger_1.Logger.debug('creating database: ' + options.database);
                    const tmpOption = Utils_1.Utils.clone(options);
                    // @ts-ignore
                    delete tmpOption.database;
                    const tmpConn = yield typeorm_1.createConnection(tmpOption);
                    yield tmpConn.query('CREATE DATABASE IF NOT EXISTS ' + options.database);
                    yield tmpConn.close();
                    return yield typeorm_1.createConnection(options);
                }
                throw e;
            }
        });
    }
    static schemeSync(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let version = null;
            try {
                version = yield connection.getRepository(VersionEntity_1.VersionEntity).findOne();
            }
            catch (ex) {
            }
            if (version && version.version === DataStructureVersion_1.DataStructureVersion) {
                return;
            }
            Logger_1.Logger.info('Updating database scheme');
            if (!version) {
                version = new VersionEntity_1.VersionEntity();
            }
            version.version = DataStructureVersion_1.DataStructureVersion;
            let users = [];
            try {
                users = yield connection.getRepository(UserEntity_1.UserEntity).createQueryBuilder('user').getMany();
            }
            catch (ex) {
            }
            yield connection.dropDatabase();
            yield connection.synchronize();
            yield connection.getRepository(VersionEntity_1.VersionEntity).save(version);
            try {
                yield connection.getRepository(UserEntity_1.UserEntity).save(users);
            }
            catch (e) {
                yield connection.dropDatabase();
                yield connection.synchronize();
                yield connection.getRepository(VersionEntity_1.VersionEntity).save(version);
                Logger_1.Logger.warn('Could not move users to the new db scheme, deleting them. Details:' + e.toString());
            }
        });
    }
    static getDriver(config) {
        let driver = null;
        if (config.type === PrivateConfig_1.ServerConfig.DatabaseType.mysql) {
            driver = {
                type: 'mysql',
                host: config.mysql.host,
                port: config.mysql.port,
                username: config.mysql.username,
                password: config.mysql.password,
                database: config.mysql.database,
                charset: 'utf8'
            };
        }
        else if (config.type === PrivateConfig_1.ServerConfig.DatabaseType.sqlite) {
            driver = {
                type: 'sqlite',
                database: path.join(ProjectPath_1.ProjectPath.getAbsolutePath(config.dbFolder), config.sqlite.DBFileName)
            };
        }
        return driver;
    }
}
SQLConnection.connection = null;
exports.SQLConnection = SQLConnection;

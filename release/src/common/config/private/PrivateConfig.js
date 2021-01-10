"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-inferrable-types */
require("reflect-metadata");
const JobScheduleDTO_1 = require("../../entities/job/JobScheduleDTO");
const SubConfigClass_1 = require("typeconfig/src/decorators/class/SubConfigClass");
const ConfigPropoerty_1 = require("typeconfig/src/decorators/property/ConfigPropoerty");
const JobDTO_1 = require("../../entities/job/JobDTO");
var ServerConfig;
(function (ServerConfig) {
    let DatabaseType;
    (function (DatabaseType) {
        DatabaseType[DatabaseType["memory"] = 1] = "memory";
        DatabaseType[DatabaseType["mysql"] = 2] = "mysql";
        DatabaseType[DatabaseType["sqlite"] = 3] = "sqlite";
    })(DatabaseType = ServerConfig.DatabaseType || (ServerConfig.DatabaseType = {}));
    let LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["error"] = 1] = "error";
        LogLevel[LogLevel["warn"] = 2] = "warn";
        LogLevel[LogLevel["info"] = 3] = "info";
        LogLevel[LogLevel["verbose"] = 4] = "verbose";
        LogLevel[LogLevel["debug"] = 5] = "debug";
        LogLevel[LogLevel["silly"] = 6] = "silly";
    })(LogLevel = ServerConfig.LogLevel || (ServerConfig.LogLevel = {}));
    let SQLLogLevel;
    (function (SQLLogLevel) {
        SQLLogLevel[SQLLogLevel["none"] = 1] = "none";
        SQLLogLevel[SQLLogLevel["error"] = 2] = "error";
        SQLLogLevel[SQLLogLevel["all"] = 3] = "all";
    })(SQLLogLevel = ServerConfig.SQLLogLevel || (ServerConfig.SQLLogLevel = {}));
    let ReIndexingSensitivity;
    (function (ReIndexingSensitivity) {
        ReIndexingSensitivity[ReIndexingSensitivity["low"] = 1] = "low";
        ReIndexingSensitivity[ReIndexingSensitivity["medium"] = 2] = "medium";
        ReIndexingSensitivity[ReIndexingSensitivity["high"] = 3] = "high";
    })(ReIndexingSensitivity = ServerConfig.ReIndexingSensitivity || (ServerConfig.ReIndexingSensitivity = {}));
    let FFmpegPresets;
    (function (FFmpegPresets) {
        FFmpegPresets[FFmpegPresets["ultrafast"] = 1] = "ultrafast";
        FFmpegPresets[FFmpegPresets["superfast"] = 2] = "superfast";
        FFmpegPresets[FFmpegPresets["veryfast"] = 3] = "veryfast";
        FFmpegPresets[FFmpegPresets["faster"] = 4] = "faster";
        FFmpegPresets[FFmpegPresets["fast"] = 5] = "fast";
        FFmpegPresets[FFmpegPresets["medium"] = 6] = "medium";
        FFmpegPresets[FFmpegPresets["slow"] = 7] = "slow";
        FFmpegPresets[FFmpegPresets["slower"] = 8] = "slower";
        FFmpegPresets[FFmpegPresets["veryslow"] = 9] = "veryslow";
        FFmpegPresets[FFmpegPresets["placebo"] = 10] = "placebo";
    })(FFmpegPresets = ServerConfig.FFmpegPresets || (ServerConfig.FFmpegPresets = {}));
    let MySQLConfig = class MySQLConfig {
        constructor() {
            this.host = 'localhost';
            this.port = 3306;
            this.database = 'pigallery2';
            this.username = '';
            this.password = '';
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ envAlias: 'MYSQL_HOST' }),
        __metadata("design:type", String)
    ], MySQLConfig.prototype, "host", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ envAlias: 'MYSQL_PORT', min: 0, max: 65535 }),
        __metadata("design:type", Number)
    ], MySQLConfig.prototype, "port", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ envAlias: 'MYSQL_DATABASE' }),
        __metadata("design:type", String)
    ], MySQLConfig.prototype, "database", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ envAlias: 'MYSQL_USERNAME' }),
        __metadata("design:type", String)
    ], MySQLConfig.prototype, "username", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ envAlias: 'MYSQL_PASSWORD', type: 'password' }),
        __metadata("design:type", String)
    ], MySQLConfig.prototype, "password", void 0);
    MySQLConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], MySQLConfig);
    ServerConfig.MySQLConfig = MySQLConfig;
    let SQLiteConfig = class SQLiteConfig {
        constructor() {
            this.DBFileName = 'sqlite.db';
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", String)
    ], SQLiteConfig.prototype, "DBFileName", void 0);
    SQLiteConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], SQLiteConfig);
    ServerConfig.SQLiteConfig = SQLiteConfig;
    let DataBaseConfig = class DataBaseConfig {
        constructor() {
            this.type = DatabaseType.sqlite;
            this.dbFolder = 'db';
            this.sqlite = new SQLiteConfig();
            this.mysql = new MySQLConfig();
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({
            type: DatabaseType,
            onNewValue: (value, config) => {
                if (value === ServerConfig.DatabaseType.memory) {
                    config.Client.Search.enabled = false;
                    config.Client.Sharing.enabled = false;
                }
            }
        }),
        __metadata("design:type", Number)
    ], DataBaseConfig.prototype, "type", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", String)
    ], DataBaseConfig.prototype, "dbFolder", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", SQLiteConfig)
    ], DataBaseConfig.prototype, "sqlite", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", MySQLConfig)
    ], DataBaseConfig.prototype, "mysql", void 0);
    DataBaseConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], DataBaseConfig);
    ServerConfig.DataBaseConfig = DataBaseConfig;
    let ThumbnailConfig = class ThumbnailConfig {
        constructor() {
            this.qualityPriority = true;
            this.personFaceMargin = 0.6; // in ration [0-1]
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ description: 'if true, photos will have better quality.' }),
        __metadata("design:type", Boolean)
    ], ThumbnailConfig.prototype, "qualityPriority", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'ratio' }),
        __metadata("design:type", Number)
    ], ThumbnailConfig.prototype, "personFaceMargin", void 0);
    ThumbnailConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], ThumbnailConfig);
    ServerConfig.ThumbnailConfig = ThumbnailConfig;
    let SharingConfig = class SharingConfig {
        constructor() {
            this.updateTimeout = 1000 * 60 * 5;
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Number)
    ], SharingConfig.prototype, "updateTimeout", void 0);
    SharingConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], SharingConfig);
    ServerConfig.SharingConfig = SharingConfig;
    let IndexingConfig = class IndexingConfig {
        constructor() {
            this.folderPreviewSize = 2;
            this.cachedFolderTimeout = 1000 * 60 * 60; // Do not rescans the folder if seems ok
            this.reIndexingSensitivity = ReIndexingSensitivity.low;
            this.excludeFolderList = ['.Trash-1000', '.dtrash', '$RECYCLE.BIN'];
            this.excludeFileList = [];
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Number)
    ], IndexingConfig.prototype, "folderPreviewSize", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Number)
    ], IndexingConfig.prototype, "cachedFolderTimeout", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: ReIndexingSensitivity }),
        __metadata("design:type", Number)
    ], IndexingConfig.prototype, "reIndexingSensitivity", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({
            arrayType: 'string',
            description: 'If an entry starts with \'/\' it is treated as an absolute path.' +
                ' If it doesn\'t start with \'/\' but contains a \'/\', the path is relative to the image directory.' +
                ' If it doesn\'t contain a \'/\', any folder with this name will be excluded.'
        }),
        __metadata("design:type", Array)
    ], IndexingConfig.prototype, "excludeFolderList", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ arrayType: 'string', description: 'Any folder that contains a file with this name will be excluded from indexing.' }),
        __metadata("design:type", Array)
    ], IndexingConfig.prototype, "excludeFileList", void 0);
    IndexingConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], IndexingConfig);
    ServerConfig.IndexingConfig = IndexingConfig;
    let ThreadingConfig = class ThreadingConfig {
        constructor() {
            this.enabled = true;
            this.thumbnailThreads = 0; // if zero-> CPU count -1
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ description: 'App can run on multiple thread' }),
        __metadata("design:type", Boolean)
    ], ThreadingConfig.prototype, "enabled", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ description: 'Number of threads that are used to generate thumbnails. If 0, number of \'CPU cores -1\' threads will be used.' }),
        __metadata("design:type", Number)
    ], ThreadingConfig.prototype, "thumbnailThreads", void 0);
    ThreadingConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], ThreadingConfig);
    ServerConfig.ThreadingConfig = ThreadingConfig;
    let DuplicatesConfig = class DuplicatesConfig {
        constructor() {
            this.listingLimit = 1000; // maximum number of duplicates to list
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Number)
    ], DuplicatesConfig.prototype, "listingLimit", void 0);
    DuplicatesConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], DuplicatesConfig);
    ServerConfig.DuplicatesConfig = DuplicatesConfig;
    let LogConfig = class LogConfig {
        constructor() {
            this.level = LogLevel.info;
            this.sqlLevel = SQLLogLevel.error;
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: LogLevel }),
        __metadata("design:type", Number)
    ], LogConfig.prototype, "level", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: SQLLogLevel }),
        __metadata("design:type", Number)
    ], LogConfig.prototype, "sqlLevel", void 0);
    LogConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], LogConfig);
    ServerConfig.LogConfig = LogConfig;
    let NeverJobTrigger = class NeverJobTrigger {
        constructor() {
            this.type = JobScheduleDTO_1.JobTriggerType.never;
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: JobScheduleDTO_1.JobTriggerType }),
        __metadata("design:type", Object)
    ], NeverJobTrigger.prototype, "type", void 0);
    NeverJobTrigger = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], NeverJobTrigger);
    ServerConfig.NeverJobTrigger = NeverJobTrigger;
    let ScheduledJobTrigger = class ScheduledJobTrigger {
        constructor() {
            this.type = JobScheduleDTO_1.JobTriggerType.scheduled;
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: JobScheduleDTO_1.JobTriggerType }),
        __metadata("design:type", Object)
    ], ScheduledJobTrigger.prototype, "type", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Number)
    ], ScheduledJobTrigger.prototype, "time", void 0);
    ScheduledJobTrigger = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], ScheduledJobTrigger);
    ServerConfig.ScheduledJobTrigger = ScheduledJobTrigger;
    let PeriodicJobTrigger = class PeriodicJobTrigger {
        constructor() {
            this.type = JobScheduleDTO_1.JobTriggerType.periodic;
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: JobScheduleDTO_1.JobTriggerType }),
        __metadata("design:type", Object)
    ], PeriodicJobTrigger.prototype, "type", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Number)
    ], PeriodicJobTrigger.prototype, "periodicity", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Number)
    ], PeriodicJobTrigger.prototype, "atTime", void 0);
    PeriodicJobTrigger = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], PeriodicJobTrigger);
    ServerConfig.PeriodicJobTrigger = PeriodicJobTrigger;
    let AfterJobTrigger = class AfterJobTrigger {
        constructor(afterScheduleName) {
            this.type = JobScheduleDTO_1.JobTriggerType.after;
            this.afterScheduleName = afterScheduleName;
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: JobScheduleDTO_1.JobTriggerType }),
        __metadata("design:type", Object)
    ], AfterJobTrigger.prototype, "type", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", String)
    ], AfterJobTrigger.prototype, "afterScheduleName", void 0);
    AfterJobTrigger = __decorate([
        SubConfigClass_1.SubConfigClass(),
        __metadata("design:paramtypes", [String])
    ], AfterJobTrigger);
    ServerConfig.AfterJobTrigger = AfterJobTrigger;
    let JobScheduleConfig = class JobScheduleConfig {
        constructor(name, jobName, allowParallelRun, trigger, config) {
            this.config = {};
            this.name = name;
            this.jobName = jobName;
            this.config = config;
            this.allowParallelRun = allowParallelRun;
            this.trigger = trigger;
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", String)
    ], JobScheduleConfig.prototype, "name", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", String)
    ], JobScheduleConfig.prototype, "jobName", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Object)
    ], JobScheduleConfig.prototype, "config", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", Boolean)
    ], JobScheduleConfig.prototype, "allowParallelRun", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({
            type: NeverJobTrigger,
            typeBuilder: (v) => {
                const type = typeof v.type === 'number' ? v.type : JobScheduleDTO_1.JobTriggerType[v.type];
                switch (type) {
                    case JobScheduleDTO_1.JobTriggerType.after:
                        return AfterJobTrigger;
                    case JobScheduleDTO_1.JobTriggerType.never:
                        return NeverJobTrigger;
                    case JobScheduleDTO_1.JobTriggerType.scheduled:
                        return ScheduledJobTrigger;
                    case JobScheduleDTO_1.JobTriggerType.periodic:
                        return PeriodicJobTrigger;
                }
                return null;
            }
        }),
        __metadata("design:type", Object)
    ], JobScheduleConfig.prototype, "trigger", void 0);
    JobScheduleConfig = __decorate([
        SubConfigClass_1.SubConfigClass(),
        __metadata("design:paramtypes", [String, String, Boolean, Object, Object])
    ], JobScheduleConfig);
    ServerConfig.JobScheduleConfig = JobScheduleConfig;
    let JobConfig = class JobConfig {
        constructor() {
            this.maxSavedProgress = 10;
            this.scheduled = [
                new JobScheduleConfig(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs.Indexing], JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs.Indexing], false, new NeverJobTrigger(), {}),
                new JobScheduleConfig(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Thumbnail Generation']], JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Thumbnail Generation']], false, new AfterJobTrigger(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs.Indexing]), { sizes: [240], indexedOnly: true }),
                new JobScheduleConfig(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Photo Converting']], JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Photo Converting']], false, new AfterJobTrigger(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Thumbnail Generation']]), { indexedOnly: true }),
                new JobScheduleConfig(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Video Converting']], JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Video Converting']], false, new AfterJobTrigger(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Photo Converting']]), { indexedOnly: true }),
                new JobScheduleConfig(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Temp Folder Cleaning']], JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Temp Folder Cleaning']], false, new AfterJobTrigger(JobDTO_1.DefaultsJobs[JobDTO_1.DefaultsJobs['Video Converting']]), { indexedOnly: true }),
            ];
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'integer', description: 'Job history size' }),
        __metadata("design:type", Number)
    ], JobConfig.prototype, "maxSavedProgress", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ arrayType: JobScheduleConfig }),
        __metadata("design:type", Array)
    ], JobConfig.prototype, "scheduled", void 0);
    JobConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], JobConfig);
    ServerConfig.JobConfig = JobConfig;
    let VideoTranscodingConfig = class VideoTranscodingConfig {
        constructor() {
            this.bitRate = 5 * 1024 * 1024;
            this.resolution = 720;
            this.fps = 25;
            this.codec = 'libx264';
            this.format = 'mp4';
            this.crf = 23;
            this.preset = FFmpegPresets.medium;
            this.customOptions = [];
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], VideoTranscodingConfig.prototype, "bitRate", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], VideoTranscodingConfig.prototype, "resolution", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'positiveFloat' }),
        __metadata("design:type", Number)
    ], VideoTranscodingConfig.prototype, "fps", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", String)
    ], VideoTranscodingConfig.prototype, "codec", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", String)
    ], VideoTranscodingConfig.prototype, "format", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({
            type: 'unsignedInt',
            description: 'Constant Rate Factor. The range of the CRF scale is 0–51, where 0 is lossless, 23 is the default, and 51 is worst quality possible.',
            max: 51
        }),
        __metadata("design:type", Number)
    ], VideoTranscodingConfig.prototype, "crf", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({
            type: FFmpegPresets,
            description: 'A preset is a collection of options that will provide a certain encoding speed to compression ratio'
        }),
        __metadata("design:type", Number)
    ], VideoTranscodingConfig.prototype, "preset", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ arrayType: 'string', description: 'It will be sent to ffmpeg as it is, as custom options.' }),
        __metadata("design:type", Array)
    ], VideoTranscodingConfig.prototype, "customOptions", void 0);
    VideoTranscodingConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], VideoTranscodingConfig);
    ServerConfig.VideoTranscodingConfig = VideoTranscodingConfig;
    let VideoConfig = class VideoConfig {
        constructor() {
            this.transcoding = new VideoTranscodingConfig();
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", VideoTranscodingConfig)
    ], VideoConfig.prototype, "transcoding", void 0);
    VideoConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], VideoConfig);
    ServerConfig.VideoConfig = VideoConfig;
    let PhotoConvertingConfig = class PhotoConvertingConfig {
        constructor() {
            this.onTheFly = true;
            this.resolution = 1080;
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ description: 'Converts photos on the fly, when they are requested.' }),
        __metadata("design:type", Boolean)
    ], PhotoConvertingConfig.prototype, "onTheFly", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'unsignedInt' }),
        __metadata("design:type", Number)
    ], PhotoConvertingConfig.prototype, "resolution", void 0);
    PhotoConvertingConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], PhotoConvertingConfig);
    ServerConfig.PhotoConvertingConfig = PhotoConvertingConfig;
    let PhotoConfig = class PhotoConfig {
        constructor() {
            this.Converting = new PhotoConvertingConfig();
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", PhotoConvertingConfig)
    ], PhotoConfig.prototype, "Converting", void 0);
    PhotoConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], PhotoConfig);
    ServerConfig.PhotoConfig = PhotoConfig;
    let MediaConfig = class MediaConfig {
        constructor() {
            this.folder = 'demo/images';
            this.tempFolder = 'demo/tmp';
            this.Video = new VideoConfig();
            this.Photo = new PhotoConfig();
            this.Thumbnail = new ThumbnailConfig();
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ description: 'Images are loaded from this folder (read permission required)' }),
        __metadata("design:type", String)
    ], MediaConfig.prototype, "folder", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ description: 'Thumbnails, coverted photos, videos will be stored here (write permission required)' }),
        __metadata("design:type", String)
    ], MediaConfig.prototype, "tempFolder", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", VideoConfig)
    ], MediaConfig.prototype, "Video", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", PhotoConfig)
    ], MediaConfig.prototype, "Photo", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", ThumbnailConfig)
    ], MediaConfig.prototype, "Thumbnail", void 0);
    MediaConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], MediaConfig);
    ServerConfig.MediaConfig = MediaConfig;
    let EnvironmentConfig = class EnvironmentConfig {
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ volatile: true }),
        __metadata("design:type", String)
    ], EnvironmentConfig.prototype, "upTime", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ volatile: true }),
        __metadata("design:type", String)
    ], EnvironmentConfig.prototype, "appVersion", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ volatile: true }),
        __metadata("design:type", String)
    ], EnvironmentConfig.prototype, "buildTime", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ volatile: true }),
        __metadata("design:type", String)
    ], EnvironmentConfig.prototype, "buildCommitHash", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ volatile: true }),
        __metadata("design:type", Boolean)
    ], EnvironmentConfig.prototype, "isDocker", void 0);
    EnvironmentConfig = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], EnvironmentConfig);
    ServerConfig.EnvironmentConfig = EnvironmentConfig;
    let Config = class Config {
        constructor() {
            this.Environment = new EnvironmentConfig();
            this.sessionSecret = [];
            this.port = 80;
            this.host = '0.0.0.0';
            this.Media = new MediaConfig();
            this.Threading = new ThreadingConfig();
            this.Database = new DataBaseConfig();
            this.Sharing = new SharingConfig();
            this.sessionTimeout = 1000 * 60 * 60 * 24 * 7; // in ms
            this.Indexing = new IndexingConfig();
            this.photoMetadataSize = 512 * 1024; // only this many bites will be loaded when scanning photo for metadata
            this.Duplicates = new DuplicatesConfig();
            this.Log = new LogConfig();
            this.Jobs = new JobConfig();
        }
    };
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ volatile: true }),
        __metadata("design:type", EnvironmentConfig)
    ], Config.prototype, "Environment", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ arrayType: 'string' }),
        __metadata("design:type", Array)
    ], Config.prototype, "sessionSecret", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'unsignedInt', envAlias: 'PORT', min: 0, max: 65535 }),
        __metadata("design:type", Number)
    ], Config.prototype, "port", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", String)
    ], Config.prototype, "host", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", MediaConfig)
    ], Config.prototype, "Media", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", ThreadingConfig)
    ], Config.prototype, "Threading", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", DataBaseConfig)
    ], Config.prototype, "Database", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", SharingConfig)
    ], Config.prototype, "Sharing", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'unsignedInt', description: 'unit: ms' }),
        __metadata("design:type", Number)
    ], Config.prototype, "sessionTimeout", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", IndexingConfig)
    ], Config.prototype, "Indexing", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty({ type: 'unsignedInt', description: 'only this many bites will be loaded when scanning photo for metadata' }),
        __metadata("design:type", Number)
    ], Config.prototype, "photoMetadataSize", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", DuplicatesConfig)
    ], Config.prototype, "Duplicates", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", LogConfig)
    ], Config.prototype, "Log", void 0);
    __decorate([
        ConfigPropoerty_1.ConfigProperty(),
        __metadata("design:type", JobConfig)
    ], Config.prototype, "Jobs", void 0);
    Config = __decorate([
        SubConfigClass_1.SubConfigClass()
    ], Config);
    ServerConfig.Config = Config;
})(ServerConfig = exports.ServerConfig || (exports.ServerConfig = {}));

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
const Config_1 = require("../src/common/config/private/Config");
const ObjectManagers_1 = require("../src/backend/model/ObjectManagers");
const DiskMangerWorker_1 = require("../src/backend/model/threading/DiskMangerWorker");
const IndexingManager_1 = require("../src/backend/model/database/sql/IndexingManager");
const path = require("path");
const fs = require("fs");
const AutoCompleteItem_1 = require("../src/common/entities/AutoCompleteItem");
const Utils_1 = require("../src/common/Utils");
const PrivateConfig_1 = require("../src/common/config/private/PrivateConfig");
const ProjectPath_1 = require("../src/backend/ProjectPath");
const Benchmark_1 = require("./Benchmark");
const IndexingJob_1 = require("../src/backend/model/jobs/jobs/IndexingJob");
const ConentWrapper_1 = require("../src/common/entities/ConentWrapper");
const GalleryManager_1 = require("../src/backend/model/database/sql/GalleryManager");
const PersonManager_1 = require("../src/backend/model/database/sql/PersonManager");
const GalleryRouter_1 = require("../src/backend/routes/GalleryRouter");
const PersonRouter_1 = require("../src/backend/routes/PersonRouter");
const QueryParams_1 = require("../src/common/QueryParams");
class BMIndexingManager extends IndexingManager_1.IndexingManager {
    saveToDB(scannedDirectory) {
        const _super = Object.create(null, {
            saveToDB: { get: () => super.saveToDB }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.saveToDB.call(this, scannedDirectory);
        });
    }
}
exports.BMIndexingManager = BMIndexingManager;
class BMGalleryRouter extends GalleryRouter_1.GalleryRouter {
    static addDirectoryList(app) {
        GalleryRouter_1.GalleryRouter.addDirectoryList(app);
    }
    static addSearch(app) {
        GalleryRouter_1.GalleryRouter.addSearch(app);
    }
    static addInstantSearch(app) {
        GalleryRouter_1.GalleryRouter.addInstantSearch(app);
    }
    static addAutoComplete(app) {
        GalleryRouter_1.GalleryRouter.addAutoComplete(app);
    }
}
class BMPersonRouter extends PersonRouter_1.PersonRouter {
    static addGetPersons(app) {
        PersonRouter_1.PersonRouter.addGetPersons(app);
    }
}
class BenchmarkRunner {
    constructor(RUNS) {
        this.RUNS = RUNS;
        this.inited = false;
        this.biggestDirPath = null;
        this.requestTemplate = {
            requestPipe: null,
            params: {},
            query: {},
            session: {}
        };
        this.resetDB = () => __awaiter(this, void 0, void 0, function* () {
            Config_1.Config.Server.Threading.enabled = false;
            yield ObjectManagers_1.ObjectManagers.reset();
            yield fs.promises.rmdir(ProjectPath_1.ProjectPath.DBFolder, { recursive: true });
            Config_1.Config.Server.Database.type = PrivateConfig_1.ServerConfig.DatabaseType.sqlite;
            Config_1.Config.Server.Jobs.scheduled = [];
            yield ObjectManagers_1.ObjectManagers.InitSQLManagers();
        });
        Config_1.Config.Client.authenticationRequired = false;
    }
    bmSaveDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            yield this.resetDB();
            const dir = yield DiskMangerWorker_1.DiskMangerWorker.scanDirectory(this.biggestDirPath);
            const bm = new Benchmark_1.Benchmark('Saving directory to DB', null, () => this.resetDB());
            bm.addAStep({
                name: 'Saving directory to DB',
                fn: () => {
                    const im = new BMIndexingManager();
                    return im.saveToDB(dir);
                }
            });
            return yield bm.run(this.RUNS);
        });
    }
    bmScanDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            const bm = new Benchmark_1.Benchmark('Scanning directory');
            bm.addAStep({
                name: 'Scanning directory',
                fn: () => __awaiter(this, void 0, void 0, function* () { return new ConentWrapper_1.ContentWrapper(yield DiskMangerWorker_1.DiskMangerWorker.scanDirectory(this.biggestDirPath)); })
            });
            return yield bm.run(this.RUNS);
        });
    }
    bmListDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            Config_1.Config.Server.Indexing.reIndexingSensitivity = PrivateConfig_1.ServerConfig.ReIndexingSensitivity.low;
            yield this.init();
            yield this.setupDB();
            const req = Utils_1.Utils.clone(this.requestTemplate);
            req.params.directory = this.biggestDirPath;
            const bm = new Benchmark_1.Benchmark('List directory', req, () => __awaiter(this, void 0, void 0, function* () {
                yield ObjectManagers_1.ObjectManagers.reset();
                yield ObjectManagers_1.ObjectManagers.InitSQLManagers();
            }));
            BMGalleryRouter.addDirectoryList(bm.BmExpressApp);
            return yield bm.run(this.RUNS);
        });
    }
    bmListPersons() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupDB();
            Config_1.Config.Server.Indexing.reIndexingSensitivity = PrivateConfig_1.ServerConfig.ReIndexingSensitivity.low;
            const bm = new Benchmark_1.Benchmark('Listing Faces', Utils_1.Utils.clone(this.requestTemplate), () => __awaiter(this, void 0, void 0, function* () {
                yield ObjectManagers_1.ObjectManagers.reset();
                yield ObjectManagers_1.ObjectManagers.InitSQLManagers();
            }));
            BMPersonRouter.addGetPersons(bm.BmExpressApp);
            return yield bm.run(this.RUNS);
        });
    }
    bmAllSearch(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupDB();
            const types = Utils_1.Utils.enumToArray(AutoCompleteItem_1.SearchTypes).map(a => a.key).concat([null]);
            const results = [];
            for (let i = 0; i < types.length; i++) {
                const req = Utils_1.Utils.clone(this.requestTemplate);
                req.params.text = text;
                req.query[QueryParams_1.QueryParams.gallery.search.type] = types[i];
                const bm = new Benchmark_1.Benchmark('Searching for `' + text + '` as `' + (types[i] ? AutoCompleteItem_1.SearchTypes[types[i]] : 'any') + '`', req);
                BMGalleryRouter.addSearch(bm.BmExpressApp);
                results.push({ result: yield bm.run(this.RUNS), searchType: types[i] });
            }
            return results;
        });
    }
    bmInstantSearch(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupDB();
            const req = Utils_1.Utils.clone(this.requestTemplate);
            req.params.text = text;
            const bm = new Benchmark_1.Benchmark('Instant search for `' + text + '`', req);
            BMGalleryRouter.addInstantSearch(bm.BmExpressApp);
            return yield bm.run(this.RUNS);
        });
    }
    bmAutocomplete(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupDB();
            const req = Utils_1.Utils.clone(this.requestTemplate);
            req.params.text = text;
            const bm = new Benchmark_1.Benchmark('Auto complete for `' + text + '`', req);
            BMGalleryRouter.addAutoComplete(bm.BmExpressApp);
            return yield bm.run(this.RUNS);
        });
    }
    getStatistic() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setupDB();
            const gm = new GalleryManager_1.GalleryManager();
            const pm = new PersonManager_1.PersonManager();
            return 'directories: ' + (yield gm.countDirectories()) +
                ', photos: ' + (yield gm.countPhotos()) +
                ', videos: ' + (yield gm.countVideos()) +
                ', diskUsage : ' + Utils_1.Utils.renderDataSize(yield gm.countMediaSize()) +
                ', persons : ' + (yield pm.countFaces()) +
                ', unique persons (faces): ' + (yield pm.getAll()).length;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inited === false) {
                yield this.setupDB();
                const gm = new GalleryManager_1.GalleryManager();
                let biggest = 0;
                let biggestPath = '/';
                const queue = ['/'];
                while (queue.length > 0) {
                    const dirPath = queue.shift();
                    const dir = yield gm.listDirectory(dirPath);
                    dir.directories.forEach(d => queue.push(path.join(d.path + d.name)));
                    if (biggest < dir.media.length) {
                        biggestPath = path.join(dir.path + dir.name);
                        biggest = dir.media.length;
                    }
                }
                this.biggestDirPath = biggestPath;
                console.log('updating path of biggest dir to: ' + this.biggestDirPath);
                this.inited = true;
            }
            return this.biggestDirPath;
        });
    }
    setupDB() {
        return __awaiter(this, void 0, void 0, function* () {
            Config_1.Config.Server.Threading.enabled = false;
            yield this.resetDB();
            yield new Promise((resolve, reject) => {
                try {
                    const indexingJob = new IndexingJob_1.IndexingJob();
                    indexingJob.JobListener = {
                        onJobFinished: (job, state, soloRun) => {
                            resolve();
                        },
                        onProgressUpdate: (progress) => {
                        }
                    };
                    indexingJob.start().catch(console.error);
                }
                catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        });
    }
}
exports.BenchmarkRunner = BenchmarkRunner;

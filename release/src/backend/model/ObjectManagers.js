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
const SQLConnection_1 = require("./database/sql/SQLConnection");
const Logger_1 = require("../Logger");
class ObjectManagers {
    get VersionManager() {
        return this._versionManager;
    }
    set VersionManager(value) {
        this._versionManager = value;
    }
    get PersonManager() {
        return this._personManager;
    }
    set PersonManager(value) {
        this._personManager = value;
    }
    get IndexingManager() {
        return this._indexingManager;
    }
    set IndexingManager(value) {
        this._indexingManager = value;
    }
    get GalleryManager() {
        return this._galleryManager;
    }
    set GalleryManager(value) {
        this._galleryManager = value;
    }
    get UserManager() {
        return this._userManager;
    }
    set UserManager(value) {
        this._userManager = value;
    }
    get SearchManager() {
        return this._searchManager;
    }
    set SearchManager(value) {
        this._searchManager = value;
    }
    get SharingManager() {
        return this._sharingManager;
    }
    set SharingManager(value) {
        this._sharingManager = value;
    }
    get JobManager() {
        return this._jobManager;
    }
    set JobManager(value) {
        this._jobManager = value;
    }
    static getInstance() {
        if (this._instance === null) {
            this._instance = new ObjectManagers();
        }
        return this._instance;
    }
    static reset() {
        return __awaiter(this, void 0, void 0, function* () {
            if (ObjectManagers.getInstance().IndexingManager &&
                ObjectManagers.getInstance().IndexingManager.IsSavingInProgress) {
                yield ObjectManagers.getInstance().IndexingManager.SavingReady;
            }
            if (ObjectManagers.getInstance().JobManager) {
                ObjectManagers.getInstance().JobManager.stopSchedules();
            }
            yield SQLConnection_1.SQLConnection.close();
            this._instance = null;
        });
    }
    static InitCommonManagers() {
        return __awaiter(this, void 0, void 0, function* () {
            const JobManager = require('./jobs/JobManager').JobManager;
            ObjectManagers.getInstance().JobManager = new JobManager();
        });
    }
    static InitMemoryManagers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield ObjectManagers.reset();
            const GalleryManager = require('./database/memory/GalleryManager').GalleryManager;
            const UserManager = require('./database/memory/UserManager').UserManager;
            const SearchManager = require('./database/memory/SearchManager').SearchManager;
            const SharingManager = require('./database/memory/SharingManager').SharingManager;
            const IndexingManager = require('./database/memory/IndexingManager').IndexingManager;
            const PersonManager = require('./database/memory/PersonManager').PersonManager;
            const VersionManager = require('./database/memory/VersionManager').VersionManager;
            ObjectManagers.getInstance().GalleryManager = new GalleryManager();
            ObjectManagers.getInstance().UserManager = new UserManager();
            ObjectManagers.getInstance().SearchManager = new SearchManager();
            ObjectManagers.getInstance().SharingManager = new SharingManager();
            ObjectManagers.getInstance().IndexingManager = new IndexingManager();
            ObjectManagers.getInstance().PersonManager = new PersonManager();
            ObjectManagers.getInstance().VersionManager = new VersionManager();
            this.InitCommonManagers();
        });
    }
    static InitSQLManagers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield ObjectManagers.reset();
            yield SQLConnection_1.SQLConnection.init();
            const GalleryManager = require('./database/sql/GalleryManager').GalleryManager;
            const UserManager = require('./database/sql/UserManager').UserManager;
            const SearchManager = require('./database/sql/SearchManager').SearchManager;
            const SharingManager = require('./database/sql/SharingManager').SharingManager;
            const IndexingManager = require('./database/sql/IndexingManager').IndexingManager;
            const PersonManager = require('./database/sql/PersonManager').PersonManager;
            const VersionManager = require('./database/sql/VersionManager').VersionManager;
            ObjectManagers.getInstance().GalleryManager = new GalleryManager();
            ObjectManagers.getInstance().UserManager = new UserManager();
            ObjectManagers.getInstance().SearchManager = new SearchManager();
            ObjectManagers.getInstance().SharingManager = new SharingManager();
            ObjectManagers.getInstance().IndexingManager = new IndexingManager();
            ObjectManagers.getInstance().PersonManager = new PersonManager();
            ObjectManagers.getInstance().VersionManager = new VersionManager();
            this.InitCommonManagers();
            Logger_1.Logger.debug('SQL DB inited');
        });
    }
}
ObjectManagers._instance = null;
exports.ObjectManagers = ObjectManagers;

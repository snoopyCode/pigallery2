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
const DirectoryEntity_1 = require("./enitites/DirectoryEntity");
const SQLConnection_1 = require("./SQLConnection");
const DiskManger_1 = require("../../DiskManger");
const PhotoEntity_1 = require("./enitites/PhotoEntity");
const Utils_1 = require("../../../../common/Utils");
const MediaEntity_1 = require("./enitites/MediaEntity");
const MediaDTO_1 = require("../../../../common/entities/MediaDTO");
const VideoEntity_1 = require("./enitites/VideoEntity");
const FileEntity_1 = require("./enitites/FileEntity");
const NotifocationManager_1 = require("../../NotifocationManager");
const FaceRegionEntry_1 = require("./enitites/FaceRegionEntry");
const ObjectManagers_1 = require("../../ObjectManagers");
const DiskMangerWorker_1 = require("../../threading/DiskMangerWorker");
const Logger_1 = require("../../../Logger");
const LOG_TAG = '[IndexingManager]';
class IndexingManager {
    constructor() {
        this.SavingReady = null;
        this.SavingReadyPR = null;
        this.savingQueue = [];
        this.isSaving = false;
    }
    get IsSavingInProgress() {
        return this.SavingReady !== null;
    }
    indexDirectory(relativeDirectoryName) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const scannedDirectory = yield DiskManger_1.DiskManager.scanDirectory(relativeDirectoryName);
                // returning with the result
                scannedDirectory.media.forEach(p => p.readyThumbnails = []);
                resolve(scannedDirectory);
                this.queueForSave(scannedDirectory).catch(console.error);
            }
            catch (error) {
                NotifocationManager_1.NotificationManager.warning('Unknown indexing error for: ' + relativeDirectoryName, error.toString());
                console.error(error);
                return reject(error);
            }
        }));
    }
    resetDB() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.Logger.info(LOG_TAG, 'Resetting DB');
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return connection
                .getRepository(DirectoryEntity_1.DirectoryEntity)
                .createQueryBuilder('directory')
                .delete()
                .execute().then(() => {
            });
        });
    }
    // Todo fix it, once typeorm support connection pools for sqlite
    queueForSave(scannedDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.savingQueue.findIndex(dir => dir.name === scannedDirectory.name &&
                dir.path === scannedDirectory.path &&
                dir.lastModified === scannedDirectory.lastModified &&
                dir.lastScanned === scannedDirectory.lastScanned &&
                (dir.media || dir.media.length) === (scannedDirectory.media || scannedDirectory.media.length) &&
                (dir.metaFile || dir.metaFile.length) === (scannedDirectory.metaFile || scannedDirectory.metaFile.length)) !== -1) {
                return;
            }
            this.savingQueue.push(scannedDirectory);
            if (!this.SavingReady) {
                this.SavingReady = new Promise((resolve) => {
                    this.SavingReadyPR = resolve;
                });
            }
            try {
                while (this.isSaving === false && this.savingQueue.length > 0) {
                    yield this.saveToDB(this.savingQueue[0]);
                    this.savingQueue.shift();
                }
            }
            catch (e) {
                this.savingQueue = [];
                throw e;
            }
            finally {
                if (this.savingQueue.length === 0) {
                    this.SavingReady = null;
                    this.SavingReadyPR();
                }
            }
        });
    }
    saveParentDir(connection, scannedDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const directoryRepository = connection.getRepository(DirectoryEntity_1.DirectoryEntity);
            const currentDir = yield directoryRepository.createQueryBuilder('directory')
                .where('directory.name = :name AND directory.path = :path', {
                name: scannedDirectory.name,
                path: scannedDirectory.path
            }).getOne();
            if (!!currentDir) { // Updated parent dir (if it was in the DB previously)
                currentDir.lastModified = scannedDirectory.lastModified;
                currentDir.lastScanned = scannedDirectory.lastScanned;
                currentDir.mediaCount = scannedDirectory.mediaCount;
                yield directoryRepository.save(currentDir);
                return currentDir.id;
            }
            else {
                return (yield directoryRepository.insert({
                    mediaCount: scannedDirectory.mediaCount,
                    lastModified: scannedDirectory.lastModified,
                    lastScanned: scannedDirectory.lastScanned,
                    name: scannedDirectory.name,
                    path: scannedDirectory.path
                })).identifiers[0].id;
            }
        });
    }
    saveChildDirs(connection, currentDirId, scannedDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const directoryRepository = connection.getRepository(DirectoryEntity_1.DirectoryEntity);
            // update subdirectories that does not have a parent
            yield directoryRepository
                .createQueryBuilder()
                .update(DirectoryEntity_1.DirectoryEntity)
                .set({ parent: currentDirId })
                .where('path = :path', { path: DiskMangerWorker_1.DiskMangerWorker.pathFromParent(scannedDirectory) })
                .andWhere('name NOT LIKE :root', { root: DiskMangerWorker_1.DiskMangerWorker.dirName('.') })
                .andWhere('parent IS NULL')
                .execute();
            // save subdirectories
            const childDirectories = yield directoryRepository.createQueryBuilder('directory')
                .leftJoinAndSelect('directory.parent', 'parent')
                .where('directory.parent = :dir', {
                dir: currentDirId
            }).getMany();
            for (let i = 0; i < scannedDirectory.directories.length; i++) {
                // Was this child Dir already indexed before?
                const dirIndex = childDirectories.findIndex(d => d.name === scannedDirectory.directories[i].name);
                if (dirIndex !== -1) { // directory found
                    childDirectories.splice(dirIndex, 1);
                }
                else { // dir does not exists yet
                    scannedDirectory.directories[i].parent = { id: currentDirId };
                    scannedDirectory.directories[i].lastScanned = null; // new child dir, not fully scanned yet
                    const d = yield directoryRepository.insert(scannedDirectory.directories[i]);
                    yield this.saveMedia(connection, d.identifiers[0].id, scannedDirectory.directories[i].media);
                }
            }
            // Remove child Dirs that are not anymore in the parent dir
            yield directoryRepository.remove(childDirectories, { chunk: Math.max(Math.ceil(childDirectories.length / 500), 1) });
        });
    }
    saveMetaFiles(connection, currentDirID, scannedDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileRepository = connection.getRepository(FileEntity_1.FileEntity);
            // save files
            const indexedMetaFiles = yield fileRepository.createQueryBuilder('file')
                .where('file.directory = :dir', {
                dir: currentDirID
            }).getMany();
            const metaFilesToSave = [];
            for (let i = 0; i < scannedDirectory.metaFile.length; i++) {
                let metaFile = null;
                for (let j = 0; j < indexedMetaFiles.length; j++) {
                    if (indexedMetaFiles[j].name === scannedDirectory.metaFile[i].name) {
                        metaFile = indexedMetaFiles[j];
                        indexedMetaFiles.splice(j, 1);
                        break;
                    }
                }
                if (metaFile == null) { // not in DB yet
                    scannedDirectory.metaFile[i].directory = null;
                    metaFile = Utils_1.Utils.clone(scannedDirectory.metaFile[i]);
                    scannedDirectory.metaFile[i].directory = scannedDirectory;
                    metaFile.directory = { id: currentDirID };
                    metaFilesToSave.push(metaFile);
                }
            }
            yield fileRepository.save(metaFilesToSave, { chunk: Math.max(Math.ceil(metaFilesToSave.length / 500), 1) });
            yield fileRepository.remove(indexedMetaFiles, { chunk: Math.max(Math.ceil(indexedMetaFiles.length / 500), 1) });
        });
    }
    saveMedia(connection, parentDirId, media) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaRepository = connection.getRepository(MediaEntity_1.MediaEntity);
            const photoRepository = connection.getRepository(PhotoEntity_1.PhotoEntity);
            const videoRepository = connection.getRepository(VideoEntity_1.VideoEntity);
            // save media
            let indexedMedia = (yield mediaRepository.createQueryBuilder('media')
                .where('media.directory = :dir', {
                dir: parentDirId
            })
                .getMany());
            const mediaChange = {
                saveP: [],
                saveV: [],
                insertP: [],
                insertV: []
            };
            const facesPerPhoto = [];
            for (let i = 0; i < media.length; i++) {
                let mediaItem = null;
                for (let j = 0; j < indexedMedia.length; j++) {
                    if (indexedMedia[j].name === media[i].name) {
                        mediaItem = indexedMedia[j];
                        indexedMedia.splice(j, 1);
                        break;
                    }
                }
                const scannedFaces = media[i].metadata.faces || [];
                delete media[i].metadata.faces;
                if (mediaItem == null) { // not in DB yet
                    media[i].directory = null;
                    mediaItem = Utils_1.Utils.clone(media[i]);
                    mediaItem.directory = { id: parentDirId };
                    (MediaDTO_1.MediaDTO.isPhoto(mediaItem) ? mediaChange.insertP : mediaChange.insertV).push(mediaItem);
                }
                else {
                    delete mediaItem.metadata.faces;
                    if (!Utils_1.Utils.equalsFilter(mediaItem.metadata, media[i].metadata)) {
                        mediaItem.metadata = media[i].metadata;
                        (MediaDTO_1.MediaDTO.isPhoto(mediaItem) ? mediaChange.saveP : mediaChange.saveV).push(mediaItem);
                    }
                }
                facesPerPhoto.push({ faces: scannedFaces, mediaName: mediaItem.name });
            }
            yield this.saveChunk(photoRepository, mediaChange.saveP, 100);
            yield this.saveChunk(videoRepository, mediaChange.saveV, 100);
            yield this.saveChunk(photoRepository, mediaChange.insertP, 100);
            yield this.saveChunk(videoRepository, mediaChange.insertV, 100);
            indexedMedia = (yield mediaRepository.createQueryBuilder('media')
                .where('media.directory = :dir', {
                dir: parentDirId
            })
                .select(['media.name', 'media.id'])
                .getMany());
            const faces = [];
            facesPerPhoto.forEach(group => {
                const mIndex = indexedMedia.findIndex(m => m.name === group.mediaName);
                group.faces.forEach((sf) => sf.media = { id: indexedMedia[mIndex].id });
                faces.push(...group.faces);
                indexedMedia.splice(mIndex, 1);
            });
            yield this.saveFaces(connection, parentDirId, faces);
            yield mediaRepository.remove(indexedMedia);
        });
    }
    saveFaces(connection, parentDirId, scannedFaces) {
        return __awaiter(this, void 0, void 0, function* () {
            const faceRepository = connection.getRepository(FaceRegionEntry_1.FaceRegionEntry);
            const persons = [];
            for (let i = 0; i < scannedFaces.length; i++) {
                if (persons.indexOf(scannedFaces[i].name) === -1) {
                    persons.push(scannedFaces[i].name);
                }
            }
            yield ObjectManagers_1.ObjectManagers.getInstance().PersonManager.saveAll(persons);
            const indexedFaces = yield faceRepository.createQueryBuilder('face')
                .leftJoin('face.media', 'media')
                .where('media.directory = :directory', {
                directory: parentDirId
            })
                .leftJoinAndSelect('face.person', 'person')
                .getMany();
            const faceToInsert = [];
            for (let i = 0; i < scannedFaces.length; i++) {
                let face = null;
                for (let j = 0; j < indexedFaces.length; j++) {
                    if (indexedFaces[j].box.height === scannedFaces[i].box.height &&
                        indexedFaces[j].box.width === scannedFaces[i].box.width &&
                        indexedFaces[j].box.left === scannedFaces[i].box.left &&
                        indexedFaces[j].box.top === scannedFaces[i].box.top &&
                        indexedFaces[j].person.name === scannedFaces[i].name) {
                        face = indexedFaces[j];
                        indexedFaces.splice(j, 1);
                        break;
                    }
                }
                if (face == null) {
                    scannedFaces[i].person = yield ObjectManagers_1.ObjectManagers.getInstance().PersonManager.get(scannedFaces[i].name);
                    faceToInsert.push(scannedFaces[i]);
                }
            }
            if (faceToInsert.length > 0) {
                yield this.insertChunk(faceRepository, faceToInsert, 100);
            }
            yield faceRepository.remove(indexedFaces, { chunk: Math.max(Math.ceil(indexedFaces.length / 500), 1) });
        });
    }
    saveToDB(scannedDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isSaving = true;
            try {
                const connection = yield SQLConnection_1.SQLConnection.getConnection();
                const currentDirId = yield this.saveParentDir(connection, scannedDirectory);
                yield this.saveChildDirs(connection, currentDirId, scannedDirectory);
                yield this.saveMedia(connection, currentDirId, scannedDirectory.media);
                yield this.saveMetaFiles(connection, currentDirId, scannedDirectory);
                yield ObjectManagers_1.ObjectManagers.getInstance().PersonManager.onGalleryIndexUpdate();
                yield ObjectManagers_1.ObjectManagers.getInstance().VersionManager.updateDataVersion();
            }
            catch (e) {
                throw e;
            }
            finally {
                this.isSaving = false;
            }
        });
    }
    saveChunk(repository, entities, size) {
        return __awaiter(this, void 0, void 0, function* () {
            if (entities.length === 0) {
                return [];
            }
            if (entities.length < size) {
                return yield repository.save(entities);
            }
            let list = [];
            for (let i = 0; i < entities.length / size; i++) {
                list = list.concat(yield repository.save(entities.slice(i * size, (i + 1) * size)));
            }
            return list;
        });
    }
    insertChunk(repository, entities, size) {
        return __awaiter(this, void 0, void 0, function* () {
            if (entities.length === 0) {
                return [];
            }
            if (entities.length < size) {
                return (yield repository.insert(entities)).identifiers.map((i) => i.id);
            }
            let list = [];
            for (let i = 0; i < entities.length / size; i++) {
                list = list.concat((yield repository.insert(entities.slice(i * size, (i + 1) * size))).identifiers.map(ids => ids.id));
            }
            return list;
        });
    }
}
exports.IndexingManager = IndexingManager;

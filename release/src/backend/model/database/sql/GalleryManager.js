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
const path = require("path");
const fs = require("fs");
const DirectoryEntity_1 = require("./enitites/DirectoryEntity");
const SQLConnection_1 = require("./SQLConnection");
const PhotoEntity_1 = require("./enitites/PhotoEntity");
const ProjectPath_1 = require("../../../ProjectPath");
const Config_1 = require("../../../../common/config/private/Config");
const RandomQueryDTO_1 = require("../../../../common/entities/RandomQueryDTO");
const typeorm_1 = require("typeorm");
const MediaEntity_1 = require("./enitites/MediaEntity");
const VideoEntity_1 = require("./enitites/VideoEntity");
const DiskMangerWorker_1 = require("../../threading/DiskMangerWorker");
const Logger_1 = require("../../../Logger");
const FaceRegionEntry_1 = require("./enitites/FaceRegionEntry");
const ObjectManagers_1 = require("../../ObjectManagers");
const PrivateConfig_1 = require("../../../../common/config/private/PrivateConfig");
const LOG_TAG = '[GalleryManager]';
class GalleryManager {
    listDirectory(relativeDirectoryName, knownLastModified, knownLastScanned) {
        return __awaiter(this, void 0, void 0, function* () {
            relativeDirectoryName = DiskMangerWorker_1.DiskMangerWorker.normalizeDirPath(relativeDirectoryName);
            const directoryName = path.basename(relativeDirectoryName);
            const directoryParent = path.join(path.dirname(relativeDirectoryName), path.sep);
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const stat = fs.statSync(path.join(ProjectPath_1.ProjectPath.ImageFolder, relativeDirectoryName));
            const lastModified = DiskMangerWorker_1.DiskMangerWorker.calcLastModified(stat);
            const dir = yield this.selectParentDir(connection, directoryName, directoryParent);
            if (dir && dir.lastScanned != null) {
                // If it seems that the content did not changed, do not work on it
                if (knownLastModified && knownLastScanned
                    && lastModified === knownLastModified &&
                    dir.lastScanned === knownLastScanned) {
                    if (Config_1.Config.Server.Indexing.reIndexingSensitivity === PrivateConfig_1.ServerConfig.ReIndexingSensitivity.low) {
                        return null;
                    }
                    if (Date.now() - dir.lastScanned <= Config_1.Config.Server.Indexing.cachedFolderTimeout &&
                        Config_1.Config.Server.Indexing.reIndexingSensitivity === PrivateConfig_1.ServerConfig.ReIndexingSensitivity.medium) {
                        return null;
                    }
                }
                if (dir.lastModified !== lastModified) {
                    Logger_1.Logger.silly(LOG_TAG, 'Reindexing reason: lastModified mismatch: known: '
                        + dir.lastModified + ', current:' + lastModified);
                    return ObjectManagers_1.ObjectManagers.getInstance().IndexingManager.indexDirectory(relativeDirectoryName);
                }
                // not indexed since a while, index it in a lazy manner
                if ((Date.now() - dir.lastScanned > Config_1.Config.Server.Indexing.cachedFolderTimeout &&
                    Config_1.Config.Server.Indexing.reIndexingSensitivity >= PrivateConfig_1.ServerConfig.ReIndexingSensitivity.medium) ||
                    Config_1.Config.Server.Indexing.reIndexingSensitivity >= PrivateConfig_1.ServerConfig.ReIndexingSensitivity.high) {
                    // on the fly reindexing
                    Logger_1.Logger.silly(LOG_TAG, 'lazy reindexing reason: cache timeout: lastScanned: '
                        + (Date.now() - dir.lastScanned) + ' ms ago, cachedFolderTimeout:' + Config_1.Config.Server.Indexing.cachedFolderTimeout);
                    ObjectManagers_1.ObjectManagers.getInstance().IndexingManager.indexDirectory(relativeDirectoryName).catch((err) => {
                        console.error(err);
                    });
                }
                yield this.fillParentDir(connection, dir);
                return dir;
            }
            // never scanned (deep indexed), do it and return with it
            Logger_1.Logger.silly(LOG_TAG, 'Reindexing reason: never scanned');
            return ObjectManagers_1.ObjectManagers.getInstance().IndexingManager.indexDirectory(relativeDirectoryName);
        });
    }
    getRandomPhoto(queryFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const photosRepository = connection.getRepository(PhotoEntity_1.PhotoEntity);
            const query = photosRepository.createQueryBuilder('photo');
            query.innerJoinAndSelect('photo.directory', 'directory');
            if (queryFilter.directory) {
                const directoryName = path.basename(queryFilter.directory);
                const directoryParent = path.join(path.dirname(queryFilter.directory), path.sep);
                query.where(new typeorm_1.Brackets(qb => {
                    qb.where('directory.name = :name AND directory.path = :path', {
                        name: directoryName,
                        path: directoryParent
                    });
                    if (queryFilter.recursive) {
                        qb.orWhere('directory.path LIKE :text COLLATE utf8_general_ci', { text: queryFilter.directory + '%' });
                    }
                }));
            }
            if (queryFilter.fromDate) {
                query.andWhere('photo.metadata.creationDate >= :fromDate', {
                    fromDate: queryFilter.fromDate.getTime()
                });
            }
            if (queryFilter.toDate) {
                query.andWhere('photo.metadata.creationDate <= :toDate', {
                    toDate: queryFilter.toDate.getTime()
                });
            }
            if (queryFilter.minResolution) {
                query.andWhere('photo.metadata.size.width * photo.metadata.size.height >= :minRes', {
                    minRes: queryFilter.minResolution * 1000 * 1000
                });
            }
            if (queryFilter.maxResolution) {
                query.andWhere('photo.metadata.size.width * photo.metadata.size.height <= :maxRes', {
                    maxRes: queryFilter.maxResolution * 1000 * 1000
                });
            }
            if (queryFilter.orientation === RandomQueryDTO_1.OrientationType.landscape) {
                query.andWhere('photo.metadata.size.width >= photo.metadata.size.height');
            }
            if (queryFilter.orientation === RandomQueryDTO_1.OrientationType.portrait) {
                query.andWhere('photo.metadata.size.width <= photo.metadata.size.height');
            }
            if (Config_1.Config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.mysql) {
                return yield query.groupBy('RAND(), photo.id').limit(1).getOne();
            }
            return yield query.groupBy('RANDOM()').limit(1).getOne();
        });
    }
    countDirectories() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return yield connection.getRepository(DirectoryEntity_1.DirectoryEntity)
                .createQueryBuilder('directory')
                .getCount();
        });
    }
    countMediaSize() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const { sum } = yield connection.getRepository(MediaEntity_1.MediaEntity)
                .createQueryBuilder('media')
                .select('SUM(media.metadata.fileSize)', 'sum')
                .getRawOne();
            return sum || 0;
        });
    }
    countPhotos() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return yield connection.getRepository(PhotoEntity_1.PhotoEntity)
                .createQueryBuilder('directory')
                .getCount();
        });
    }
    countVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return yield connection.getRepository(VideoEntity_1.VideoEntity)
                .createQueryBuilder('directory')
                .getCount();
        });
    }
    getPossibleDuplicates() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const mediaRepository = connection.getRepository(MediaEntity_1.MediaEntity);
            let duplicates = yield mediaRepository.createQueryBuilder('media')
                .innerJoin(query => query.from(MediaEntity_1.MediaEntity, 'innerMedia')
                .select(['innerMedia.name as name', 'innerMedia.metadata.fileSize as fileSize', 'count(*)'])
                .groupBy('innerMedia.name, innerMedia.metadata.fileSize')
                .having('count(*)>1'), 'innerMedia', 'media.name=innerMedia.name AND media.metadata.fileSize = innerMedia.fileSize')
                .innerJoinAndSelect('media.directory', 'directory')
                .orderBy('media.name, media.metadata.fileSize')
                .limit(Config_1.Config.Server.Duplicates.listingLimit).getMany();
            const duplicateParis = [];
            const processDuplicates = (duplicateList, equalFn, checkDuplicates = false) => {
                let i = duplicateList.length - 1;
                while (i >= 0) {
                    const list = [duplicateList[i]];
                    let j = i - 1;
                    while (j >= 0 && equalFn(duplicateList[i], duplicateList[j])) {
                        list.push(duplicateList[j]);
                        j--;
                    }
                    i = j;
                    // if we cut the select list with the SQL LIMIT, filter unpaired media
                    if (list.length < 2) {
                        continue;
                    }
                    if (checkDuplicates) {
                        // ad to group if one already existed
                        const foundDuplicates = duplicateParis.find(dp => !!dp.media.find(m => !!list.find(lm => lm.id === m.id)));
                        if (foundDuplicates) {
                            list.forEach(lm => {
                                if (!!foundDuplicates.media.find(m => m.id === lm.id)) {
                                    return;
                                }
                                foundDuplicates.media.push(lm);
                            });
                            continue;
                        }
                    }
                    duplicateParis.push({ media: list });
                }
            };
            processDuplicates(duplicates, (a, b) => a.name === b.name &&
                a.metadata.fileSize === b.metadata.fileSize);
            duplicates = yield mediaRepository.createQueryBuilder('media')
                .innerJoin(query => query.from(MediaEntity_1.MediaEntity, 'innerMedia')
                .select(['innerMedia.metadata.creationDate as creationDate', 'innerMedia.metadata.fileSize as fileSize', 'count(*)'])
                .groupBy('innerMedia.metadata.creationDate, innerMedia.metadata.fileSize')
                .having('count(*)>1'), 'innerMedia', 'media.metadata.creationDate=innerMedia.creationDate AND media.metadata.fileSize = innerMedia.fileSize')
                .innerJoinAndSelect('media.directory', 'directory')
                .orderBy('media.metadata.creationDate, media.metadata.fileSize')
                .limit(Config_1.Config.Server.Duplicates.listingLimit).getMany();
            processDuplicates(duplicates, (a, b) => a.metadata.creationDate === b.metadata.creationDate &&
                a.metadata.fileSize === b.metadata.fileSize, true);
            return duplicateParis;
        });
    }
    selectParentDir(connection, directoryName, directoryParent) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = connection
                .getRepository(DirectoryEntity_1.DirectoryEntity)
                .createQueryBuilder('directory')
                .where('directory.name = :name AND directory.path = :path', {
                name: directoryName,
                path: directoryParent
            })
                .leftJoinAndSelect('directory.directories', 'directories')
                .leftJoinAndSelect('directory.media', 'media');
            if (Config_1.Config.Client.MetaFile.enabled === true) {
                query.leftJoinAndSelect('directory.metaFile', 'metaFile');
            }
            return yield query.getOne();
        });
    }
    fillParentDir(connection, dir) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dir.media) {
                const indexedFaces = yield connection.getRepository(FaceRegionEntry_1.FaceRegionEntry)
                    .createQueryBuilder('face')
                    .leftJoinAndSelect('face.media', 'media')
                    .where('media.directory = :directory', {
                    directory: dir.id
                })
                    .leftJoinAndSelect('face.person', 'person')
                    .select(['face.id', 'face.box.left',
                    'face.box.top', 'face.box.width', 'face.box.height',
                    'media.id', 'person.name', 'person.id'])
                    .getMany();
                for (let i = 0; i < dir.media.length; i++) {
                    dir.media[i].directory = dir;
                    dir.media[i].readyThumbnails = [];
                    dir.media[i].readyIcon = false;
                    dir.media[i].metadata.faces = indexedFaces
                        .filter(fe => fe.media.id === dir.media[i].id)
                        .map(f => ({ box: f.box, name: f.person.name }));
                }
            }
            if (dir.directories) {
                for (let i = 0; i < dir.directories.length; i++) {
                    dir.directories[i].media = yield connection
                        .getRepository(MediaEntity_1.MediaEntity)
                        .createQueryBuilder('media')
                        .where('media.directory = :dir', {
                        dir: dir.directories[i].id
                    })
                        .orderBy('media.metadata.creationDate', 'ASC')
                        .limit(Config_1.Config.Server.Indexing.folderPreviewSize)
                        .getMany();
                    dir.directories[i].isPartial = true;
                    for (let j = 0; j < dir.directories[i].media.length; j++) {
                        dir.directories[i].media[j].directory = dir.directories[i];
                        dir.directories[i].media[j].readyThumbnails = [];
                        dir.directories[i].media[j].readyIcon = false;
                    }
                }
            }
        });
    }
}
exports.GalleryManager = GalleryManager;

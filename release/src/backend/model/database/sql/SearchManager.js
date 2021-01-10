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
const AutoCompleteItem_1 = require("../../../../common/entities/AutoCompleteItem");
const SQLConnection_1 = require("./SQLConnection");
const PhotoEntity_1 = require("./enitites/PhotoEntity");
const DirectoryEntity_1 = require("./enitites/DirectoryEntity");
const MediaEntity_1 = require("./enitites/MediaEntity");
const VideoEntity_1 = require("./enitites/VideoEntity");
const PersonEntry_1 = require("./enitites/PersonEntry");
const FaceRegionEntry_1 = require("./enitites/FaceRegionEntry");
const Config_1 = require("../../../../common/config/private/Config");
class SearchManager {
    static autoCompleteItemsUnique(array) {
        const a = array.concat();
        for (let i = 0; i < a.length; ++i) {
            for (let j = i + 1; j < a.length; ++j) {
                if (a[i].equals(a[j])) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    }
    autocomplete(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            let result = [];
            const photoRepository = connection.getRepository(PhotoEntity_1.PhotoEntity);
            const videoRepository = connection.getRepository(VideoEntity_1.VideoEntity);
            const personRepository = connection.getRepository(PersonEntry_1.PersonEntry);
            const directoryRepository = connection.getRepository(DirectoryEntity_1.DirectoryEntity);
            (yield photoRepository
                .createQueryBuilder('photo')
                .select('DISTINCT(photo.metadata.keywords)')
                .where('photo.metadata.keywords LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .limit(Config_1.Config.Client.Search.AutoComplete.maxItemsPerCategory)
                .getRawMany())
                .map(r => r.metadataKeywords.split(','))
                .forEach(keywords => {
                result = result.concat(this.encapsulateAutoComplete(keywords
                    .filter(k => k.toLowerCase().indexOf(text.toLowerCase()) !== -1), AutoCompleteItem_1.SearchTypes.keyword));
            });
            result = result.concat(this.encapsulateAutoComplete((yield personRepository
                .createQueryBuilder('person')
                .select('DISTINCT(person.name)')
                .where('person.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .limit(Config_1.Config.Client.Search.AutoComplete.maxItemsPerCategory)
                .orderBy('person.name')
                .getRawMany())
                .map(r => r.name), AutoCompleteItem_1.SearchTypes.person));
            (yield photoRepository
                .createQueryBuilder('photo')
                .select('photo.metadata.positionData.country as country, ' +
                'photo.metadata.positionData.state as state, photo.metadata.positionData.city as city')
                .where('photo.metadata.positionData.country LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .orWhere('photo.metadata.positionData.state LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .orWhere('photo.metadata.positionData.city LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .groupBy('photo.metadata.positionData.country, photo.metadata.positionData.state, photo.metadata.positionData.city')
                .limit(Config_1.Config.Client.Search.AutoComplete.maxItemsPerCategory)
                .getRawMany())
                .filter(pm => !!pm)
                .map(pm => [pm.city || '', pm.country || '', pm.state || ''])
                .forEach(positions => {
                result = result.concat(this.encapsulateAutoComplete(positions
                    .filter(p => p.toLowerCase().indexOf(text.toLowerCase()) !== -1), AutoCompleteItem_1.SearchTypes.position));
            });
            result = result.concat(this.encapsulateAutoComplete((yield photoRepository
                .createQueryBuilder('media')
                .select('DISTINCT(media.name)')
                .where('media.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .limit(Config_1.Config.Client.Search.AutoComplete.maxItemsPerCategory)
                .getRawMany())
                .map(r => r.name), AutoCompleteItem_1.SearchTypes.photo));
            result = result.concat(this.encapsulateAutoComplete((yield photoRepository
                .createQueryBuilder('media')
                .select('DISTINCT(media.metadata.caption) as caption')
                .where('media.metadata.caption LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .limit(Config_1.Config.Client.Search.AutoComplete.maxItemsPerCategory)
                .getRawMany())
                .map(r => r.caption), AutoCompleteItem_1.SearchTypes.photo));
            result = result.concat(this.encapsulateAutoComplete((yield videoRepository
                .createQueryBuilder('media')
                .select('DISTINCT(media.name)')
                .where('media.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .limit(Config_1.Config.Client.Search.AutoComplete.maxItemsPerCategory)
                .getRawMany())
                .map(r => r.name), AutoCompleteItem_1.SearchTypes.video));
            result = result.concat(this.encapsulateAutoComplete((yield directoryRepository
                .createQueryBuilder('dir')
                .select('DISTINCT(dir.name)')
                .where('dir.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .limit(Config_1.Config.Client.Search.AutoComplete.maxItemsPerCategory)
                .getRawMany())
                .map(r => r.name), AutoCompleteItem_1.SearchTypes.directory));
            return SearchManager.autoCompleteItemsUnique(result);
        });
    }
    search(text, searchType) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const result = {
                searchText: text,
                searchType: searchType,
                directories: [],
                media: [],
                metaFile: [],
                resultOverflow: false
            };
            let usedEntity = MediaEntity_1.MediaEntity;
            if (searchType === AutoCompleteItem_1.SearchTypes.photo) {
                usedEntity = PhotoEntity_1.PhotoEntity;
            }
            else if (searchType === AutoCompleteItem_1.SearchTypes.video) {
                usedEntity = VideoEntity_1.VideoEntity;
            }
            const query = yield connection.getRepository(usedEntity).createQueryBuilder('media')
                .innerJoin(q => {
                const subQuery = q.from(usedEntity, 'media')
                    .select('distinct media.id')
                    .limit(Config_1.Config.Client.Search.maxMediaResult + 1);
                if (!searchType || searchType === AutoCompleteItem_1.SearchTypes.directory) {
                    subQuery.leftJoin('media.directory', 'directory')
                        .orWhere('directory.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' });
                }
                if (!searchType || searchType === AutoCompleteItem_1.SearchTypes.photo || searchType === AutoCompleteItem_1.SearchTypes.video) {
                    subQuery.orWhere('media.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' });
                }
                if (!searchType || searchType === AutoCompleteItem_1.SearchTypes.photo) {
                    subQuery.orWhere('media.metadata.caption LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' });
                }
                if (!searchType || searchType === AutoCompleteItem_1.SearchTypes.person) {
                    subQuery
                        .leftJoin('media.metadata.faces', 'faces')
                        .leftJoin('faces.person', 'person')
                        .orWhere('person.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' });
                }
                if (!searchType || searchType === AutoCompleteItem_1.SearchTypes.position) {
                    subQuery.orWhere('media.metadata.positionData.country LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                        .orWhere('media.metadata.positionData.state LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                        .orWhere('media.metadata.positionData.city LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' });
                }
                if (!searchType || searchType === AutoCompleteItem_1.SearchTypes.keyword) {
                    subQuery.orWhere('media.metadata.keywords LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' });
                }
                return subQuery;
            }, 'innerMedia', 'media.id=innerMedia.id')
                .leftJoinAndSelect('media.directory', 'directory')
                .leftJoinAndSelect('media.metadata.faces', 'faces')
                .leftJoinAndSelect('faces.person', 'person');
            result.media = yield this.loadMediaWithFaces(query);
            if (result.media.length > Config_1.Config.Client.Search.maxMediaResult) {
                result.resultOverflow = true;
            }
            result.directories = yield connection
                .getRepository(DirectoryEntity_1.DirectoryEntity)
                .createQueryBuilder('dir')
                .where('dir.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .limit(Config_1.Config.Client.Search.maxMediaResult + 1)
                .getMany();
            if (result.directories.length > Config_1.Config.Client.Search.maxDirectoryResult) {
                result.resultOverflow = true;
            }
            return result;
        });
    }
    instantSearch(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const result = {
                searchText: text,
                // searchType:undefined, not adding this
                directories: [],
                media: [],
                metaFile: [],
                resultOverflow: false
            };
            const query = yield connection.getRepository(MediaEntity_1.MediaEntity).createQueryBuilder('media')
                .innerJoin(q => q.from(MediaEntity_1.MediaEntity, 'media')
                .select('distinct media.id')
                .limit(10)
                .leftJoin('media.directory', 'directory')
                .leftJoin('media.metadata.faces', 'faces')
                .leftJoin('faces.person', 'person')
                .where('media.metadata.keywords LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .orWhere('media.metadata.positionData.country LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .orWhere('media.metadata.positionData.state LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .orWhere('media.metadata.positionData.city LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .orWhere('media.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .orWhere('media.metadata.caption LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .orWhere('person.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' }), 'innerMedia', 'media.id=innerMedia.id')
                .leftJoinAndSelect('media.directory', 'directory')
                .leftJoinAndSelect('media.metadata.faces', 'faces')
                .leftJoinAndSelect('faces.person', 'person');
            result.media = yield this.loadMediaWithFaces(query);
            result.directories = yield connection
                .getRepository(DirectoryEntity_1.DirectoryEntity)
                .createQueryBuilder('dir')
                .where('dir.name LIKE :text COLLATE utf8_general_ci', { text: '%' + text + '%' })
                .limit(10)
                .getMany();
            return result;
        });
    }
    encapsulateAutoComplete(values, type) {
        const res = [];
        values.forEach((value) => {
            res.push(new AutoCompleteItem_1.AutoCompleteItem(value, type));
        });
        return res;
    }
    loadMediaWithFaces(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawAndEntities = yield query.orderBy('media.id').getRawAndEntities();
            const media = rawAndEntities.entities;
            let rawIndex = 0;
            for (let i = 0; i < media.length; i++) {
                if (rawAndEntities.raw[rawIndex].faces_id === null ||
                    rawAndEntities.raw[rawIndex].media_id !== media[i].id) {
                    delete media[i].metadata.faces;
                    continue;
                }
                media[i].metadata.faces = [];
                while (rawAndEntities.raw[rawIndex].media_id === media[i].id) {
                    media[i].metadata.faces.push(FaceRegionEntry_1.FaceRegionEntry.fromRawToDTO(rawAndEntities.raw[rawIndex]));
                    rawIndex++;
                    if (rawIndex >= rawAndEntities.raw.length) {
                        return media;
                    }
                }
            }
            return media;
        });
    }
}
exports.SearchManager = SearchManager;

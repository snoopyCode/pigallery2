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
const SQLConnection_1 = require("./SQLConnection");
const PersonEntry_1 = require("./enitites/PersonEntry");
const FaceRegionEntry_1 = require("./enitites/FaceRegionEntry");
class PersonManager {
    constructor() {
        // samplePhotos: { [key: string]: PhotoDTO } = {};
        this.persons = null;
    }
    updatePerson(name, partialPerson) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const repository = connection.getRepository(PersonEntry_1.PersonEntry);
            const person = yield repository.createQueryBuilder('person')
                .limit(1)
                .where('person.name LIKE :name COLLATE utf8_general_ci', { name: name }).getOne();
            if (typeof partialPerson.name !== 'undefined') {
                person.name = partialPerson.name;
            }
            if (typeof partialPerson.isFavourite !== 'undefined') {
                person.isFavourite = partialPerson.isFavourite;
            }
            yield repository.save(person);
            yield this.loadAll();
            return person;
        });
    }
    loadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const personRepository = connection.getRepository(PersonEntry_1.PersonEntry);
            this.persons = yield personRepository.find({
                relations: ['sampleRegion',
                    'sampleRegion.media',
                    'sampleRegion.media.directory']
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.persons === null) {
                yield this.loadAll();
            }
            return this.persons;
        });
    }
    /**
     * Used for statistic
     */
    countFaces() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return yield connection.getRepository(FaceRegionEntry_1.FaceRegionEntry)
                .createQueryBuilder('faceRegion')
                .getCount();
        });
    }
    get(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.persons === null) {
                yield this.loadAll();
            }
            return this.persons.find(p => p.name === name);
        });
    }
    saveAll(names) {
        return __awaiter(this, void 0, void 0, function* () {
            const toSave = [];
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const personRepository = connection.getRepository(PersonEntry_1.PersonEntry);
            yield this.loadAll();
            for (let i = 0; i < names.length; i++) {
                const person = this.persons.find(p => p.name === names[i]);
                if (!person) {
                    toSave.push({ name: names[i] });
                }
            }
            if (toSave.length > 0) {
                for (let i = 0; i < toSave.length / 200; i++) {
                    yield personRepository.insert(toSave.slice(i * 200, (i + 1) * 200));
                }
                yield this.loadAll();
            }
        });
    }
    onGalleryIndexUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateCounts();
            yield this.updateSamplePhotos();
        });
    }
    updateCounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            yield connection.query('UPDATE person_entry SET count = ' +
                ' (SELECT COUNT(1) FROM face_region_entry WHERE face_region_entry.personId = person_entry.id)');
            // remove persons without photo
            yield connection
                .createQueryBuilder()
                .delete()
                .from(PersonEntry_1.PersonEntry)
                .where('count = 0')
                .execute();
        });
    }
    updateSamplePhotos() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            yield connection.query('update person_entry set sampleRegionId = ' +
                '(Select face_region_entry.id from  media_entity ' +
                'left join face_region_entry on media_entity.id = face_region_entry.mediaId ' +
                'where face_region_entry.personId=person_entry.id ' +
                'order by media_entity.metadataCreationdate desc ' +
                'limit 1)');
        });
    }
}
exports.PersonManager = PersonManager;

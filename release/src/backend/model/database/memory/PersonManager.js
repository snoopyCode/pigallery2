"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PersonManager {
    getAll() {
        throw new Error('not supported by memory DB');
    }
    get(name) {
        throw new Error('not supported by memory DB');
    }
    saveAll(names) {
        throw new Error('not supported by memory DB');
    }
    onGalleryIndexUpdate() {
        throw new Error('not supported by memory DB');
    }
    updatePerson(name, partialPerson) {
        throw new Error('not supported by memory DB');
    }
}
exports.PersonManager = PersonManager;

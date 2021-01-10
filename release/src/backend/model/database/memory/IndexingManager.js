"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexingManager {
    indexDirectory(relativeDirectoryName) {
        throw new Error('not supported by memory DB');
    }
    resetDB() {
        throw new Error('not supported by memory DB');
    }
}
exports.IndexingManager = IndexingManager;

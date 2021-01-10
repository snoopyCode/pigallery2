"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContentWrapper {
    constructor(directory = null, searchResult = null, notModified) {
        this.directory = directory;
        this.searchResult = searchResult;
        this.notModified = notModified;
    }
}
exports.ContentWrapper = ContentWrapper;

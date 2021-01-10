"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchTypes;
(function (SearchTypes) {
    SearchTypes[SearchTypes["directory"] = 1] = "directory";
    SearchTypes[SearchTypes["person"] = 2] = "person";
    SearchTypes[SearchTypes["keyword"] = 3] = "keyword";
    SearchTypes[SearchTypes["position"] = 5] = "position";
    SearchTypes[SearchTypes["photo"] = 6] = "photo";
    SearchTypes[SearchTypes["video"] = 7] = "video";
})(SearchTypes = exports.SearchTypes || (exports.SearchTypes = {}));
class AutoCompleteItem {
    constructor(text, type) {
        this.text = text;
        this.type = type;
    }
    equals(other) {
        return this.text === other.text && this.type === other.type;
    }
}
exports.AutoCompleteItem = AutoCompleteItem;

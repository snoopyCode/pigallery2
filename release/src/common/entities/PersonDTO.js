"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Person {
    constructor() {
    }
    static getThumbnailUrl(that) {
        return '/api/person/' + that.name + '/thumbnail';
    }
}
exports.Person = Person;

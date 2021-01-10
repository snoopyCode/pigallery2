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
const Error_1 = require("../../common/entities/Error");
const ObjectManagers_1 = require("../model/ObjectManagers");
const Utils_1 = require("../../common/Utils");
class PersonMWs {
    static updatePerson(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.name) {
                return next();
            }
            try {
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance()
                    .PersonManager.updatePerson(req.params.name, req.body);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.PERSON_ERROR, 'Error during updating a person', err));
            }
        });
    }
    static getPerson(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.params.name) {
                return next();
            }
            try {
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance()
                    .PersonManager.get(req.params.name);
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.PERSON_ERROR, 'Error during updating a person', err));
            }
        });
    }
    static listPersons(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.resultPipe = yield ObjectManagers_1.ObjectManagers.getInstance()
                    .PersonManager.getAll();
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.PERSON_ERROR, 'Error during listing persons', err));
            }
        });
    }
    static cleanUpPersonResults(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.resultPipe) {
                return next();
            }
            try {
                const persons = Utils_1.Utils.clone(req.resultPipe);
                for (let i = 0; i < persons.length; i++) {
                    delete persons[i].sampleRegion;
                }
                req.resultPipe = persons;
                return next();
            }
            catch (err) {
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.PERSON_ERROR, 'Error during removing sample photo from all persons', err));
            }
        });
    }
}
exports.PersonMWs = PersonMWs;

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
const UserEntity_1 = require("./enitites/UserEntity");
const SQLConnection_1 = require("./SQLConnection");
const PasswordHelper_1 = require("../../PasswordHelper");
class UserManager {
    constructor() {
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const pass = filter.password;
            delete filter.password;
            const user = (yield connection.getRepository(UserEntity_1.UserEntity).findOne(filter));
            if (pass && !PasswordHelper_1.PasswordHelper.comparePassword(pass, user.password)) {
                throw new Error('No entry found');
            }
            return user;
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            return yield connection.getRepository(UserEntity_1.UserEntity).find(filter);
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            user.password = PasswordHelper_1.PasswordHelper.cryptPassword(user.password);
            return connection.getRepository(UserEntity_1.UserEntity).save(user);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const user = yield connection.getRepository(UserEntity_1.UserEntity).findOne({ id: id });
            return yield connection.getRepository(UserEntity_1.UserEntity).remove(user);
        });
    }
    changeRole(id, newRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield SQLConnection_1.SQLConnection.getConnection();
            const userRepository = connection.getRepository(UserEntity_1.UserEntity);
            const user = yield userRepository.findOne({ id: id });
            user.role = newRole;
            return userRepository.save(user);
        });
    }
    changePassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented'); // TODO: implement
        });
    }
}
exports.UserManager = UserManager;

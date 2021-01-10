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
const UserDTO_1 = require("../../../../common/entities/UserDTO");
const ProjectPath_1 = require("../../../ProjectPath");
const Utils_1 = require("../../../../common/Utils");
const fs = require("fs");
const path = require("path");
const PasswordHelper_1 = require("../../PasswordHelper");
class UserManager {
    constructor() {
        this.db = {};
        this.dbPath = path.join(ProjectPath_1.ProjectPath.DBFolder, 'users.db');
        if (fs.existsSync(this.dbPath)) {
            this.loadDB();
        }
        if (!this.db.idCounter) {
            this.db.idCounter = 1;
        }
        if (!this.db.users) {
            this.db.users = [];
            // TODO: remove defaults
            this.createUser({ name: 'admin', password: 'admin', role: UserDTO_1.UserRoles.Admin });
        }
        this.saveDB();
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.find(filter);
            if (result.length === 0) {
                throw new Error('UserDTO not found');
            }
            return result[0];
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const pass = filter.password;
            delete filter.password;
            const users = this.db.users.slice();
            let i = users.length;
            while (i--) {
                if (pass && !(PasswordHelper_1.PasswordHelper.comparePassword(pass, users[i].password))) {
                    users.splice(i, 1);
                    continue;
                }
                if (Utils_1.Utils.equalsFilter(users[i], filter) === false) {
                    users.splice(i, 1);
                }
            }
            return users;
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.id = this.db.idCounter++;
            user.password = PasswordHelper_1.PasswordHelper.cryptPassword(user.password);
            this.db.users.push(user);
            this.saveDB();
            return user;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = this.db.users.filter((u) => u.id === id);
            this.db.users = this.db.users.filter((u) => u.id !== id);
            this.saveDB();
            if (deleted.length > 0) {
                return deleted[0];
            }
            return null;
        });
    }
    changeRole(id, newRole) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.db.users.length; i++) {
                if (this.db.users[i].id === id) {
                    this.db.users[i].role = newRole;
                    this.saveDB();
                    return this.db.users[i];
                }
            }
        });
    }
    changePassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented'); // TODO: implement
        });
    }
    loadDB() {
        const data = fs.readFileSync(this.dbPath, 'utf8');
        this.db = JSON.parse(data);
    }
    saveDB() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.db));
    }
}
exports.UserManager = UserManager;

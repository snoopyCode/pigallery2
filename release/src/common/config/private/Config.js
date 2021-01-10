"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var PrivateConfigClass_1;
Object.defineProperty(exports, "__esModule", { value: true });
const PrivateConfig_1 = require("./PrivateConfig");
const ClientConfig_1 = require("../public/ClientConfig");
const crypto = require("crypto");
const path = require("path");
const node_1 = require("typeconfig/node");
const common_1 = require("typeconfig/common");
const upTime = (new Date()).toISOString();
let PrivateConfigClass = PrivateConfigClass_1 = class PrivateConfigClass {
    constructor() {
        this.Server = new PrivateConfig_1.ServerConfig.Config();
        this.Client = (new ClientConfig_1.ClientConfig.Config());
        if (!this.Server.sessionSecret || this.Server.sessionSecret.length === 0) {
            this.Server.sessionSecret = [crypto.randomBytes(256).toString('hex'),
                crypto.randomBytes(256).toString('hex'),
                crypto.randomBytes(256).toString('hex')];
        }
        this.Server.Environment.appVersion = require('../../../../package.json').version;
        this.Server.Environment.buildTime = require('../../../../package.json').buildTime;
        this.Server.Environment.buildCommitHash = require('../../../../package.json').buildCommitHash;
        this.Server.Environment.upTime = upTime;
        this.Server.Environment.isDocker = !!process.env['PI_DOCKER'];
    }
    original() {
        return __awaiter(this, void 0, void 0, function* () {
            const pc = node_1.ConfigClassBuilder.attachInterface(new PrivateConfigClass_1());
            yield pc.load();
            return pc;
        });
    }
};
__decorate([
    common_1.ConfigProperty({ type: PrivateConfig_1.ServerConfig.Config }),
    __metadata("design:type", PrivateConfig_1.ServerConfig.Config)
], PrivateConfigClass.prototype, "Server", void 0);
__decorate([
    common_1.ConfigProperty({ type: ClientConfig_1.ClientConfig.Config }),
    __metadata("design:type", Object)
], PrivateConfigClass.prototype, "Client", void 0);
PrivateConfigClass = PrivateConfigClass_1 = __decorate([
    node_1.ConfigClass({
        configPath: path.join(__dirname, './../../../../config.json'),
        saveIfNotExist: true,
        attachDescription: true,
        enumsAsString: true,
        softReadonly: true,
        cli: {
            enable: {
                configPath: true,
                attachState: true,
                attachDescription: true,
                rewriteCLIConfig: true,
                rewriteENVConfig: true,
                enumsAsString: true,
                saveIfNotExist: true,
                exitOnConfig: true
            },
            defaults: {
                enabled: true
            }
        }
    }),
    __metadata("design:paramtypes", [])
], PrivateConfigClass);
exports.PrivateConfigClass = PrivateConfigClass;
exports.Config = node_1.ConfigClassBuilder.attachInterface(new PrivateConfigClass());
exports.Config.loadSync();

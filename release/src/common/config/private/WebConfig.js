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
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-inferrable-types */
require("reflect-metadata");
const ClientConfig_1 = require("../public/ClientConfig");
const PrivateConfig_1 = require("./PrivateConfig");
const web_1 = require("typeconfig/web");
const common_1 = require("typeconfig/common");
let WebConfig = class WebConfig {
    constructor() {
        this.Server = new PrivateConfig_1.ServerConfig.Config();
        this.Client = new ClientConfig_1.ClientConfig.Config();
    }
};
__decorate([
    common_1.ConfigState(),
    __metadata("design:type", Object)
], WebConfig.prototype, "State", void 0);
__decorate([
    common_1.ConfigProperty(),
    __metadata("design:type", PrivateConfig_1.ServerConfig.Config)
], WebConfig.prototype, "Server", void 0);
__decorate([
    common_1.ConfigProperty(),
    __metadata("design:type", ClientConfig_1.ClientConfig.Config)
], WebConfig.prototype, "Client", void 0);
WebConfig = __decorate([
    web_1.WebConfigClass({ softReadonly: true })
], WebConfig);
exports.WebConfig = WebConfig;

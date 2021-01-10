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
const ClientConfig_1 = require("./ClientConfig");
const WebConfigClass_1 = require("typeconfig/src/decorators/class/WebConfigClass");
const WebConfigClassBuilder_1 = require("typeconfig/src/decorators/builders/WebConfigClassBuilder");
const ConfigPropoerty_1 = require("typeconfig/src/decorators/property/ConfigPropoerty");
/**
 * These configuration will be available at frontend and backend too
 */
let ClientClass = class ClientClass {
    /**
     * These configuration will be available at frontend and backend too
     */
    constructor() {
        this.Client = new ClientConfig_1.ClientConfig.Config();
    }
};
__decorate([
    ConfigPropoerty_1.ConfigProperty(),
    __metadata("design:type", ClientConfig_1.ClientConfig.Config)
], ClientClass.prototype, "Client", void 0);
ClientClass = __decorate([
    WebConfigClass_1.WebConfigClass()
], ClientClass);
exports.ClientClass = ClientClass;
exports.Config = WebConfigClassBuilder_1.WebConfigClassBuilder.attachInterface(new ClientClass());
if (typeof ServerInject !== 'undefined' && typeof ServerInject.ConfigInject !== 'undefined') {
    exports.Config.load(ServerInject.ConfigInject);
}
if (exports.Config.Client.publicUrl === '') {
    exports.Config.Client.publicUrl = location.origin;
}

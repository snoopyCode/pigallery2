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
const path = require("path");
const node_1 = require("typeconfig/node");
const common_1 = require("typeconfig/common");
let PrivateConfigClass = class PrivateConfigClass {
    constructor() {
        this.path = '/app/data/images';
        this.system = '';
        this.RUNS = 50;
    }
};
__decorate([
    common_1.ConfigProperty({ description: 'Images are loaded from this folder (read permission required)' }),
    __metadata("design:type", String)
], PrivateConfigClass.prototype, "path", void 0);
__decorate([
    common_1.ConfigProperty({ description: 'Describe your system setup' }),
    __metadata("design:type", String)
], PrivateConfigClass.prototype, "system", void 0);
__decorate([
    common_1.ConfigProperty({ description: 'Number of times to run the benchmark' }),
    __metadata("design:type", Number)
], PrivateConfigClass.prototype, "RUNS", void 0);
PrivateConfigClass = __decorate([
    node_1.ConfigClass({
        configPath: path.join(__dirname, './../bm_config.json'),
        saveIfNotExist: true,
        attachDescription: true,
        enumsAsString: true,
        softReadonly: true,
        cli: {
            prefix: 'bm-config',
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
    })
], PrivateConfigClass);
exports.PrivateConfigClass = PrivateConfigClass;
exports.BMConfig = node_1.ConfigClassBuilder.attachInterface(new PrivateConfigClass());
exports.BMConfig.loadSync();

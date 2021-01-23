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
const typeorm_1 = require("typeorm");
const DirectoryEntity_1 = require("./DirectoryEntity");
const EntityUtils_1 = require("./EntityUtils");
let FileEntity = class FileEntity {
};
__decorate([
    typeorm_1.Index(),
    typeorm_1.PrimaryGeneratedColumn({ unsigned: true }),
    __metadata("design:type", Number)
], FileEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(EntityUtils_1.columnCharsetCS),
    __metadata("design:type", String)
], FileEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.ManyToOne(type => DirectoryEntity_1.DirectoryEntity, directory => directory.metaFile, { onDelete: 'CASCADE', nullable: false }),
    __metadata("design:type", DirectoryEntity_1.DirectoryEntity)
], FileEntity.prototype, "directory", void 0);
FileEntity = __decorate([
    typeorm_1.Entity()
], FileEntity);
exports.FileEntity = FileEntity;
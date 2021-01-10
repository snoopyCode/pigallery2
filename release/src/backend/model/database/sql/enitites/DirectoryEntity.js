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
var DirectoryEntity_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const MediaEntity_1 = require("./MediaEntity");
const FileEntity_1 = require("./FileEntity");
const EntityUtils_1 = require("./EntityUtils");
let DirectoryEntity = DirectoryEntity_1 = class DirectoryEntity {
};
__decorate([
    typeorm_1.Index(),
    typeorm_1.PrimaryGeneratedColumn({ unsigned: true }),
    __metadata("design:type", Number)
], DirectoryEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column(EntityUtils_1.columnCharsetCS),
    __metadata("design:type", String)
], DirectoryEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column(EntityUtils_1.columnCharsetCS),
    __metadata("design:type", String)
], DirectoryEntity.prototype, "path", void 0);
__decorate([
    typeorm_1.Column('bigint', {
        unsigned: true, transformer: {
            from: v => parseInt(v, 10),
            to: v => v
        }
    }),
    __metadata("design:type", Number)
], DirectoryEntity.prototype, "lastModified", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bigint', nullable: true, unsigned: true, transformer: {
            from: v => parseInt(v, 10) || null,
            to: v => v
        }
    }),
    __metadata("design:type", Number)
], DirectoryEntity.prototype, "lastScanned", void 0);
__decorate([
    typeorm_1.Column('smallint', { unsigned: true }),
    __metadata("design:type", Number)
], DirectoryEntity.prototype, "mediaCount", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.ManyToOne(type => DirectoryEntity_1, directory => directory.directories, { onDelete: 'CASCADE' }),
    __metadata("design:type", DirectoryEntity)
], DirectoryEntity.prototype, "parent", void 0);
__decorate([
    typeorm_1.OneToMany(type => DirectoryEntity_1, dir => dir.parent),
    __metadata("design:type", Array)
], DirectoryEntity.prototype, "directories", void 0);
__decorate([
    typeorm_1.OneToMany(type => MediaEntity_1.MediaEntity, media => media.directory),
    __metadata("design:type", Array)
], DirectoryEntity.prototype, "media", void 0);
__decorate([
    typeorm_1.OneToMany(type => FileEntity_1.FileEntity, file => file.directory),
    __metadata("design:type", Array)
], DirectoryEntity.prototype, "metaFile", void 0);
DirectoryEntity = DirectoryEntity_1 = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['name', 'path'])
], DirectoryEntity);
exports.DirectoryEntity = DirectoryEntity;

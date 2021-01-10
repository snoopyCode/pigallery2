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
const ts_exif_parser_1 = require("ts-exif-parser");
const PhotoEntity_1 = require("./PhotoEntity");
const FaceRegionEntry_1 = require("./FaceRegionEntry");
const EntityUtils_1 = require("./EntityUtils");
class MediaDimensionEntity {
}
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], MediaDimensionEntity.prototype, "width", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], MediaDimensionEntity.prototype, "height", void 0);
exports.MediaDimensionEntity = MediaDimensionEntity;
class MediaMetadataEntity {
}
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], MediaMetadataEntity.prototype, "caption", void 0);
__decorate([
    typeorm_1.Column(type => MediaDimensionEntity),
    __metadata("design:type", MediaDimensionEntity)
], MediaMetadataEntity.prototype, "size", void 0);
__decorate([
    typeorm_1.Column('bigint', {
        unsigned: true, transformer: {
            from: v => parseInt(v, 10),
            to: v => v
        }
    }),
    __metadata("design:type", Number)
], MediaMetadataEntity.prototype, "creationDate", void 0);
__decorate([
    typeorm_1.Column('int', { unsigned: true }),
    __metadata("design:type", Number)
], MediaMetadataEntity.prototype, "fileSize", void 0);
__decorate([
    typeorm_1.Column('simple-array'),
    __metadata("design:type", Array)
], MediaMetadataEntity.prototype, "keywords", void 0);
__decorate([
    typeorm_1.Column(type => PhotoEntity_1.CameraMetadataEntity),
    __metadata("design:type", PhotoEntity_1.CameraMetadataEntity)
], MediaMetadataEntity.prototype, "cameraData", void 0);
__decorate([
    typeorm_1.Column(type => PhotoEntity_1.PositionMetaDataEntity),
    __metadata("design:type", PhotoEntity_1.PositionMetaDataEntity)
], MediaMetadataEntity.prototype, "positionData", void 0);
__decorate([
    typeorm_1.Column('tinyint', { unsigned: true }),
    __metadata("design:type", Number)
], MediaMetadataEntity.prototype, "rating", void 0);
__decorate([
    typeorm_1.Column('tinyint', { unsigned: true, default: ts_exif_parser_1.OrientationTypes.TOP_LEFT }),
    __metadata("design:type", Number)
], MediaMetadataEntity.prototype, "orientation", void 0);
__decorate([
    typeorm_1.OneToMany(type => FaceRegionEntry_1.FaceRegionEntry, faceRegion => faceRegion.media),
    __metadata("design:type", Array)
], MediaMetadataEntity.prototype, "faces", void 0);
__decorate([
    typeorm_1.Column('int', { unsigned: true }),
    __metadata("design:type", Number)
], MediaMetadataEntity.prototype, "bitRate", void 0);
__decorate([
    typeorm_1.Column('int', { unsigned: true }),
    __metadata("design:type", Number)
], MediaMetadataEntity.prototype, "duration", void 0);
exports.MediaMetadataEntity = MediaMetadataEntity;
// TODO: fix inheritance once its working in typeorm
let MediaEntity = class MediaEntity {
    // TODO: fix inheritance once its working in typeorm
    constructor() {
        this.readyThumbnails = [];
        this.readyIcon = false;
    }
};
__decorate([
    typeorm_1.Index(),
    typeorm_1.PrimaryGeneratedColumn({ unsigned: true }),
    __metadata("design:type", Number)
], MediaEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(EntityUtils_1.columnCharsetCS),
    __metadata("design:type", String)
], MediaEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.ManyToOne(type => DirectoryEntity_1.DirectoryEntity, directory => directory.media, { onDelete: 'CASCADE', nullable: false }),
    __metadata("design:type", DirectoryEntity_1.DirectoryEntity)
], MediaEntity.prototype, "directory", void 0);
__decorate([
    typeorm_1.Column(type => MediaMetadataEntity),
    __metadata("design:type", MediaMetadataEntity)
], MediaEntity.prototype, "metadata", void 0);
MediaEntity = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['name', 'directory']),
    typeorm_1.TableInheritance({ column: { type: 'varchar', name: 'type', length: 32 } })
], MediaEntity);
exports.MediaEntity = MediaEntity;

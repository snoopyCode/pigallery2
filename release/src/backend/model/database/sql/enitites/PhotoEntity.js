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
const MediaEntity_1 = require("./MediaEntity");
class CameraMetadataEntity {
}
__decorate([
    typeorm_1.Column('int', { nullable: true, unsigned: true }),
    __metadata("design:type", Number)
], CameraMetadataEntity.prototype, "ISO", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], CameraMetadataEntity.prototype, "model", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], CameraMetadataEntity.prototype, "make", void 0);
__decorate([
    typeorm_1.Column('float', { nullable: true }),
    __metadata("design:type", Number)
], CameraMetadataEntity.prototype, "fStop", void 0);
__decorate([
    typeorm_1.Column('float', { nullable: true }),
    __metadata("design:type", Number)
], CameraMetadataEntity.prototype, "exposure", void 0);
__decorate([
    typeorm_1.Column('float', { nullable: true }),
    __metadata("design:type", Number)
], CameraMetadataEntity.prototype, "focalLength", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], CameraMetadataEntity.prototype, "lens", void 0);
exports.CameraMetadataEntity = CameraMetadataEntity;
class GPSMetadataEntity {
}
__decorate([
    typeorm_1.Column('float', { nullable: true }),
    __metadata("design:type", Number)
], GPSMetadataEntity.prototype, "latitude", void 0);
__decorate([
    typeorm_1.Column('float', { nullable: true }),
    __metadata("design:type", Number)
], GPSMetadataEntity.prototype, "longitude", void 0);
__decorate([
    typeorm_1.Column('int', { nullable: true }),
    __metadata("design:type", Number)
], GPSMetadataEntity.prototype, "altitude", void 0);
exports.GPSMetadataEntity = GPSMetadataEntity;
class PositionMetaDataEntity {
}
__decorate([
    typeorm_1.Column(type => GPSMetadataEntity),
    __metadata("design:type", GPSMetadataEntity)
], PositionMetaDataEntity.prototype, "GPSData", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], PositionMetaDataEntity.prototype, "country", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], PositionMetaDataEntity.prototype, "state", void 0);
__decorate([
    typeorm_1.Column('text', { nullable: true }),
    __metadata("design:type", String)
], PositionMetaDataEntity.prototype, "city", void 0);
exports.PositionMetaDataEntity = PositionMetaDataEntity;
class PhotoMetadataEntity extends MediaEntity_1.MediaMetadataEntity {
}
exports.PhotoMetadataEntity = PhotoMetadataEntity;
let PhotoEntity = class PhotoEntity extends MediaEntity_1.MediaEntity {
};
__decorate([
    typeorm_1.Column(type => PhotoMetadataEntity),
    __metadata("design:type", PhotoMetadataEntity)
], PhotoEntity.prototype, "metadata", void 0);
PhotoEntity = __decorate([
    typeorm_1.ChildEntity()
], PhotoEntity);
exports.PhotoEntity = PhotoEntity;

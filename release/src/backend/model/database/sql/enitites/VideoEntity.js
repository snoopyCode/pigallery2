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
class VideoMetadataEntity extends MediaEntity_1.MediaMetadataEntity {
}
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], VideoMetadataEntity.prototype, "bitRate", void 0);
__decorate([
    typeorm_1.Column('bigint', {
        unsigned: true, nullable: true, transformer: {
            from: v => parseInt(v, 10) || null,
            to: v => v
        }
    }),
    __metadata("design:type", Number)
], VideoMetadataEntity.prototype, "duration", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], VideoMetadataEntity.prototype, "fps", void 0);
exports.VideoMetadataEntity = VideoMetadataEntity;
let VideoEntity = class VideoEntity extends MediaEntity_1.MediaEntity {
};
__decorate([
    typeorm_1.Column(type => VideoMetadataEntity),
    __metadata("design:type", VideoMetadataEntity)
], VideoEntity.prototype, "metadata", void 0);
VideoEntity = __decorate([
    typeorm_1.ChildEntity()
], VideoEntity);
exports.VideoEntity = VideoEntity;

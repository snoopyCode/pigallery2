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
const PersonEntry_1 = require("./PersonEntry");
const MediaEntity_1 = require("./MediaEntity");
class FaceRegionBoxEntry {
}
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], FaceRegionBoxEntry.prototype, "height", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], FaceRegionBoxEntry.prototype, "width", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], FaceRegionBoxEntry.prototype, "left", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], FaceRegionBoxEntry.prototype, "top", void 0);
exports.FaceRegionBoxEntry = FaceRegionBoxEntry;
/**
 * This is a switching table between media and persons
 */
let FaceRegionEntry = class FaceRegionEntry {
    static fromRawToDTO(raw) {
        return {
            box: { width: raw.faces_boxWidth, height: raw.faces_boxHeight, left: raw.faces_boxLeft, top: raw.faces_boxTop },
            name: raw.person_name
        };
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ unsigned: true }),
    __metadata("design:type", Number)
], FaceRegionEntry.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(type => FaceRegionBoxEntry),
    __metadata("design:type", FaceRegionBoxEntry)
], FaceRegionEntry.prototype, "box", void 0);
__decorate([
    typeorm_1.ManyToOne(type => MediaEntity_1.MediaEntity, media => media.metadata.faces, { onDelete: 'CASCADE', nullable: false }),
    __metadata("design:type", MediaEntity_1.MediaEntity)
], FaceRegionEntry.prototype, "media", void 0);
__decorate([
    typeorm_1.ManyToOne(type => PersonEntry_1.PersonEntry, person => person.faces, { onDelete: 'CASCADE', nullable: false }),
    __metadata("design:type", PersonEntry_1.PersonEntry)
], FaceRegionEntry.prototype, "person", void 0);
FaceRegionEntry = __decorate([
    typeorm_1.Entity()
], FaceRegionEntry);
exports.FaceRegionEntry = FaceRegionEntry;

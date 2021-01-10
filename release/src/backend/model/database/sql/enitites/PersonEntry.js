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
const FaceRegionEntry_1 = require("./FaceRegionEntry");
const EntityUtils_1 = require("./EntityUtils");
let PersonEntry = class PersonEntry {
};
__decorate([
    typeorm_1.Index(),
    typeorm_1.PrimaryGeneratedColumn({ unsigned: true }),
    __metadata("design:type", Number)
], PersonEntry.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(EntityUtils_1.columnCharsetCS),
    __metadata("design:type", String)
], PersonEntry.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('int', { unsigned: true, default: 0 }),
    __metadata("design:type", Number)
], PersonEntry.prototype, "count", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], PersonEntry.prototype, "isFavourite", void 0);
__decorate([
    typeorm_1.OneToMany(type => FaceRegionEntry_1.FaceRegionEntry, faceRegion => faceRegion.person),
    __metadata("design:type", Array)
], PersonEntry.prototype, "faces", void 0);
__decorate([
    typeorm_1.ManyToOne(type => FaceRegionEntry_1.FaceRegionEntry, { onDelete: 'SET NULL', nullable: true }),
    __metadata("design:type", FaceRegionEntry_1.FaceRegionEntry)
], PersonEntry.prototype, "sampleRegion", void 0);
PersonEntry = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['name'])
], PersonEntry);
exports.PersonEntry = PersonEntry;

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
const UserEntity_1 = require("./UserEntity");
const UserDTO_1 = require("../../../../../common/entities/UserDTO");
let SharingEntity = class SharingEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ unsigned: true }),
    __metadata("design:type", Number)
], SharingEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SharingEntity.prototype, "sharingKey", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SharingEntity.prototype, "path", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SharingEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column('bigint', {
        unsigned: true, transformer: {
            from: v => parseInt(v, 10),
            to: v => v
        }
    }),
    __metadata("design:type", Number)
], SharingEntity.prototype, "expires", void 0);
__decorate([
    typeorm_1.Column('bigint', {
        unsigned: true, transformer: {
            from: v => parseInt(v, 10),
            to: v => v
        }
    }),
    __metadata("design:type", Number)
], SharingEntity.prototype, "timeStamp", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], SharingEntity.prototype, "includeSubfolders", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserEntity_1.UserEntity, { onDelete: 'CASCADE', nullable: false }),
    __metadata("design:type", Object)
], SharingEntity.prototype, "creator", void 0);
SharingEntity = __decorate([
    typeorm_1.Entity()
], SharingEntity);
exports.SharingEntity = SharingEntity;

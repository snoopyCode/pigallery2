"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Config_1 = require("../common/config/private/Config");
class ProjectPathClass {
    constructor() {
        this.reset();
    }
    normalizeRelative(pathStr) {
        return path.join(pathStr, path.sep);
    }
    getAbsolutePath(pathStr) {
        return path.isAbsolute(pathStr) ? pathStr : path.join(this.Root, pathStr);
    }
    getRelativePathToImages(pathStr) {
        return path.relative(this.ImageFolder, pathStr);
    }
    reset() {
        this.Root = path.join(__dirname, '/../../');
        this.FrontendFolder = path.join(this.Root, 'dist');
        this.ImageFolder = this.getAbsolutePath(Config_1.Config.Server.Media.folder);
        this.TempFolder = this.getAbsolutePath(Config_1.Config.Server.Media.tempFolder);
        this.TranscodedFolder = path.join(this.TempFolder, 'tc');
        this.FacesFolder = path.join(this.TempFolder, 'f');
        this.DBFolder = this.getAbsolutePath(Config_1.Config.Server.Database.dbFolder);
        // create thumbnail folder if not exist
        if (!fs.existsSync(this.TempFolder)) {
            fs.mkdirSync(this.TempFolder);
        }
    }
}
exports.ProjectPath = new ProjectPathClass();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectPath_1 = require("../ProjectPath");
const fs = require("fs");
const path = require("path");
const Config_1 = require("../../common/config/private/Config");
class Localizations {
    constructor() {
    }
    static init() {
        const notLanguage = ['assets'];
        const dirCont = fs.readdirSync(ProjectPath_1.ProjectPath.FrontendFolder)
            .filter(f => fs.statSync(path.join(ProjectPath_1.ProjectPath.FrontendFolder, f)).isDirectory());
        Config_1.Config.Client.languages = dirCont.filter(d => notLanguage.indexOf(d) === -1);
        Config_1.Config.Client.languages.push('en');
    }
}
exports.Localizations = Localizations;

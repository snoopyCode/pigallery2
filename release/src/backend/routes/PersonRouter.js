"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationMWs_1 = require("../middlewares/user/AuthenticationMWs");
const RenderingMWs_1 = require("../middlewares/RenderingMWs");
const UserDTO_1 = require("../../common/entities/UserDTO");
const PersonMWs_1 = require("../middlewares/PersonMWs");
const ThumbnailGeneratorMWs_1 = require("../middlewares/thumbnail/ThumbnailGeneratorMWs");
const VersionMWs_1 = require("../middlewares/VersionMWs");
const Config_1 = require("../../common/config/private/Config");
class PersonRouter {
    static route(app) {
        this.updatePerson(app);
        this.addGetPersons(app);
        this.getPersonThumbnail(app);
    }
    static updatePerson(app) {
        app.post(['/api/person/:name'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(Config_1.Config.Client.Faces.writeAccessMinRole), VersionMWs_1.VersionMWs.injectGalleryVersion, 
        // specific part
        PersonMWs_1.PersonMWs.updatePerson, RenderingMWs_1.RenderingMWs.renderResult);
    }
    static addGetPersons(app) {
        app.get(['/api/person'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(Config_1.Config.Client.Faces.readAccessMinRole), VersionMWs_1.VersionMWs.injectGalleryVersion, 
        // specific part
        PersonMWs_1.PersonMWs.listPersons, 
        // PersonMWs.addSamplePhotoForAll,
        ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.addThumbnailInfoForPersons, PersonMWs_1.PersonMWs.cleanUpPersonResults, RenderingMWs_1.RenderingMWs.renderResult);
    }
    static getPersonThumbnail(app) {
        app.get(['/api/person/:name/thumbnail'], 
        // common part
        AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.User), VersionMWs_1.VersionMWs.injectGalleryVersion, 
        // specific part
        PersonMWs_1.PersonMWs.getPerson, ThumbnailGeneratorMWs_1.ThumbnailGeneratorMWs.generatePersonThumbnail, RenderingMWs_1.RenderingMWs.renderFile);
    }
}
exports.PersonRouter = PersonRouter;

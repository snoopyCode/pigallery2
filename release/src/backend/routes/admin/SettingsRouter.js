"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationMWs_1 = require("../../middlewares/user/AuthenticationMWs");
const UserDTO_1 = require("../../../common/entities/UserDTO");
const RenderingMWs_1 = require("../../middlewares/RenderingMWs");
const SettingsMWs_1 = require("../../middlewares/admin/SettingsMWs");
class SettingsRouter {
    static route(app) {
        this.addSettings(app);
    }
    static addSettings(app) {
        app.get('/api/settings', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), RenderingMWs_1.RenderingMWs.renderConfig);
        app.put('/api/settings/database', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateDatabaseSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/map', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateMapSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/video', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateVideoSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/photo', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updatePhotoSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/metafile', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateMetaFileSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/authentication', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateAuthenticationSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/thumbnail', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateThumbnailSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/search', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateSearchSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/faces', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateFacesSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/share', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateShareSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/randomPhoto', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateRandomPhotoSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/basic', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateBasicSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/other', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateOtherSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/indexing', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateIndexingSettings, RenderingMWs_1.RenderingMWs.renderOK);
        app.put('/api/settings/jobs', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SettingsMWs_1.SettingsMWs.updateJobSettings, RenderingMWs_1.RenderingMWs.renderOK);
    }
}
exports.SettingsRouter = SettingsRouter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationMWs_1 = require("../middlewares/user/AuthenticationMWs");
const UserDTO_1 = require("../../common/entities/UserDTO");
const RenderingMWs_1 = require("../middlewares/RenderingMWs");
const SharingMWs_1 = require("../middlewares/SharingMWs");
const QueryParams_1 = require("../../common/QueryParams");
class SharingRouter {
    static route(app) {
        this.addShareLogin(app);
        this.addGetSharing(app);
        this.addCreateSharing(app);
        this.addUpdateSharing(app);
        this.addListSharing(app);
        this.addDeleteSharing(app);
    }
    static addShareLogin(app) {
        app.post('/api/share/login', AuthenticationMWs_1.AuthenticationMWs.inverseAuthenticate, AuthenticationMWs_1.AuthenticationMWs.shareLogin, RenderingMWs_1.RenderingMWs.renderSessionUser);
    }
    static addGetSharing(app) {
        app.get('/api/share/:' + QueryParams_1.QueryParams.gallery.sharingKey_params, AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.LimitedGuest), SharingMWs_1.SharingMWs.getSharing, RenderingMWs_1.RenderingMWs.renderSharing);
    }
    static addCreateSharing(app) {
        app.post(['/api/share/:directory(*)', '/api/share/', '/api/share//'], AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.User), SharingMWs_1.SharingMWs.createSharing, RenderingMWs_1.RenderingMWs.renderSharing);
    }
    static addUpdateSharing(app) {
        app.put(['/api/share/:directory(*)', '/api/share/', '/api/share//'], AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.User), SharingMWs_1.SharingMWs.updateSharing, RenderingMWs_1.RenderingMWs.renderSharing);
    }
    static addDeleteSharing(app) {
        app.delete(['/api/share/:sharingKey'], AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), SharingMWs_1.SharingMWs.deleteSharing, RenderingMWs_1.RenderingMWs.renderOK);
    }
    static addListSharing(app) {
        app.get(['/api/share/list'], AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.User), SharingMWs_1.SharingMWs.listSharing, RenderingMWs_1.RenderingMWs.renderSharingList);
    }
}
exports.SharingRouter = SharingRouter;

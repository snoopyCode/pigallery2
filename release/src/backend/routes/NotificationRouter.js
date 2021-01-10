"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserDTO_1 = require("../../common/entities/UserDTO");
const AuthenticationMWs_1 = require("../middlewares/user/AuthenticationMWs");
const RenderingMWs_1 = require("../middlewares/RenderingMWs");
const NotificationMWs_1 = require("../middlewares/NotificationMWs");
const VersionMWs_1 = require("../middlewares/VersionMWs");
class NotificationRouter {
    static route(app) {
        this.addGetNotifications(app);
    }
    static addGetNotifications(app) {
        app.get('/api/notifications', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Guest), VersionMWs_1.VersionMWs.injectGalleryVersion, NotificationMWs_1.NotificationMWs.list, RenderingMWs_1.RenderingMWs.renderResult);
    }
}
exports.NotificationRouter = NotificationRouter;

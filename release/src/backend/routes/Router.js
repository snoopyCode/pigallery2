"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PublicRouter_1 = require("./PublicRouter");
const UserRouter_1 = require("./UserRouter");
const GalleryRouter_1 = require("./GalleryRouter");
const PersonRouter_1 = require("./PersonRouter");
const SharingRouter_1 = require("./SharingRouter");
const AdminRouter_1 = require("./admin/AdminRouter");
const SettingsRouter_1 = require("./admin/SettingsRouter");
const NotificationRouter_1 = require("./NotificationRouter");
const ErrorRouter_1 = require("./ErrorRouter");
class Router {
    static route(app) {
        PublicRouter_1.PublicRouter.route(app);
        UserRouter_1.UserRouter.route(app);
        GalleryRouter_1.GalleryRouter.route(app);
        PersonRouter_1.PersonRouter.route(app);
        SharingRouter_1.SharingRouter.route(app);
        AdminRouter_1.AdminRouter.route(app);
        SettingsRouter_1.SettingsRouter.route(app);
        NotificationRouter_1.NotificationRouter.route(app);
        ErrorRouter_1.ErrorRouter.route(app);
    }
}
exports.Router = Router;

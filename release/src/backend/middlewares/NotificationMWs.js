"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserDTO_1 = require("../../common/entities/UserDTO");
const NotifocationManager_1 = require("../model/NotifocationManager");
class NotificationMWs {
    static list(req, res, next) {
        if (req.session.user.role >= UserDTO_1.UserRoles.Admin) {
            req.resultPipe = NotifocationManager_1.NotificationManager.notifications;
        }
        else if (NotifocationManager_1.NotificationManager.notifications.length > 0) {
            req.resultPipe = NotifocationManager_1.NotificationManager.HasNotification;
        }
        else {
            req.resultPipe = [];
        }
        return next();
    }
}
exports.NotificationMWs = NotificationMWs;

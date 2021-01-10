"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationDTO_1 = require("../../common/entities/NotificationDTO");
class NotificationManager {
    static error(message, details, req) {
        const noti = {
            type: NotificationDTO_1.NotificationType.error,
            message: message,
            details: details
        };
        if (req) {
            noti.request = {
                method: req.method,
                url: req.url,
                statusCode: req.statusCode
            };
        }
        NotificationManager.notifications.push(noti);
    }
    static warning(message, details, req) {
        const noti = {
            type: NotificationDTO_1.NotificationType.warning,
            message: message,
            details: details
        };
        if (req) {
            noti.request = {
                method: req.method,
                url: req.url,
                statusCode: req.statusCode
            };
        }
        NotificationManager.notifications.push(noti);
    }
}
NotificationManager.notifications = [];
NotificationManager.HasNotification = [
    {
        type: NotificationDTO_1.NotificationType.info,
        message: 'There are unhandled server notification. Login as Administrator to handle them.'
    }
];
exports.NotificationManager = NotificationManager;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationMWs_1 = require("../../middlewares/user/AuthenticationMWs");
const UserDTO_1 = require("../../../common/entities/UserDTO");
const RenderingMWs_1 = require("../../middlewares/RenderingMWs");
const AdminMWs_1 = require("../../middlewares/admin/AdminMWs");
class AdminRouter {
    static route(app) {
        this.addGetStatistic(app);
        this.addGetDuplicates(app);
        this.addJobs(app);
    }
    static addGetStatistic(app) {
        app.get('/api/admin/statistic', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), AdminMWs_1.AdminMWs.loadStatistic, RenderingMWs_1.RenderingMWs.renderResult);
    }
    static addGetDuplicates(app) {
        app.get('/api/admin/duplicates', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), AdminMWs_1.AdminMWs.getDuplicates, RenderingMWs_1.RenderingMWs.renderResult);
    }
    static addJobs(app) {
        app.get('/api/admin/jobs/available', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), AdminMWs_1.AdminMWs.getAvailableJobs, RenderingMWs_1.RenderingMWs.renderResult);
        app.get('/api/admin/jobs/scheduled/progress', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), AdminMWs_1.AdminMWs.getJobProgresses, RenderingMWs_1.RenderingMWs.renderResult);
        app.post('/api/admin/jobs/scheduled/:id/start', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), AdminMWs_1.AdminMWs.startJob, RenderingMWs_1.RenderingMWs.renderResult);
        app.post('/api/admin/jobs/scheduled/:id/stop', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), AdminMWs_1.AdminMWs.stopJob, RenderingMWs_1.RenderingMWs.renderResult);
    }
}
exports.AdminRouter = AdminRouter;

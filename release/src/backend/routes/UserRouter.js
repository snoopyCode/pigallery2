"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserMWs_1 = require("../middlewares/user/UserMWs");
const UserDTO_1 = require("../../common/entities/UserDTO");
const AuthenticationMWs_1 = require("../middlewares/user/AuthenticationMWs");
const UserRequestConstrainsMWs_1 = require("../middlewares/user/UserRequestConstrainsMWs");
const RenderingMWs_1 = require("../middlewares/RenderingMWs");
class UserRouter {
    static route(app) {
        this.addLogin(app);
        this.addLogout(app);
        this.addGetSessionUser(app);
        this.addChangePassword(app);
        this.addCreateUser(app);
        this.addDeleteUser(app);
        this.addListUsers(app);
        this.addChangeRole(app);
    }
    static addLogin(app) {
        app.post('/api/user/login', AuthenticationMWs_1.AuthenticationMWs.inverseAuthenticate, AuthenticationMWs_1.AuthenticationMWs.login, RenderingMWs_1.RenderingMWs.renderSessionUser);
    }
    static addLogout(app) {
        app.post('/api/user/logout', AuthenticationMWs_1.AuthenticationMWs.logout, RenderingMWs_1.RenderingMWs.renderOK);
    }
    static addGetSessionUser(app) {
        app.get('/api/user/me', AuthenticationMWs_1.AuthenticationMWs.authenticate, RenderingMWs_1.RenderingMWs.renderSessionUser);
    }
    static addChangePassword(app) {
        app.post('/api/user/:id/password', AuthenticationMWs_1.AuthenticationMWs.authenticate, UserRequestConstrainsMWs_1.UserRequestConstrainsMWs.forceSelfRequest, UserMWs_1.UserMWs.changePassword, RenderingMWs_1.RenderingMWs.renderOK);
    }
    static addCreateUser(app) {
        app.put('/api/user', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), UserMWs_1.UserMWs.createUser, RenderingMWs_1.RenderingMWs.renderOK);
    }
    static addDeleteUser(app) {
        app.delete('/api/user/:id', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), UserRequestConstrainsMWs_1.UserRequestConstrainsMWs.notSelfRequest, UserMWs_1.UserMWs.deleteUser, RenderingMWs_1.RenderingMWs.renderOK);
    }
    static addListUsers(app) {
        app.get('/api/user/list', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), UserMWs_1.UserMWs.listUsers, RenderingMWs_1.RenderingMWs.renderResult);
    }
    static addChangeRole(app) {
        app.post('/api/user/:id/role', AuthenticationMWs_1.AuthenticationMWs.authenticate, AuthenticationMWs_1.AuthenticationMWs.authorise(UserDTO_1.UserRoles.Admin), UserRequestConstrainsMWs_1.UserRequestConstrainsMWs.notSelfRequestOr2Admins, UserMWs_1.UserMWs.changeRole, RenderingMWs_1.RenderingMWs.renderOK);
    }
}
exports.UserRouter = UserRouter;

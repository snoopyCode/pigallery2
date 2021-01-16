"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const Config_1 = require("../../common/config/private/Config");
const ProjectPath_1 = require("../ProjectPath");
const AuthenticationMWs_1 = require("../middlewares/user/AuthenticationMWs");
const CookieNames_1 = require("../../common/CookieNames");
const Error_1 = require("../../common/entities/Error");
class PublicRouter {
    static route(app) {
        const setLocale = (req, res, next) => {
            let localePath = '';
            let selectedLocale = req['locale'];
            if (req.cookies && req.cookies[CookieNames_1.CookieNames.lang]) {
                if (Config_1.Config.Client.languages.indexOf(req.cookies[CookieNames_1.CookieNames.lang]) !== -1) {
                    selectedLocale = req.cookies[CookieNames_1.CookieNames.lang];
                }
            }
            if (selectedLocale !== 'en') {
                localePath = selectedLocale;
            }
            res.cookie(CookieNames_1.CookieNames.lang, selectedLocale);
            req['localePath'] = localePath;
            next();
        };
        const renderIndex = (req, res, next) => {
            ejs.renderFile(path.join(ProjectPath_1.ProjectPath.FrontendFolder, req['localePath'], 'index.html'), res.tpl, (err, str) => {
                if (err) {
                    return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.GENERAL_ERROR, err.message));
                }
                res.send(str);
            });
        };
        const redirectToBase = (locale) => {
            return (req, res) => {
                if (Config_1.Config.Client.languages.indexOf(locale) !== -1) {
                    res.cookie(CookieNames_1.CookieNames.lang, locale);
                }
                res.redirect('/?ln=' + locale);
            };
        };
        app.use((req, res, next) => {
            res.tpl = {};
            res.tpl.user = null;
            if (req.session.user) {
                res.tpl.user = {
                    id: req.session.user.id,
                    name: req.session.user.name,
                    csrfToken: req.session.user.csrfToken,
                    role: req.session.user.role,
                    usedSharingKey: req.session.user.usedSharingKey,
                    permissions: req.session.user.permissions
                };
                if (!res.tpl.user.csrfToken && req.csrfToken) {
                    res.tpl.user.csrfToken = req.csrfToken();
                }
            }
            res.tpl.Config = { Client: Config_1.Config.Client.toJSON({ attachVolatile: true }) };
            return next();
        });
        app.get('/heartbeat', (req, res, next) => {
            res.sendStatus(200);
        });
        app.get('/manifest.json', (req, res, next) => {
            res.send({
                name: Config_1.Config.Client.applicationTitle,
                icons: [
                    {
                        src: 'assets/icon_inv.png',
                        sizes: '48x48 72x72 96x96 128x128 256x256'
                    }
                ],
                display: 'standalone',
                orientation: 'any',
                start_url: Config_1.Config.Client.publicUrl ? "." : Config_1.Config.Client.publicUrl,
                background_color: '#000000',
                theme_color: '#000000'
            });
        });
        app.get(['/', '/login', '/gallery*', '/share*', '/admin', '/duplicates', '/faces', '/search*'], AuthenticationMWs_1.AuthenticationMWs.tryAuthenticate, setLocale, renderIndex);
        Config_1.Config.Client.languages.forEach(l => {
            app.get(['/' + l + '/', '/' + l + '/login', '/' + l + '/gallery*', '/' + l + '/share*', '/' + l + '/admin', '/' + l + '/search*'], redirectToBase(l));
        });
        const renderFile = (subDir = '') => {
            return (req, res) => {
                const file = path.join(ProjectPath_1.ProjectPath.FrontendFolder, req['localePath'], subDir, req.params.file);
                fs.exists(file, (exists) => {
                    if (!exists) {
                        return res.sendStatus(404);
                    }
                    res.sendFile(file);
                });
            };
        };
        app.get('/assets/:file(*)', setLocale, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('file'), renderFile('assets'));
        app.get('/:file', setLocale, AuthenticationMWs_1.AuthenticationMWs.normalizePathParam('file'), renderFile());
    }
}
exports.PublicRouter = PublicRouter;

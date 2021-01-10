"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../common/config/private/Config");
const _express = require("express");
const _bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const _http = require("http");
// @ts-ignore
const locale = require("locale");
const ObjectManagers_1 = require("./model/ObjectManagers");
const Logger_1 = require("./Logger");
const LoggerRouter_1 = require("./routes/LoggerRouter");
const DiskManger_1 = require("./model/DiskManger");
const ConfigDiagnostics_1 = require("./model/diagnostics/ConfigDiagnostics");
const Localizations_1 = require("./model/Localizations");
const CookieNames_1 = require("../common/CookieNames");
const Router_1 = require("./routes/Router");
const PhotoProcessing_1 = require("./model/fileprocessing/PhotoProcessing");
const _csrf = require("csurf");
const unless = require("express-unless");
const Event_1 = require("../common/event/Event");
const QueryParams_1 = require("../common/QueryParams");
const PrivateConfig_1 = require("../common/config/private/PrivateConfig");
const node_1 = require("typeconfig/node");
const _session = require('cookie-session');
const LOG_TAG = '[server]';
class Server {
    constructor() {
        this.onStarted = new Event_1.Event();
        /**
         * Event listener for HTTP server "error" event.
         */
        this.onError = (error) => {
            if (error.syscall !== 'listen') {
                Logger_1.Logger.error(LOG_TAG, 'Server error', error);
                throw error;
            }
            const bind = Config_1.Config.Server.host + ':' + Config_1.Config.Server.port;
            // handle specific listen error with friendly messages
            switch (error.code) {
                case 'EACCES':
                    Logger_1.Logger.error(LOG_TAG, bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    Logger_1.Logger.error(LOG_TAG, bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        };
        /**
         * Event listener for HTTP server "listening" event.
         */
        this.onListening = () => {
            const addr = this.server.address();
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            Logger_1.Logger.info(LOG_TAG, 'Listening on ' + bind);
        };
        if (!(process.env.NODE_ENV === 'production')) {
            Logger_1.Logger.info(LOG_TAG, 'Running in DEBUG mode, set env variable NODE_ENV=production to disable ');
        }
        this.init().catch(console.error);
    }
    get App() {
        return this.server;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger_1.Logger.info(LOG_TAG, 'running diagnostics...');
            yield ConfigDiagnostics_1.ConfigDiagnostics.runDiagnostics();
            Logger_1.Logger.verbose(LOG_TAG, 'using config from ' +
                node_1.ConfigClassBuilder.attachPrivateInterface(Config_1.Config).__options.configPath + ':');
            Logger_1.Logger.verbose(LOG_TAG, JSON.stringify(Config_1.Config, null, '\t'));
            this.app = _express();
            LoggerRouter_1.LoggerRouter.route(this.app);
            this.app.set('view engine', 'ejs');
            /**
             * Session above all
             */
            this.app.use(_session({
                name: CookieNames_1.CookieNames.session,
                keys: Config_1.Config.Server.sessionSecret
            }));
            /**
             * Parse parameters in POST
             */
            // for parsing application/json
            this.app.use(_bodyParser.json());
            this.app.use(cookieParser());
            const csuf = _csrf();
            csuf.unless = unless;
            this.app.use(csuf.unless((req) => {
                return Config_1.Config.Client.authenticationRequired === false ||
                    ['/api/user/login', '/api/user/logout', '/api/share/login'].indexOf(req.originalUrl) !== -1 ||
                    (Config_1.Config.Client.Sharing.enabled === true && !!req.query[QueryParams_1.QueryParams.gallery.sharingKey_query]);
            }));
            // enable token generation but do not check it
            this.app.post(['/api/user/login', '/api/share/login'], _csrf({ ignoreMethods: ['POST'] }));
            this.app.get(['/api/user/me', '/api/share/:' + QueryParams_1.QueryParams.gallery.sharingKey_params], _csrf({ ignoreMethods: ['GET'] }));
            DiskManger_1.DiskManager.init();
            PhotoProcessing_1.PhotoProcessing.init();
            Localizations_1.Localizations.init();
            this.app.use(locale(Config_1.Config.Client.languages, 'en'));
            if (Config_1.Config.Server.Database.type !== PrivateConfig_1.ServerConfig.DatabaseType.memory) {
                yield ObjectManagers_1.ObjectManagers.InitSQLManagers();
            }
            else {
                yield ObjectManagers_1.ObjectManagers.InitMemoryManagers();
            }
            Router_1.Router.route(this.app);
            // Get PORT from environment and store in Express.
            this.app.set('port', Config_1.Config.Server.port);
            // Create HTTP server.
            this.server = _http.createServer(this.app);
            // Listen on provided PORT, on all network interfaces.
            this.server.listen(Config_1.Config.Server.port, Config_1.Config.Server.host);
            this.server.on('error', this.onError);
            this.server.on('listening', this.onListening);
            this.onStarted.trigger();
        });
    }
}
exports.Server = Server;

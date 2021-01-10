"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../Logger");
/**
 * Adds logging to express
 */
class LoggerRouter {
    static log(loggerFn, req, res) {
        if (req.logged === true) {
            return;
        }
        req.logged = true;
        const end = res.end;
        res.end = (a, b, c) => {
            res.end = end;
            res.end(a, b, c);
            loggerFn(req.method, req.url, res.statusCode, (Date.now() - req._startTime) + 'ms');
        };
    }
    static route(app) {
        /* Save start time for all requests */
        app.use((req, res, next) => {
            req._startTime = Date.now();
            return next();
        });
        app.get('/api*', (req, res, next) => {
            LoggerRouter.log(Logger_1.Logger.verbose, req, res);
            return next();
        });
        app.get('/node_modules*', (req, res, next) => {
            LoggerRouter.log(Logger_1.Logger.silly, req, res);
            return next();
        });
        app.use((req, res, next) => {
            LoggerRouter.log(Logger_1.Logger.debug, req, res);
            return next();
        });
    }
}
exports.LoggerRouter = LoggerRouter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RenderingMWs_1 = require("../middlewares/RenderingMWs");
const Error_1 = require("../../common/entities/Error");
const Logger_1 = require("../Logger");
class ErrorRouter {
    static route(app) {
        this.addApiErrorHandler(app);
        this.addGenericHandler(app);
    }
    static addApiErrorHandler(app) {
        app.use('/api/*', RenderingMWs_1.RenderingMWs.renderError);
    }
    static addGenericHandler(app) {
        app.use((err, req, res, next) => {
            if (err.name === 'UnauthorizedError') {
                // jwt authentication error
                res.status(401);
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.NOT_AUTHENTICATED, 'Invalid token'));
            }
            if (err.name === 'ForbiddenError' && err.code === 'EBADCSRFTOKEN') {
                // jwt authentication error
                res.status(401);
                return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.NOT_AUTHENTICATED, 'Invalid CSRF token', err, req));
            }
            console.log(err);
            // Flush out the stack to the console
            Logger_1.Logger.error('Unexpected error:');
            console.error(err);
            return next(new Error_1.ErrorDTO(Error_1.ErrorCodes.SERVER_ERROR, 'Unknown server side error', err, req));
        }, RenderingMWs_1.RenderingMWs.renderError);
    }
}
exports.ErrorRouter = ErrorRouter;

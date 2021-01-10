"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const Config_1 = require("../common/config/private/Config");
const PrivateConfig_1 = require("../common/config/private/PrivateConfig");
const forcedDebug = process.env.NODE_ENV === 'debug';
if (forcedDebug === true) {
    console.log('NODE_ENV environmental variable is set to debug, forcing all logs to print');
}
exports.winstonSettings = {
    transports: [
        new winston.transports.Console({
            level: forcedDebug === true ? PrivateConfig_1.ServerConfig.LogLevel[PrivateConfig_1.ServerConfig.LogLevel.silly] : PrivateConfig_1.ServerConfig.LogLevel[Config_1.Config.Server.Log.level],
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: function () {
                return (new Date()).toLocaleString();
            },
            label: 'innerLabel',
            formatter: (options) => {
                // Return string will be passed to logger.
                return options.timestamp() + '[' + winston['config']['colorize'](options.level, options.level.toUpperCase()) + '] ' +
                    (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            },
            debugStdout: true
        })
    ],
    exitOnError: false
};
exports.Logger = new winston.Logger(exports.winstonSettings);

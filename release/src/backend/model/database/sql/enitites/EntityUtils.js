"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../../../../common/config/private/Config");
const PrivateConfig_1 = require("../../../../../common/config/private/PrivateConfig");
class ColumnCharsetCS {
    get charset() {
        return Config_1.Config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.mysql ? 'utf8' : 'utf8';
    }
    get collation() {
        return Config_1.Config.Server.Database.type === PrivateConfig_1.ServerConfig.DatabaseType.mysql ? 'utf8_bin' : null;
    }
}
exports.ColumnCharsetCS = ColumnCharsetCS;
exports.columnCharsetCS = new ColumnCharsetCS();

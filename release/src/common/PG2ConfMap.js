"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SortingMethods_1 = require("./entities/SortingMethods");
/**
 * This contains the action of the supported list of *.pg2conf files.
 * These files are passed down to the client as metaFiles (like photos and directories)
 */
exports.PG2ConfMap = {
    sorting: {
        '.order_descending_name.pg2conf': SortingMethods_1.SortingMethods.descName,
        '.order_ascending_name.pg2conf': SortingMethods_1.SortingMethods.ascName,
        '.order_descending_date.pg2conf': SortingMethods_1.SortingMethods.descDate,
        '.order_ascending_date.pg2conf': SortingMethods_1.SortingMethods.ascDate,
        '.order_random.pg2conf': SortingMethods_1.SortingMethods.random
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cluster = require("cluster");
if (cluster.isMaster) {
    const Server = require('./server').Server;
    // tslint:disable-next-line:no-unused-expression
    new Server();
}
else {
    const Worker = require('./model/threading/Worker').Worker;
    Worker.process();
}

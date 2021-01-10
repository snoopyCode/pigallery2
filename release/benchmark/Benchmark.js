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
const ConentWrapper_1 = require("../src/common/entities/ConentWrapper");
const Utils_1 = require("../src/common/Utils");
const Message_1 = require("../src/common/entities/Message");
/**
 * This class converts PiGallery2 Routers to benchamrkable steps to the Benchmark class
 */
class BMExpressApp {
    constructor(benchmark) {
        this.benchmark = benchmark;
    }
    get(match, ...functions) {
        functions.forEach(f => {
            this.benchmark.addAStep({
                name: this.camelToSpaceSeparated(f.name),
                fn: (request) => this.nextToPromise(f, request)
            });
        });
    }
    camelToSpaceSeparated(text) {
        const result = (text.replace(/([A-Z])/g, ' $1')).toLocaleLowerCase();
        return result.charAt(0).toUpperCase() + result.slice(1);
    }
    nextToPromise(fn, request) {
        return new Promise((resolve, reject) => {
            const response = {
                header: () => {
                },
                json: (data) => {
                    resolve(data);
                }
            };
            fn(request, response, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(request.resultPipe);
            });
        });
    }
}
class Benchmark {
    constructor(name, request = {}, beforeEach, afterEach) {
        this.steps = [];
        this.name = name;
        this.request = request;
        this.beforeEach = beforeEach;
        this.afterEach = afterEach;
        this.bmExpressApp = new BMExpressApp(this);
    }
    get BmExpressApp() {
        return this.bmExpressApp;
    }
    run(RUNS) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Running benchmark: ' + this.name);
            const scanned = yield this.scanSteps();
            const start = process.hrtime();
            let skip = 0;
            const stepTimer = new Array(this.steps.length).fill(0);
            for (let i = 0; i < RUNS; i++) {
                if (this.beforeEach) {
                    const startSkip = process.hrtime();
                    yield this.beforeEach();
                    const endSkip = process.hrtime(startSkip);
                    skip += (endSkip[0] * 1000 + endSkip[1] / 1000000);
                }
                yield this.runOneRound(stepTimer);
                if (this.afterEach) {
                    const startSkip = process.hrtime();
                    yield this.afterEach();
                    const endSkip = process.hrtime(startSkip);
                    skip += (endSkip[0] * 1000 + endSkip[1] / 1000000);
                }
            }
            const end = process.hrtime(start);
            const duration = (end[0] * 1000 + end[1] / 1000000 - skip) / RUNS;
            const ret = this.outputToBMResult(this.name, scanned[scanned.length - 1]);
            ret.duration = duration;
            ret.subBenchmarks = scanned.map((o, i) => {
                const stepBm = this.outputToBMResult(this.steps[i].name, o);
                stepBm.duration = stepTimer[i] / RUNS;
                return stepBm;
            });
            return ret;
        });
    }
    outputToBMResult(name, output) {
        if (output) {
            if (Array.isArray(output)) {
                return {
                    name: name,
                    duration: null,
                    items: output.length,
                };
            }
            if (output instanceof ConentWrapper_1.ContentWrapper) {
                return {
                    name: name,
                    duration: null,
                    contentWrapper: output
                };
            }
            if (output instanceof Message_1.Message) {
                const msg = output.result;
                if (Array.isArray(msg)) {
                    return {
                        name: name,
                        duration: null,
                        items: msg.length,
                    };
                }
                if (msg instanceof ConentWrapper_1.ContentWrapper) {
                    return {
                        name: name,
                        duration: null,
                        contentWrapper: msg
                    };
                }
            }
        }
        return {
            name: name,
            duration: null
        };
    }
    scanSteps() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = Utils_1.Utils.clone(this.request);
            const stepOutput = new Array(this.steps.length);
            for (let j = 0; j < this.steps.length; ++j) {
                if (this.beforeEach) {
                    yield this.beforeEach();
                }
                for (let i = 0; i <= j; ++i) {
                    stepOutput[j] = yield this.steps[i].fn(request);
                }
                if (this.afterEach) {
                    yield this.afterEach();
                }
            }
            return stepOutput;
        });
    }
    runOneRound(stepTimer) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = Utils_1.Utils.clone(this.request);
            for (let i = 0; i < this.steps.length; ++i) {
                const start = process.hrtime();
                yield this.steps[i].fn(request);
                const end = process.hrtime(start);
                stepTimer[i] += (end[0] * 1000 + end[1] / 1000000);
            }
            return stepTimer;
        });
    }
    addAStep(step) {
        this.steps.push(step);
    }
}
exports.Benchmark = Benchmark;

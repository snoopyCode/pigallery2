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
const Config_1 = require("../src/common/config/private/Config");
const ProjectPath_1 = require("../src/backend/ProjectPath");
const BenchmarkRunner_1 = require("./BenchmarkRunner");
const Utils_1 = require("../src/common/Utils");
const BMConfig_1 = require("./BMConfig");
Config_1.Config.Server.Media.folder = BMConfig_1.BMConfig.path;
ProjectPath_1.ProjectPath.reset();
const RUNS = BMConfig_1.BMConfig.RUNS;
let resultsText = '';
const printLine = (text) => {
    resultsText += text + '\n';
};
const printHeader = (statistic) => __awaiter(this, void 0, void 0, function* () {
    const dt = new Date();
    printLine('## PiGallery2 v' + require('./../package.json').version +
        ', ' + Utils_1.Utils.zeroPrefix(dt.getDate(), 2) +
        '.' + Utils_1.Utils.zeroPrefix(dt.getMonth() + 1, 2) +
        '.' + dt.getFullYear());
    printLine('**System**: ' + BMConfig_1.BMConfig.system);
    printLine('\n**Gallery**: ' + statistic + '\n');
});
const printTableHeader = () => {
    printLine('| Action | Sub action | Average Duration | Result  |');
    printLine('|:------:|:----------:|:----------------:|:-------:|');
};
const printResult = (result, isSubResult = false) => {
    console.log('benchmarked: ' + result.name);
    let details = '-';
    if (result.items) {
        details = 'items: ' + result.items;
    }
    if (result.contentWrapper) {
        if (result.contentWrapper.directory) {
            details = 'media: ' + result.contentWrapper.directory.media.length +
                ', directories: ' + result.contentWrapper.directory.directories.length;
        }
        else {
            details = 'media: ' + result.contentWrapper.searchResult.media.length +
                ', directories: ' + result.contentWrapper.searchResult.directories.length;
        }
    }
    if (isSubResult) {
        printLine('| | ' + result.name + ' | ' + (result.duration).toFixed(1) + ' ms | ' + details + ' |');
    }
    else {
        printLine('| **' + result.name + '** | | **' + (result.duration).toFixed(1) + ' ms** | **' + details + '** |');
    }
    if (result.subBenchmarks && result.subBenchmarks.length > 1) {
        for (let i = 0; i < result.subBenchmarks.length; i++) {
            printResult(result.subBenchmarks[i], true);
        }
    }
};
const run = () => __awaiter(this, void 0, void 0, function* () {
    console.log('Running, RUNS:' + RUNS);
    const start = Date.now();
    const bm = new BenchmarkRunner_1.BenchmarkRunner(RUNS);
    // header
    yield printHeader(yield bm.getStatistic());
    printTableHeader();
    printResult(yield bm.bmScanDirectory());
    printResult(yield bm.bmSaveDirectory());
    printResult(yield bm.bmListDirectory());
    printResult(yield bm.bmListPersons());
    (yield bm.bmAllSearch('a')).forEach(res => printResult(res.result));
    printResult(yield bm.bmInstantSearch('a'));
    printResult(yield bm.bmAutocomplete('a'));
    printLine('*Measurements run ' + RUNS + ' times and an average was calculated.');
    console.log(resultsText);
    console.log('run for : ' + ((Date.now() - start)).toFixed(1) + 'ms');
});
run().then(console.log).catch(console.error);

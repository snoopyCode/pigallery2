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
const Logger_1 = require("../../Logger");
const fs_1 = require("fs");
const FFmpegFactory_1 = require("../FFmpegFactory");
const PrivateConfig_1 = require("../../../common/config/private/PrivateConfig");
var FFmpegPresets = PrivateConfig_1.ServerConfig.FFmpegPresets;
class VideoConverterWorker {
    static convert(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const origPath = input.output.path;
            input.output.path = origPath + '.part';
            yield this._convert(input);
            yield fs_1.promises.rename(input.output.path, origPath);
        });
    }
    static _convert(input) {
        if (this.ffmpeg == null) {
            this.ffmpeg = FFmpegFactory_1.FFmpegFactory.get();
        }
        return new Promise((resolve, reject) => {
            Logger_1.Logger.silly('[FFmpeg] transcoding video: ' + input.videoPath);
            const command = this.ffmpeg(input.videoPath);
            let executedCmd = '';
            command
                .on('start', (cmd) => {
                Logger_1.Logger.silly('[FFmpeg] running:' + cmd);
                executedCmd = cmd;
            })
                .on('end', () => {
                resolve();
            })
                .on('error', (e) => {
                reject('[FFmpeg] ' + e.toString() + ' executed: ' + executedCmd);
            });
            // set video bitrate
            if (input.output.bitRate) {
                command.videoBitrate((input.output.bitRate / 1024) + 'k');
            }
            // set target codec
            command.videoCodec(input.output.codec);
            if (input.output.resolution) {
                command.size('?x' + input.output.resolution);
            }
            // set fps
            if (input.output.fps) {
                command.fps(input.output.fps);
            }
            // set Constant Rate Factor (CRF)
            if (input.output.crf) {
                command.addOption(['-crf ' + input.output.crf]);
            }
            // set preset
            if (input.output.preset) {
                command.addOption(['-preset ' + FFmpegPresets[input.output.preset]]);
            }
            // set any additional commands
            if (input.output.customOptions) {
                command.addOption(input.output.customOptions);
            }
            // set output format to force
            command.format(input.output.format)
                // save to file
                .save(input.output.path);
        });
    }
}
VideoConverterWorker.ffmpeg = FFmpegFactory_1.FFmpegFactory.get();
exports.VideoConverterWorker = VideoConverterWorker;

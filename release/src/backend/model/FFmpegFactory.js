"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FFmpegFactory {
    static get() {
        const ffmpeg = require('fluent-ffmpeg');
        try {
            const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
            ffmpeg.setFfmpegPath(ffmpegPath);
            const ffprobePath = require('@ffprobe-installer/ffprobe').path;
            ffmpeg.setFfprobePath(ffprobePath);
        }
        catch (e) {
        }
        return ffmpeg;
    }
}
exports.FFmpegFactory = FFmpegFactory;

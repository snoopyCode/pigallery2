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
const FFmpegFactory_1 = require("../FFmpegFactory");
class PhotoWorker {
    static render(input) {
        if (input.type === ThumbnailSourceType.Photo) {
            return this.renderFromImage(input);
        }
        if (input.type === ThumbnailSourceType.Video) {
            return this.renderFromVideo(input);
        }
        throw new Error('Unsupported media type to render thumbnail:' + input.type);
    }
    static renderFromImage(input) {
        if (PhotoWorker.imageRenderer === null) {
            PhotoWorker.imageRenderer = ImageRendererFactory.build();
        }
        return PhotoWorker.imageRenderer(input);
    }
    static renderFromVideo(input) {
        if (PhotoWorker.videoRenderer === null) {
            PhotoWorker.videoRenderer = VideoRendererFactory.build();
        }
        return PhotoWorker.videoRenderer(input);
    }
}
PhotoWorker.imageRenderer = null;
PhotoWorker.videoRenderer = null;
exports.PhotoWorker = PhotoWorker;
var ThumbnailSourceType;
(function (ThumbnailSourceType) {
    ThumbnailSourceType[ThumbnailSourceType["Photo"] = 1] = "Photo";
    ThumbnailSourceType[ThumbnailSourceType["Video"] = 2] = "Video";
})(ThumbnailSourceType = exports.ThumbnailSourceType || (exports.ThumbnailSourceType = {}));
class VideoRendererFactory {
    static build() {
        const ffmpeg = FFmpegFactory_1.FFmpegFactory.get();
        const path = require('path');
        return (input) => {
            return new Promise((resolve, reject) => {
                Logger_1.Logger.silly('[FFmpeg] rendering thumbnail: ' + input.mediaPath);
                ffmpeg(input.mediaPath).ffprobe((err, data) => {
                    if (!!err || data === null) {
                        return reject('[FFmpeg] ' + err.toString());
                    }
                    /// console.log(data);
                    let width = null;
                    let height = null;
                    for (let i = 0; i < data.streams.length; i++) {
                        if (data.streams[i].width) {
                            width = data.streams[i].width;
                            height = data.streams[i].height;
                            break;
                        }
                    }
                    if (!width || !height) {
                        return reject('[FFmpeg] Can not read video dimension');
                    }
                    const command = ffmpeg(input.mediaPath);
                    const fileName = path.basename(input.outPath);
                    const folder = path.dirname(input.outPath);
                    let executedCmd = '';
                    command
                        .on('start', (cmd) => {
                        executedCmd = cmd;
                    })
                        .on('end', () => {
                        resolve();
                    })
                        .on('error', (e) => {
                        reject('[FFmpeg] ' + e.toString() + ' executed: ' + executedCmd);
                    })
                        .outputOptions(['-qscale:v 4']);
                    if (input.makeSquare === false) {
                        const newSize = width < height ? Math.min(input.size, width) + 'x?' : '?x' + Math.min(input.size, height);
                        command.takeScreenshots({
                            timemarks: ['10%'], size: newSize, filename: fileName, folder: folder
                        });
                    }
                    else {
                        command.takeScreenshots({
                            timemarks: ['10%'], size: input.size + 'x' + input.size, filename: fileName, folder: folder
                        });
                    }
                });
            });
        };
    }
}
exports.VideoRendererFactory = VideoRendererFactory;
class ImageRendererFactory {
    static build() {
        return ImageRendererFactory.Sharp();
    }
    static Sharp() {
        const sharp = require('sharp');
        sharp.cache(false);
        return (input) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.Logger.silly('[SharpRenderer] rendering photo:' + input.mediaPath + ', size:' + input.size);
            const image = sharp(input.mediaPath, { failOnError: false });
            const metadata = yield image.metadata();
            const kernel = input.qualityPriority === true ? sharp.kernel.lanczos3 : sharp.kernel.nearest;
            if (input.cut) {
                image.extract(input.cut);
            }
            if (input.makeSquare === false) {
                if (metadata.height > metadata.width) {
                    image.resize(Math.min(input.size, metadata.width), null, {
                        kernel: kernel
                    });
                }
                else {
                    image.resize(null, Math.min(input.size, metadata.height), {
                        kernel: kernel
                    });
                }
            }
            else {
                image
                    .resize(input.size, input.size, {
                    kernel: kernel,
                    position: sharp.gravity.centre,
                    fit: 'cover'
                });
            }
            yield image.withMetadata().jpeg().toFile(input.outPath);
        });
    }
}
exports.ImageRendererFactory = ImageRendererFactory;

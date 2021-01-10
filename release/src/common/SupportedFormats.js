"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedFormats = {
    Photos: [
        'gif',
        'jpeg', 'jpg', 'jpe',
        'png',
        'webp',
        'svg'
    ],
    // Browser supported video formats
    // Read more:  https://www.w3schools.com/html/html5_video.asp
    Videos: [
        'mp4',
        'webm',
        'ogv',
        'ogg'
    ],
    MetaFiles: [
        'gpx', 'pg2conf'
    ],
    // These formats need to be transcoded (with the build-in ffmpeg support)
    TranscodeNeed: {
        // based on libvips, all supported formats for sharp: https://github.com/libvips/libvips
        // all supported formats for gm: http://www.graphicsmagick.org/GraphicsMagick.html
        Photos: [],
        Videos: [
            'avi', 'mkv', 'mov', 'wmv', 'flv', 'mts', 'm2ts', 'mpg', '3gp', 'm4v', 'mpeg', 'vob',
            'divx', 'xvid', 'ts'
        ],
    },
    WithDots: {
        Photos: [],
        Videos: [],
        MetaFiles: [],
        TranscodeNeed: {
            Photos: [],
            Videos: [],
        }
    }
};
exports.SupportedFormats.Photos = exports.SupportedFormats.Photos.concat(exports.SupportedFormats.TranscodeNeed.Photos);
exports.SupportedFormats.Videos = exports.SupportedFormats.Videos.concat(exports.SupportedFormats.TranscodeNeed.Videos);
exports.SupportedFormats.WithDots.Photos = exports.SupportedFormats.Photos.map(f => '.' + f);
exports.SupportedFormats.WithDots.Videos = exports.SupportedFormats.Videos.map(f => '.' + f);
exports.SupportedFormats.WithDots.MetaFiles = exports.SupportedFormats.MetaFiles.map(f => '.' + f);
exports.SupportedFormats.WithDots.TranscodeNeed.Photos = exports.SupportedFormats.TranscodeNeed.Photos.map(f => '.' + f);
exports.SupportedFormats.WithDots.TranscodeNeed.Videos = exports.SupportedFormats.TranscodeNeed.Videos.map(f => '.' + f);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SupportedFormats_1 = require("../SupportedFormats");
var MediaDTO;
(function (MediaDTO) {
    MediaDTO.hasPositionData = (media) => {
        return !!media.metadata.positionData &&
            !!(media.metadata.positionData.city ||
                media.metadata.positionData.state ||
                media.metadata.positionData.country ||
                (media.metadata.positionData.GPSData &&
                    media.metadata.positionData.GPSData.altitude &&
                    media.metadata.positionData.GPSData.latitude &&
                    media.metadata.positionData.GPSData.longitude));
    };
    MediaDTO.isPhoto = (media) => {
        return !MediaDTO.isVideo(media);
    };
    MediaDTO.isVideo = (media) => {
        const lower = media.name.toLowerCase();
        for (const ext of SupportedFormats_1.SupportedFormats.WithDots.Videos) {
            if (lower.endsWith(ext)) {
                return true;
            }
        }
        return false;
    };
    MediaDTO.isVideoPath = (path) => {
        const lower = path.toLowerCase();
        for (const ext of SupportedFormats_1.SupportedFormats.WithDots.Videos) {
            if (lower.endsWith(ext)) {
                return true;
            }
        }
        return false;
    };
    MediaDTO.isVideoTranscodingNeeded = (media) => {
        const lower = media.name.toLowerCase();
        for (const ext of SupportedFormats_1.SupportedFormats.WithDots.TranscodeNeed.Videos) {
            if (lower.endsWith(ext)) {
                return true;
            }
        }
        return false;
    };
    MediaDTO.calcAspectRatio = (photo) => {
        return photo.metadata.size.width / photo.metadata.size.height;
    };
})(MediaDTO = exports.MediaDTO || (exports.MediaDTO = {}));

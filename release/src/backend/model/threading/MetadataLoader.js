"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../../../common/config/private/Config");
const Logger_1 = require("../../Logger");
const fs = require("fs");
const image_size_1 = require("image-size");
// @ts-ignore
const ExifReader = require("exifreader");
const ts_exif_parser_1 = require("ts-exif-parser");
const ts_node_iptc_1 = require("ts-node-iptc");
const FFmpegFactory_1 = require("../FFmpegFactory");
const Utils_1 = require("../../../common/Utils");
const LOG_TAG = '[MetadataLoader]';
const ffmpeg = FFmpegFactory_1.FFmpegFactory.get();
class MetadataLoader {
    static loadVideoMetadata(fullPath) {
        return new Promise((resolve) => {
            const metadata = {
                size: {
                    width: 1,
                    height: 1
                },
                bitRate: 0,
                duration: 0,
                creationDate: 0,
                fileSize: 0,
                fps: 0
            };
            try {
                const stat = fs.statSync(fullPath);
                metadata.fileSize = stat.size;
                metadata.creationDate = stat.mtime.getTime();
            }
            catch (err) {
            }
            try {
                ffmpeg(fullPath).ffprobe((err, data) => {
                    if (!!err || data === null || !data.streams[0]) {
                        return resolve(metadata);
                    }
                    try {
                        for (let i = 0; i < data.streams.length; i++) {
                            if (data.streams[i].width) {
                                metadata.size.width = data.streams[i].width;
                                metadata.size.height = data.streams[i].height;
                                if (Utils_1.Utils.isInt32(parseInt(data.streams[i].rotation, 10)) &&
                                    (Math.abs(parseInt(data.streams[i].rotation, 10)) / 90) % 2 === 1) {
                                    // noinspection JSSuspiciousNameCombination
                                    metadata.size.width = data.streams[i].height;
                                    // noinspection JSSuspiciousNameCombination
                                    metadata.size.height = data.streams[i].width;
                                }
                                if (Utils_1.Utils.isInt32(Math.floor(parseFloat(data.streams[i].duration) * 1000))) {
                                    metadata.duration = Math.floor(parseFloat(data.streams[i].duration) * 1000);
                                }
                                if (Utils_1.Utils.isInt32(parseInt(data.streams[i].bit_rate, 10))) {
                                    metadata.bitRate = parseInt(data.streams[i].bit_rate, 10) || null;
                                }
                                if (Utils_1.Utils.isInt32(parseInt(data.streams[i].avg_frame_rate, 10))) {
                                    metadata.fps = parseInt(data.streams[i].avg_frame_rate, 10) || null;
                                }
                                metadata.creationDate = Date.parse(data.streams[i].tags.creation_time) || metadata.creationDate;
                                break;
                            }
                        }
                    }
                    catch (err) {
                    }
                    metadata.creationDate = metadata.creationDate || 0;
                    return resolve(metadata);
                });
            }
            catch (e) {
                return resolve(metadata);
            }
        });
    }
    static loadPhotoMetadata(fullPath) {
        return new Promise((resolve, reject) => {
            const fd = fs.openSync(fullPath, 'r');
            const data = Buffer.allocUnsafe(Config_1.Config.Server.photoMetadataSize);
            fs.read(fd, data, 0, Config_1.Config.Server.photoMetadataSize, 0, (err) => {
                fs.closeSync(fd);
                if (err) {
                    return reject({ file: fullPath, error: err });
                }
                const metadata = {
                    size: { width: 1, height: 1 },
                    orientation: ts_exif_parser_1.OrientationTypes.TOP_LEFT,
                    creationDate: 0,
                    fileSize: 0
                };
                try {
                    try {
                        const stat = fs.statSync(fullPath);
                        metadata.fileSize = stat.size;
                        metadata.creationDate = stat.mtime.getTime();
                    }
                    catch (err) {
                    }
                    try {
                        const exif = ts_exif_parser_1.ExifParserFactory.create(data).parse();
                        if (exif.tags.ISO || exif.tags.Model ||
                            exif.tags.Make || exif.tags.FNumber ||
                            exif.tags.ExposureTime || exif.tags.FocalLength ||
                            exif.tags.LensModel) {
                            metadata.cameraData = {
                                model: exif.tags.Model,
                                make: exif.tags.Make,
                                lens: exif.tags.LensModel
                            };
                            if (Utils_1.Utils.isUInt32(exif.tags.ISO)) {
                                metadata.cameraData.ISO = exif.tags.ISO;
                            }
                            if (Utils_1.Utils.isFloat32(exif.tags.ISO)) {
                                metadata.cameraData.focalLength = exif.tags.FocalLength;
                            }
                            if (Utils_1.Utils.isFloat32(exif.tags.ExposureTime)) {
                                metadata.cameraData.exposure = exif.tags.ExposureTime;
                            }
                            if (Utils_1.Utils.isFloat32(exif.tags.FNumber)) {
                                metadata.cameraData.fStop = exif.tags.FNumber;
                            }
                        }
                        if (!isNaN(exif.tags.GPSLatitude) || exif.tags.GPSLongitude || exif.tags.GPSAltitude) {
                            metadata.positionData = metadata.positionData || {};
                            metadata.positionData.GPSData = {};
                            if (Utils_1.Utils.isFloat32(exif.tags.GPSLongitude)) {
                                metadata.positionData.GPSData.longitude = exif.tags.GPSLongitude;
                            }
                            if (Utils_1.Utils.isFloat32(exif.tags.GPSLatitude)) {
                                metadata.positionData.GPSData.latitude = exif.tags.GPSLatitude;
                            }
                            if (Utils_1.Utils.isInt32(exif.tags.GPSAltitude)) {
                                metadata.positionData.GPSData.altitude = exif.tags.GPSAltitude;
                            }
                        }
                        if (exif.tags.CreateDate || exif.tags.DateTimeOriginal || exif.tags.ModifyDate) {
                            metadata.creationDate = (exif.tags.DateTimeOriginal || exif.tags.CreateDate || exif.tags.ModifyDate) * 1000;
                        }
                        if (exif.tags.Orientation) {
                            metadata.orientation = exif.tags.Orientation;
                        }
                        if (exif.imageSize) {
                            metadata.size = { width: exif.imageSize.width, height: exif.imageSize.height };
                        }
                        else if (exif.tags.RelatedImageWidth && exif.tags.RelatedImageHeight) {
                            metadata.size = { width: exif.tags.RelatedImageWidth, height: exif.tags.RelatedImageHeight };
                        }
                        else {
                            const info = image_size_1.imageSize(fullPath);
                            metadata.size = { width: info.width, height: info.height };
                        }
                    }
                    catch (err) {
                        Logger_1.Logger.debug(LOG_TAG, 'Error parsing exif', fullPath, err);
                        try {
                            const info = image_size_1.imageSize(fullPath);
                            metadata.size = { width: info.width, height: info.height };
                        }
                        catch (e) {
                            metadata.size = { width: 1, height: 1 };
                        }
                    }
                    try {
                        const iptcData = ts_node_iptc_1.IptcParser.parse(data);
                        if (iptcData.country_or_primary_location_name) {
                            metadata.positionData = metadata.positionData || {};
                            metadata.positionData.country = iptcData.country_or_primary_location_name.replace(/\0/g, '').trim();
                        }
                        if (iptcData.province_or_state) {
                            metadata.positionData = metadata.positionData || {};
                            metadata.positionData.state = iptcData.province_or_state.replace(/\0/g, '').trim();
                        }
                        if (iptcData.city) {
                            metadata.positionData = metadata.positionData || {};
                            metadata.positionData.city = iptcData.city.replace(/\0/g, '').trim();
                        }
                        if (iptcData.caption) {
                            metadata.caption = iptcData.caption.replace(/\0/g, '').trim();
                        }
                        metadata.keywords = iptcData.keywords || [];
                        metadata.creationDate = (iptcData.date_time ? iptcData.date_time.getTime() : metadata.creationDate);
                    }
                    catch (err) {
                        // Logger.debug(LOG_TAG, 'Error parsing iptc data', fullPath, err);
                    }
                    metadata.creationDate = metadata.creationDate || 0;
                    try {
                        // TODO: clean up the three different exif readers,
                        //  and keep the minimum amount only
                        const exif = ExifReader.load(data);
                        if (exif.Rating) {
                            metadata.rating = parseInt(exif.Rating.value, 10);
                        }
                        if (Config_1.Config.Client.Faces.enabled) {
                            const faces = [];
                            if (exif.Regions && exif.Regions.value.RegionList && exif.Regions.value.RegionList.value) {
                                for (let i = 0; i < exif.Regions.value.RegionList.value.length; i++) {
                                    let type, name, box;
                                    const regionRoot = exif.Regions.value.RegionList.value[i];
                                    const createFaceBox = (w, h, x, y) => {
                                        return {
                                            width: Math.round(parseFloat(w) * metadata.size.width),
                                            height: Math.round(parseFloat(h) * metadata.size.height),
                                            left: Math.round(parseFloat(x) * metadata.size.width),
                                            top: Math.round(parseFloat(y) * metadata.size.height)
                                        };
                                    };
                                    /* Adobe Lightroom based face region structure*/
                                    if (regionRoot.value &&
                                        regionRoot.value['rdf:Description'] &&
                                        regionRoot.value['rdf:Description'].value &&
                                        regionRoot.value['rdf:Description'].value['mwg-rs:Area']) {
                                        const region = regionRoot.value['rdf:Description'];
                                        const regionBox = region.value['mwg-rs:Area'].attributes;
                                        name = region.attributes['mwg-rs:Name'];
                                        type = region.attributes['mwg-rs:Type'];
                                        box = createFaceBox(regionBox['stArea:w'], regionBox['stArea:h'], regionBox['stArea:x'], regionBox['stArea:y']);
                                        /* Load exiftool edited face region structure, see github issue #191 */
                                    }
                                    else if (regionRoot.Area && regionRoot.Name && regionRoot.Type) {
                                        const regionBox = regionRoot.Area.value;
                                        name = regionRoot.Name.value;
                                        type = regionRoot.Type.value;
                                        box = createFaceBox(regionBox.w.value, regionBox.h.value, regionBox.x.value, regionBox.y.value);
                                    }
                                    if (type !== 'Face' || !name) {
                                        continue;
                                    }
                                    // convert center base box to corner based box
                                    box.left = Math.max(0, box.left - box.width / 2);
                                    box.top = Math.max(0, box.top - box.height / 2);
                                    faces.push({ name: name, box: box });
                                }
                            }
                            if (Config_1.Config.Client.Faces.keywordsToPersons && faces.length > 0) {
                                metadata.faces = faces; // save faces
                                // remove faces from keywords
                                metadata.faces.forEach(f => {
                                    const index = metadata.keywords.indexOf(f.name);
                                    if (index !== -1) {
                                        metadata.keywords.splice(index, 1);
                                    }
                                });
                            }
                        }
                    }
                    catch (err) {
                    }
                    return resolve(metadata);
                }
                catch (err) {
                    return reject({ file: fullPath, error: err });
                }
            });
        });
    }
}
exports.MetadataLoader = MetadataLoader;

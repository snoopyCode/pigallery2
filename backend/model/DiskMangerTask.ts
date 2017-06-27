///<reference path="exif.d.ts"/>
import {DirectoryDTO} from "../../common/entities/DirectoryDTO";
import {CameraMetadata, GPSMetadata, ImageSize, PhotoDTO, PhotoMetadata} from "../../common/entities/PhotoDTO";
import {Logger} from "../Logger";

const LOG_TAG = "[DiskManagerTask]";

export const diskManagerTask = (input: DiskManagerTask.PoolInput, done) => {
    const fs = require("fs");
    const path = require("path");
    const mime = require("mime");
    const iptc = require("node-iptc");
    const exif_parser = require("exif-parser");


    let isImage = (fullPath: string) => {
      let imageMimeTypes = [
        'image/bmp',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/pjpeg',
        'image/tiff',
        'image/webp',
        'image/x-tiff',
        'image/x-windows-bmp'
      ];

      let extension = mime.lookup(fullPath);

      return imageMimeTypes.indexOf(extension) !== -1;
    };

    let loadPhotoMetadata = (fullPath: string): Promise<PhotoMetadata> => {
        return new Promise<PhotoMetadata>((resolve: (metadata: PhotoMetadata) => void, reject) => {
            fs.readFile(fullPath, function (err, data) {
              if (err) {
                return reject({file: fullPath, error: err});
              }
              const metadata: PhotoMetadata = <PhotoMetadata>{
                keywords: {},
                cameraData: {},
                positionData: null,
                size: {},
                creationDate: {}
              };

              try {

                try {
                  const exif = exif_parser.create(data).parse();
                  metadata.cameraData = <CameraMetadata> {
                    ISO: exif.tags.ISO,
                    model: exif.tags.Modeol,
                    maker: exif.tags.Make,
                    fStop: exif.tags.FNumber,
                    exposure: exif.tags.ExposureTime,
                    focalLength: exif.tags.FocalLength,
                    lens: exif.tags.LensModel,
                  };
                  if (!isNaN(exif.tags.GPSLatitude) || exif.tags.GPSLongitude || exif.tags.GPSAltitude) {
                    metadata.positionData = metadata.positionData || {};
                    metadata.positionData.GPSData = <GPSMetadata> {
                      latitude: exif.tags.GPSLatitude,
                      longitude: exif.tags.GPSLongitude,
                      altitude: exif.tags.GPSAltitude
                    };
                  }

                  metadata.size = <ImageSize> {width: exif.imageSize.width, height: exif.imageSize.height};
                } catch (err) {
                  Logger.info(LOG_TAG, "Error parsing exif", fullPath);
                  metadata.size = <ImageSize> {width: 1, height: 1};
                }

                try {

                  const iptcData = iptc(data);
                  //Decode characters to UTF8
                  const decode = (s: any) => {
                    for (let a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
                         ((a = s[i][c](0)) & 0x80) &&
                         (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
                           o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
                    );
                    return s.join("");
                  };

                  if (iptcData.country_or_primary_location_name || iptcData.province_or_state || iptcData.city) {
                    metadata.positionData = metadata.positionData || {};
                    metadata.positionData.country = iptcData.country_or_primary_location_name;
                    metadata.positionData.state = iptcData.province_or_state;
                    metadata.positionData.city = iptcData.city;
                  }


                  metadata.keywords = <string[]> (iptcData.keywords || []).map((s: string) => decode(s));
                  metadata.creationDate = <number> iptcData.date_time ? iptcData.date_time.getTime() : 0;
                } catch (err) {
                  Logger.info(LOG_TAG, "Error parsing iptc data", fullPath);
                }


                return resolve(metadata);
              } catch (err) {
                return reject({file: fullPath, error: err});
              }
            });
          }
        );
      }
    ;

    let parseDir = (directoryInfo: {
      relativeDirectoryName: string,
      directoryName: string,
      directoryParent: string,
      absoluteDirectoryName: string
    }, maxPhotos: number = null, photosOnly: boolean = false): Promise<DirectoryDTO> => {
      return new Promise<DirectoryDTO>((resolve, reject) => {
        let promises: Array<Promise<any>> = [];
        let directory = <DirectoryDTO>{
          name: directoryInfo.directoryName,
          path: directoryInfo.directoryParent,
          lastUpdate: Date.now(),
          directories: [],
          photos: []
        };
        fs.readdir(directoryInfo.absoluteDirectoryName, (err, list) => {

          if (err) {
            return reject(err);
          }

          try {
            for (let i = 0; i < list.length; i++) {
              let file = list[i];
              let fullFilePath = path.normalize(path.resolve(directoryInfo.absoluteDirectoryName, file));
              if (photosOnly == false && fs.statSync(fullFilePath).isDirectory()) {
                let promise = parseDir({
                    relativeDirectoryName: path.join(directoryInfo.relativeDirectoryName, path.sep),
                    directoryName: file,
                    directoryParent: path.join(directoryInfo.relativeDirectoryName, path.sep),
                    absoluteDirectoryName: fullFilePath
                  },
                  5, true
                ).then((dir) => {
                  directory.directories.push(dir);
                });
                promises.push(promise);
              } else if (isImage(fullFilePath)) {

                let promise = loadPhotoMetadata(fullFilePath).then((photoMetadata) => {
                  directory.photos.push(<PhotoDTO>{
                    name: file,
                    directory: null,
                    metadata: photoMetadata
                  });
                });
                promises.push(promise);

                if (maxPhotos != null && promises.length > maxPhotos) {
                  break;
                }
              }
            }

            Promise.all(promises).then(() => {
              return resolve(directory);
            }).catch((err) => {
              return reject({directoryInfo: directoryInfo, error: err});
            });
          } catch (err) {
            return reject({directoryInfo: directoryInfo, error: err});
          }

        });

      });
    };


    parseDir(input).then((dir) => {
      done(null, dir);
    }).catch((err) => {
      done(err, null);
    });

  }
;


export module DiskManagerTask {

  export  interface PoolInput {
    relativeDirectoryName: string;
    directoryName: string;
    directoryParent: string;
    absoluteDirectoryName: string;
  }

}
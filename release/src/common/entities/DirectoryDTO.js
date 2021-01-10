"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DirectoryDTO;
(function (DirectoryDTO) {
    DirectoryDTO.addReferences = (dir) => {
        dir.media.forEach((media) => {
            media.directory = dir;
        });
        if (dir.metaFile) {
            dir.metaFile.forEach((file) => {
                file.directory = dir;
            });
        }
        if (dir.directories) {
            dir.directories.forEach((directory) => {
                DirectoryDTO.addReferences(directory);
                directory.parent = dir;
            });
        }
    };
    DirectoryDTO.removeReferences = (dir) => {
        if (dir.media) {
            dir.media.forEach((media) => {
                media.directory = null;
            });
        }
        if (dir.metaFile) {
            dir.metaFile.forEach((file) => {
                file.directory = null;
            });
        }
        if (dir.directories) {
            dir.directories.forEach((directory) => {
                DirectoryDTO.removeReferences(directory);
                directory.parent = null;
            });
        }
    };
})(DirectoryDTO = exports.DirectoryDTO || (exports.DirectoryDTO = {}));

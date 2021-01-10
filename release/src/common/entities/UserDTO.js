"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
var UserRoles;
(function (UserRoles) {
    UserRoles[UserRoles["LimitedGuest"] = 1] = "LimitedGuest";
    UserRoles[UserRoles["Guest"] = 2] = "Guest";
    UserRoles[UserRoles["User"] = 3] = "User";
    UserRoles[UserRoles["Admin"] = 4] = "Admin";
    UserRoles[UserRoles["Developer"] = 5] = "Developer";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
var UserDTO;
(function (UserDTO) {
    UserDTO.isDirectoryPathAvailable = (path, permissions) => {
        if (permissions == null) {
            return true;
        }
        permissions = permissions.map(p => Utils_1.Utils.canonizePath(p));
        path = Utils_1.Utils.canonizePath(path);
        if (permissions.length === 0 || permissions[0] === '/*') {
            return true;
        }
        for (let i = 0; i < permissions.length; i++) {
            let permission = permissions[i];
            if (permissions[i] === '/*') {
                return true;
            }
            if (permission[permission.length - 1] === '*') {
                permission = permission.slice(0, -1);
                if (path.startsWith(permission) && (!path[permission.length] || path[permission.length] === '/')) {
                    return true;
                }
            }
            else if (path === permission) {
                return true;
            }
            else if (path === '.' && permission === '/') {
                return true;
            }
        }
        return false;
    };
    UserDTO.isDirectoryAvailable = (directory, permissions) => {
        return UserDTO.isDirectoryPathAvailable(Utils_1.Utils.concatUrls(directory.path, directory.name), permissions);
    };
})(UserDTO = exports.UserDTO || (exports.UserDTO = {}));

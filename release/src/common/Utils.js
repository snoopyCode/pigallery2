"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static GUID() {
        const s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + s4();
    }
    static chunkArrays(arr, chunkSize) {
        const R = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            R.push(arr.slice(i, i + chunkSize));
        }
        return R;
    }
    static wait(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }
    static removeNullOrEmptyObj(obj) {
        if (typeof obj !== 'object' || obj == null) {
            return obj;
        }
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (obj[key] !== null && typeof obj[key] === 'object') {
                if (Utils.removeNullOrEmptyObj(obj[key])) {
                    if (Object.keys(obj[key]).length === 0) {
                        delete obj[key];
                    }
                }
            }
            else if (obj[key] === null) {
                delete obj[key];
            }
        }
        return obj;
    }
    static clone(object) {
        return JSON.parse(JSON.stringify(object));
    }
    static zeroPrefix(value, length) {
        const ret = '00000' + value;
        return ret.substr(ret.length - length);
    }
    static equalsFilter(object, filter) {
        if (typeof filter !== 'object' || filter == null) {
            return object === filter;
        }
        if (!object) {
            return false;
        }
        if (Array.isArray(object) && object.length !== filter.length) {
            return false;
        }
        const keys = Object.keys(filter);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (typeof filter[key] === 'object') {
                if (Utils.equalsFilter(object[key], filter[key]) === false) {
                    return false;
                }
            }
            else if (object[key] !== filter[key]) {
                return false;
            }
        }
        return true;
    }
    static renderDataSize(size) {
        const postFixes = ['B', 'KB', 'MB', 'GB', 'TB'];
        let index = 0;
        while (size > 1000 && index < postFixes.length - 1) {
            size /= 1000;
            index++;
        }
        return size.toFixed(2) + postFixes[index];
    }
    /**
     *
     * @param from
     * @param to inclusive
     * @returns {Array}
     */
    static createRange(from, to) {
        const arr = new Array(to - from + 1);
        let c = to - from + 1;
        while (c--) {
            arr[c] = to--;
        }
        return arr;
    }
    static canonizePath(path) {
        return path
            .replace(new RegExp('\\\\', 'g'), '/')
            .replace(new RegExp('/+', 'g'), '/');
    }
    static concatUrls(...args) {
        let url = '';
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '' || typeof args[i] === 'undefined') {
                continue;
            }
            const part = args[i].replace(new RegExp('\\\\', 'g'), '/');
            if (part === '/' || part === './') {
                continue;
            }
            url += part + '/';
        }
        url = url.replace(new RegExp('/+', 'g'), '/');
        if (url.trim() === '') {
            url = './';
        }
        return url.substring(0, url.length - 1);
    }
    static updateKeys(targetObject, sourceObject) {
        Object.keys(sourceObject).forEach((key) => {
            if (typeof targetObject[key] === 'undefined') {
                return;
            }
            if (typeof targetObject[key] === 'object') {
                Utils.updateKeys(targetObject[key], sourceObject[key]);
            }
            else {
                targetObject[key] = sourceObject[key];
            }
        });
    }
    static setKeys(targetObject, sourceObject) {
        Object.keys(sourceObject).forEach((key) => {
            if (typeof targetObject[key] === 'object') {
                Utils.setKeys(targetObject[key], sourceObject[key]);
            }
            else {
                targetObject[key] = sourceObject[key];
            }
        });
    }
    static setKeysForced(targetObject, sourceObject) {
        Object.keys(sourceObject).forEach((key) => {
            if (typeof sourceObject[key] === 'object') {
                if (typeof targetObject[key] === 'undefined') {
                    targetObject[key] = {};
                }
                Utils.setKeysForced(targetObject[key], sourceObject[key]);
            }
            else {
                targetObject[key] = sourceObject[key];
            }
        });
    }
    static enumToArray(EnumType) {
        const arr = [];
        for (const enumMember in EnumType) {
            if (!EnumType.hasOwnProperty(enumMember)) {
                continue;
            }
            const key = parseInt(enumMember, 10);
            if (key >= 0) {
                arr.push({ key: key, value: EnumType[enumMember] });
            }
        }
        return arr;
    }
    static findClosest(number, arr) {
        let curr = arr[0];
        let diff = Math.abs(number - curr);
        arr.forEach((value) => {
            const newDiff = Math.abs(number - value);
            if (newDiff < diff) {
                diff = newDiff;
                curr = value;
            }
        });
        return curr;
    }
    static findClosestinSorted(number, arr) {
        let curr = arr[0];
        let diff = Math.abs(number - curr);
        for (let i = 0; i < arr.length; ++i) {
            const newDiff = Math.abs(number - arr[i]);
            if (newDiff > diff) {
                break;
            }
            diff = newDiff;
            curr = arr[i];
        }
        return curr;
    }
    static isUInt32(value, max = 4294967295) {
        return !isNaN(value) && value >= 0 && value <= max;
    }
    static isInt32(value) {
        return !isNaN(value) && value >= -2147483648 && value <= 2147483647;
    }
    static isFloat32(value) {
        const E = Math.pow(10, 38);
        const nE = Math.pow(10, -38);
        return !isNaN(value) && ((value >= -3.402823466 * E && value <= -1.175494351 * nE) ||
            (value <= 3.402823466 * E && value >= 1.175494351 * nE));
    }
}
exports.Utils = Utils;

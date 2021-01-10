"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event2Args {
    constructor() {
        this.handlers = [];
    }
    on(handler) {
        this.handlers.push(handler);
    }
    off(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }
    allOff() {
        this.handlers = [];
    }
    trigger(data, data2) {
        if (this.handlers) {
            this.handlers.slice(0).forEach(h => h(data, data2));
        }
    }
}
exports.Event2Args = Event2Args;

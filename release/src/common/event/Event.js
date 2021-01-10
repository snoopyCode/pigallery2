"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor() {
        this.handlers = [];
        this.singleHandlers = [];
    }
    on(handler) {
        if (typeof (handler) !== 'function') {
            throw new Error('Event::on: Handler is not a function');
        }
        this.handlers.push(handler);
    }
    once(handler) {
        if (typeof (handler) !== 'function') {
            throw new Error('Event::once: Handler is not a function');
        }
        this.singleHandlers.push(handler);
    }
    wait() {
        return new Promise((resolve) => {
            this.once(() => {
                resolve();
            });
        });
    }
    off(handler) {
        this.handlers = this.handlers.filter(h => h !== handler);
        this.singleHandlers = this.singleHandlers.filter(h => h !== handler);
    }
    allOff() {
        this.handlers = [];
        this.singleHandlers = [];
    }
    trigger(data) {
        if (this.handlers) {
            this.handlers.slice(0).forEach(h => h(data));
        }
        if (this.singleHandlers) {
            this.singleHandlers.slice(0).forEach(h => h(data));
            this.singleHandlers = [];
        }
    }
    hasListener() {
        return this.handlers.length !== 0 || this.singleHandlers.length !== 0;
    }
}
exports.Event = Event;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventLimit {
    constructor() {
        this.lastTriggerValue = null;
        this.handlers = [];
        this.trigger = (data) => {
            if (this.handlers) {
                this.handlers.slice(0).forEach(h => {
                    if (h.limit <= data && (h.lastTriggerValue < h.limit || h.lastTriggerValue == null)) {
                        h.fire(data);
                    }
                    h.lastTriggerValue = data;
                });
                this.handlers = this.handlers.filter(h => h.isValid());
            }
            this.lastTriggerValue = data;
        };
    }
    on(limit, handler) {
        this.handlers.push(new EventLimitHandler(limit, handler));
        if (this.lastTriggerValue != null) {
            this.trigger(this.lastTriggerValue);
        }
    }
    onSingle(limit, handler) {
        this.handlers.push(new SingleFireEventLimitHandler(limit, handler));
        if (this.lastTriggerValue != null) {
            this.trigger(this.lastTriggerValue);
        }
    }
    off(limit, handler) {
        this.handlers = this.handlers.filter(h => h.handler !== handler && h.limit !== limit);
    }
    allOff() {
        this.handlers = [];
    }
}
exports.EventLimit = EventLimit;
class EventLimitHandler {
    constructor(limit, handler) {
        this.limit = limit;
        this.handler = handler;
        this.lastTriggerValue = null;
    }
    fire(data) {
        this.handler(data);
    }
    isValid() {
        return true;
    }
}
class SingleFireEventLimitHandler extends EventLimitHandler {
    constructor(limit, handler) {
        super(limit, handler);
        this.limit = limit;
        this.handler = handler;
        this.fired = false;
    }
    fire(data) {
        if (this.fired === false) {
            this.handler(data);
        }
        this.fired = true;
    }
    isValid() {
        return this.fired === false;
    }
}

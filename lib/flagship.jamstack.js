(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./src/api/BatchingCachingStrategyAbstract.ts":
/*!****************************************************!*\
  !*** ./src/api/BatchingCachingStrategyAbstract.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LOOKUP_HITS_JSON_OBJECT_ERROR": () => (/* binding */ LOOKUP_HITS_JSON_OBJECT_ERROR),
/* harmony export */   "LOOKUP_VISITOR_JSON_OBJECT_ERROR": () => (/* binding */ LOOKUP_VISITOR_JSON_OBJECT_ERROR),
/* harmony export */   "BatchingCachingStrategyAbstract": () => (/* binding */ BatchingCachingStrategyAbstract)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");


const LOOKUP_HITS_JSON_OBJECT_ERROR = 'JSON DATA must fit the type HitCacheDTO';
const LOOKUP_VISITOR_JSON_OBJECT_ERROR = 'JSON DATA must fit the type VisitorCacheDTO';
class BatchingCachingStrategyAbstract {
    _config;
    _hitsPoolQueue;
    _httpClient;
    get config() {
        return this._config;
    }
    constructor(config, httpClient, hitsPoolQueue) {
        this._config = config;
        this._hitsPoolQueue = hitsPoolQueue;
        this._httpClient = httpClient;
    }
    async cacheHit(hits) {
        try {
            const hitCacheImplementation = this.config.hitCacheImplementation;
            if (this.config.disableCache || !hitCacheImplementation || typeof hitCacheImplementation.cacheHit !== 'function') {
                return;
            }
            const data = {};
            hits.forEach((item, key) => {
                const hitData = {
                    version: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_CACHE_VERSION,
                    data: {
                        visitorId: item.visitorId,
                        anonymousId: item.anonymousId,
                        type: item.type,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        content: item.toObject(),
                        time: Date.now()
                    }
                };
                data[key] = hitData;
            });
            await hitCacheImplementation.cacheHit(data);
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_DATA_CACHED, JSON.stringify(data)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_CACHE_HIT);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, error.message || error, _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_CACHE_HIT);
        }
    }
    async flushHits(hitKeys) {
        try {
            const hitCacheImplementation = this.config.hitCacheImplementation;
            if (this.config.disableCache || !hitCacheImplementation || typeof hitCacheImplementation.flushHits !== 'function') {
                return;
            }
            await hitCacheImplementation.flushHits(hitKeys);
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_DATA_FLUSHED, JSON.stringify(hitKeys)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_FLUSH_HIT);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, error.message || error, _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_FLUSH_HIT);
        }
    }
}


/***/ }),

/***/ "./src/api/BatchingContinuousCachingStrategy.ts":
/*!******************************************************!*\
  !*** ./src/api/BatchingContinuousCachingStrategy.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BatchingContinuousCachingStrategy": () => (/* binding */ BatchingContinuousCachingStrategy)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _hit_Batch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hit/Batch */ "./src/hit/Batch.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _BatchingCachingStrategyAbstract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BatchingCachingStrategyAbstract */ "./src/api/BatchingCachingStrategyAbstract.ts");




class BatchingContinuousCachingStrategy extends _BatchingCachingStrategyAbstract__WEBPACK_IMPORTED_MODULE_3__.BatchingCachingStrategyAbstract {
    async addHit(hit) {
        const hitKey = `${hit.visitorId}:${(0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.uuidV4)()}`;
        hit.key = hitKey;
        await this.addHitWithKey(hitKey, hit);
        if (hit.type === _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT && !hit.visitorConsent) {
            await this.notConsent(hit.visitorId);
        }
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_ADDED_IN_QUEUE, JSON.stringify(hit.toApiKeys())), _enum_index__WEBPACK_IMPORTED_MODULE_0__.ADD_HIT);
    }
    async notConsent(visitorId) {
        const keys = Array.from(this._hitsPoolQueue.keys()).filter(x => x.includes(visitorId));
        const keysToFlush = [];
        keys.forEach(key => {
            const isConsentHit = this._hitsPoolQueue.get(key)?.type === _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT;
            if (isConsentHit) {
                return;
            }
            this._hitsPoolQueue.delete(key);
            keysToFlush.push(key);
        });
        if (!keysToFlush.length) {
            return;
        }
        await this.flushHits(keysToFlush);
    }
    async addHitWithKey(hitKey, hit) {
        this._hitsPoolQueue.set(hitKey, hit);
        await this.cacheHit(new Map().set(hitKey, hit));
    }
    async sendActivate(activateHits) {
        const activateHitKeys = [];
        const url = `${_enum_index__WEBPACK_IMPORTED_MODULE_0__.BASE_API_URL}${_enum_index__WEBPACK_IMPORTED_MODULE_0__.URL_ACTIVATE_MODIFICATION}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const activateHeader = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: this.config.apiKey,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        for (const activateHit of activateHits) {
            this._hitsPoolQueue.delete(activateHit.key);
            const activateBody = activateHit.toApiKeys();
            try {
                await this._httpClient.postAsync(url, {
                    headers: activateHeader,
                    body: activateBody
                });
                activateHitKeys.push(activateHit.key);
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.ACTIVATE_SENT_SUCCESS, JSON.stringify(activateBody)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_ACTIVATE);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                this.addHitWithKey(activateHit.key, activateHit);
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.errorFormat)(error.message || error, {
                    url: url,
                    headers: activateHeader,
                    body: activateBody
                }), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_ACTIVATE);
            }
        }
        if (activateHitKeys.length) {
            await this.flushHits(activateHitKeys);
        }
    }
    async sendBatch() {
        const headers = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: this.config.apiKey,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_ENV_ID]: this.config.envId,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        const batch = new _hit_Batch__WEBPACK_IMPORTED_MODULE_1__.Batch({ hits: [] });
        batch.config = this.config;
        let batchSize = 0;
        let count = 0;
        const activateHits = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, item] of this._hitsPoolQueue) {
            if (item.type === 'ACTIVATE') {
                activateHits.push(item);
                continue;
            }
            count++;
            batchSize = JSON.stringify(batch).length;
            if (batchSize > _enum_index__WEBPACK_IMPORTED_MODULE_0__.BATCH_MAX_SIZE || (this.config.trackingMangerConfig?.batchLength && count > this.config.trackingMangerConfig.batchLength)) {
                break;
            }
            batch.hits.push(item);
        }
        await this.sendActivate(activateHits);
        batch.hits.forEach(hit => {
            this._hitsPoolQueue.delete(hit.key);
        });
        if (!batch.hits.length) {
            return;
        }
        const requestBody = batch.toApiKeys();
        try {
            await this._httpClient.postAsync(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_EVENT_URL, {
                headers,
                body: requestBody
            });
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.BATCH_SENT_SUCCESS, JSON.stringify(requestBody)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_BATCH);
            await this.flushHits(batch.hits.map(item => item.key));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            batch.hits.forEach((hit) => {
                this.addHitWithKey(hit.key, hit);
            });
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.errorFormat)(error.message || error, {
                url: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_EVENT_URL,
                headers,
                body: requestBody
            }), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_BATCH);
        }
    }
}


/***/ }),

/***/ "./src/api/BatchingPeriodicCachingStrategy.ts":
/*!****************************************************!*\
  !*** ./src/api/BatchingPeriodicCachingStrategy.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BatchingPeriodicCachingStrategy": () => (/* binding */ BatchingPeriodicCachingStrategy)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _hit_Batch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hit/Batch */ "./src/hit/Batch.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _BatchingCachingStrategyAbstract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BatchingCachingStrategyAbstract */ "./src/api/BatchingCachingStrategyAbstract.ts");




class BatchingPeriodicCachingStrategy extends _BatchingCachingStrategyAbstract__WEBPACK_IMPORTED_MODULE_3__.BatchingCachingStrategyAbstract {
    async addHit(hit) {
        const hitKey = `${hit.visitorId}:${(0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.uuidV4)()}`;
        hit.key = hitKey;
        this._hitsPoolQueue.set(hitKey, hit);
        if (hit.type === _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT && !hit.visitorConsent) {
            await this.notConsent(hit.visitorId);
        }
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_ADDED_IN_QUEUE, JSON.stringify(hit.toApiKeys())), _enum_index__WEBPACK_IMPORTED_MODULE_0__.ADD_HIT);
    }
    async notConsent(visitorId) {
        const keys = Array.from(this._hitsPoolQueue.keys()).filter(x => x.includes(visitorId));
        const keysToFlush = [];
        keys.forEach(key => {
            const isConsentHit = this._hitsPoolQueue.get(key)?.type === _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT;
            if (isConsentHit) {
                return;
            }
            this._hitsPoolQueue.delete(key);
            keysToFlush.push(key);
        });
        await this.cacheHit(this._hitsPoolQueue);
    }
    async sendActivate(activateHits) {
        const url = `${_enum_index__WEBPACK_IMPORTED_MODULE_0__.BASE_API_URL}${_enum_index__WEBPACK_IMPORTED_MODULE_0__.URL_ACTIVATE_MODIFICATION}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const activateHeader = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: this.config.apiKey,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        for (const activateHit of activateHits) {
            this._hitsPoolQueue.delete(activateHit.key);
            const activateBody = activateHit.toApiKeys();
            try {
                await this._httpClient.postAsync(url, {
                    headers: activateHeader,
                    body: activateBody
                });
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.ACTIVATE_SENT_SUCCESS, JSON.stringify(activateBody)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_ACTIVATE);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                this._hitsPoolQueue.set(activateHit.key, activateHit);
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.errorFormat)(error.message || error, {
                    url: url,
                    headers: activateHeader,
                    body: activateBody
                }), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_ACTIVATE);
            }
        }
    }
    async sendBatch() {
        const headers = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: `${this.config.apiKey}`,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_ENV_ID]: `${this.config.envId}`,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        const batch = new _hit_Batch__WEBPACK_IMPORTED_MODULE_1__.Batch({ hits: [] });
        batch.config = this.config;
        let batchSize = 0;
        let count = 0;
        const activateHits = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, item] of this._hitsPoolQueue) {
            if (item.type === 'ACTIVATE') {
                activateHits.push(item);
                continue;
            }
            count++;
            batchSize = JSON.stringify(batch).length;
            if (batchSize > _enum_index__WEBPACK_IMPORTED_MODULE_0__.BATCH_MAX_SIZE || (this.config.trackingMangerConfig?.batchLength && count > this.config.trackingMangerConfig.batchLength)) {
                break;
            }
            batch.hits.push(item);
        }
        await this.sendActivate(activateHits);
        if (!batch.hits.length) {
            if (activateHits.length) {
                await this.cacheHit(this._hitsPoolQueue);
            }
            return;
        }
        batch.hits.forEach(hit => {
            this._hitsPoolQueue.delete(hit.key);
        });
        const requestBody = batch.toApiKeys();
        try {
            await this._httpClient.postAsync(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_EVENT_URL, {
                headers,
                body: requestBody
            });
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.BATCH_SENT_SUCCESS, JSON.stringify(requestBody)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_BATCH);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            batch.hits.forEach((hit) => {
                this._hitsPoolQueue.set(hit.key, hit);
            });
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.errorFormat)(error.message || error, {
                url: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_EVENT_URL,
                headers,
                body: requestBody
            }), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_BATCH);
        }
        await this.cacheHit(this._hitsPoolQueue);
    }
}


/***/ }),

/***/ "./src/api/NoBatchingContinuousCachingStrategy.ts":
/*!********************************************************!*\
  !*** ./src/api/NoBatchingContinuousCachingStrategy.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoBatchingContinuousCachingStrategy": () => (/* binding */ NoBatchingContinuousCachingStrategy)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _hit_Batch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hit/Batch */ "./src/hit/Batch.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _BatchingCachingStrategyAbstract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BatchingCachingStrategyAbstract */ "./src/api/BatchingCachingStrategyAbstract.ts");




class NoBatchingContinuousCachingStrategy extends _BatchingCachingStrategyAbstract__WEBPACK_IMPORTED_MODULE_3__.BatchingCachingStrategyAbstract {
    cacheHitKeys;
    constructor(config, httpClient, hitsPoolQueue) {
        super(config, httpClient, hitsPoolQueue);
        this.cacheHitKeys = {};
    }
    async addHit(hit) {
        const hitKey = `${hit.visitorId}:${(0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.uuidV4)()}`;
        hit.key = hitKey;
        if (hit.type === _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT && !hit.visitorConsent) {
            await this.notConsent(hit.visitorId);
        }
        await this.cacheHit(new Map().set(hitKey, hit));
        if (hit.type === 'ACTIVATE') {
            await this.sendActivateHit(hit);
            return;
        }
        await this.sendHit(hit);
    }
    async sendHit(hit) {
        const headers = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: `${this.config.apiKey}`,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_ENV_ID]: `${this.config.envId}`,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        const requestBody = hit.toApiKeys();
        try {
            await this._httpClient.postAsync(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_EVENT_URL, {
                headers,
                body: requestBody
            });
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_SENT_SUCCESS, JSON.stringify(requestBody)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_HIT);
            await this.flushHits([hit.key]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            if (hit.type !== _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT) {
                this.cacheHitKeys[hit.key] = hit.key;
            }
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.errorFormat)(error.message || error, {
                url: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_EVENT_URL,
                headers,
                body: requestBody
            }), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_HIT);
        }
    }
    async sendActivateHit(activateHit) {
        const url = `${_enum_index__WEBPACK_IMPORTED_MODULE_0__.BASE_API_URL}${_enum_index__WEBPACK_IMPORTED_MODULE_0__.URL_ACTIVATE_MODIFICATION}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const activateHeader = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: this.config.apiKey,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        const activateBody = activateHit.toApiKeys();
        try {
            await this._httpClient.postAsync(url, {
                headers: activateHeader,
                body: activateBody
            });
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.ACTIVATE_SENT_SUCCESS, JSON.stringify(activateBody)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_ACTIVATE);
            await this.flushHits([activateHit.key]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            this.cacheHitKeys[activateHit.key] = activateHit.key;
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.errorFormat)(error.message || error, {
                url,
                headers: activateHeader,
                body: activateBody
            }), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_ACTIVATE);
        }
    }
    async notConsent(visitorId) {
        const keys = Object.keys(this.cacheHitKeys);
        const hitsPoolQueueKeys = Array.from(this._hitsPoolQueue.keys()).filter(x => x.includes(visitorId));
        const keysToFlush = [];
        hitsPoolQueueKeys.forEach(key => {
            const isConsentHit = this._hitsPoolQueue.get(key)?.type === _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT;
            if (isConsentHit) {
                return;
            }
            this._hitsPoolQueue.delete(key);
            keysToFlush.push(key);
        });
        const mergedKeys = [...keys, ...keysToFlush];
        if (!mergedKeys.length) {
            return;
        }
        await this.flushHits(mergedKeys);
        this.cacheHitKeys = {};
    }
    async sendActivate(activateHits) {
        const activateHitKeys = [];
        const url = `${_enum_index__WEBPACK_IMPORTED_MODULE_0__.BASE_API_URL}${_enum_index__WEBPACK_IMPORTED_MODULE_0__.URL_ACTIVATE_MODIFICATION}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const activateHeader = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: this.config.apiKey,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        for (const activateHit of activateHits) {
            this._hitsPoolQueue.delete(activateHit.key);
            const activateBody = activateHit.toApiKeys();
            try {
                await this._httpClient.postAsync(url, {
                    headers: activateHeader,
                    body: activateBody
                });
                activateHitKeys.push(activateHit.key);
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.ACTIVATE_SENT_SUCCESS, JSON.stringify(activateBody)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_ACTIVATE);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                this._hitsPoolQueue.set(activateHit.key, activateHit);
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.errorFormat)(error.message || error, {
                    url: url,
                    headers: activateHeader,
                    body: activateBody
                }), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_ACTIVATE);
            }
        }
        if (activateHitKeys.length) {
            await this.flushHits(activateHitKeys);
        }
    }
    async sendBatch() {
        const headers = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: `${this.config.apiKey}`,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_ENV_ID]: `${this.config.envId}`,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        const batch = new _hit_Batch__WEBPACK_IMPORTED_MODULE_1__.Batch({ hits: [] });
        batch.config = this.config;
        let batchSize = 0;
        let count = 0;
        const activateHits = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, item] of this._hitsPoolQueue) {
            if (item.type === 'ACTIVATE') {
                activateHits.push(item);
                continue;
            }
            count++;
            batchSize = JSON.stringify(batch).length;
            if (batchSize > _enum_index__WEBPACK_IMPORTED_MODULE_0__.BATCH_MAX_SIZE || (this.config.trackingMangerConfig?.batchLength && count > this.config.trackingMangerConfig.batchLength)) {
                break;
            }
            batch.hits.push(item);
        }
        batch.hits.forEach(hit => {
            this._hitsPoolQueue.delete(hit.key);
        });
        await this.sendActivate(activateHits);
        if (!batch.hits.length) {
            return;
        }
        const requestBody = batch.toApiKeys();
        try {
            await this._httpClient.postAsync(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_EVENT_URL, {
                headers,
                body: requestBody
            });
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.BATCH_SENT_SUCCESS, JSON.stringify(requestBody)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_BATCH);
            await this.flushHits(batch.hits.map(item => item.key));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            batch.hits.forEach((hit) => {
                this._hitsPoolQueue.set(hit.key, hit);
            });
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.errorFormat)(error.message || error, {
                url: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_EVENT_URL,
                headers,
                body: requestBody
            }), _enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_BATCH);
        }
    }
}


/***/ }),

/***/ "./src/api/TrackingManager.ts":
/*!************************************!*\
  !*** ./src/api/TrackingManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TrackingManager": () => (/* binding */ TrackingManager)
/* harmony export */ });
/* harmony import */ var _TrackingManagerAbstract__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TrackingManagerAbstract */ "./src/api/TrackingManagerAbstract.ts");

class TrackingManager extends _TrackingManagerAbstract__WEBPACK_IMPORTED_MODULE_0__.TrackingManagerAbstract {
    async addHit(hit) {
        await this.strategy.addHit(hit);
    }
}


/***/ }),

/***/ "./src/api/TrackingManagerAbstract.ts":
/*!********************************************!*\
  !*** ./src/api/TrackingManagerAbstract.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LOOKUP_HITS_JSON_ERROR": () => (/* binding */ LOOKUP_HITS_JSON_ERROR),
/* harmony export */   "LOOKUP_HITS_JSON_OBJECT_ERROR": () => (/* binding */ LOOKUP_HITS_JSON_OBJECT_ERROR),
/* harmony export */   "TrackingManagerAbstract": () => (/* binding */ TrackingManagerAbstract)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _enum_BatchStrategy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/BatchStrategy */ "./src/enum/BatchStrategy.ts");
/* harmony import */ var _hit_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hit/index */ "./src/hit/index.ts");
/* harmony import */ var _hit_Campaign__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hit/Campaign */ "./src/hit/Campaign.ts");
/* harmony import */ var _hit_Consent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hit/Consent */ "./src/hit/Consent.ts");
/* harmony import */ var _hit_Segment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hit/Segment */ "./src/hit/Segment.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _BatchingContinuousCachingStrategy__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./BatchingContinuousCachingStrategy */ "./src/api/BatchingContinuousCachingStrategy.ts");
/* harmony import */ var _BatchingPeriodicCachingStrategy__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./BatchingPeriodicCachingStrategy */ "./src/api/BatchingPeriodicCachingStrategy.ts");
/* harmony import */ var _NoBatchingContinuousCachingStrategy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./NoBatchingContinuousCachingStrategy */ "./src/api/NoBatchingContinuousCachingStrategy.ts");
/* harmony import */ var _hit_Activate__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../hit/Activate */ "./src/hit/Activate.ts");











const LOOKUP_HITS_JSON_ERROR = 'JSON DATA must be an array of object';
const LOOKUP_HITS_JSON_OBJECT_ERROR = 'JSON DATA must fit the type HitCacheDTO';
class TrackingManagerAbstract {
    _httpClient;
    _config;
    _hitsPoolQueue;
    strategy;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _intervalID;
    _isPooling = false;
    constructor(httpClient, config) {
        this._hitsPoolQueue = new Map();
        this._httpClient = httpClient;
        this._config = config;
        this.lookupHits();
        this.strategy = this.initStrategy();
    }
    initStrategy() {
        let strategy;
        switch (this.config.trackingMangerConfig?.batchStrategy) {
            case _enum_BatchStrategy__WEBPACK_IMPORTED_MODULE_1__.BatchStrategy.PERIODIC_CACHING:
                strategy = new _BatchingPeriodicCachingStrategy__WEBPACK_IMPORTED_MODULE_8__.BatchingPeriodicCachingStrategy(this.config, this.httpClient, this._hitsPoolQueue);
                break;
            case _enum_BatchStrategy__WEBPACK_IMPORTED_MODULE_1__.BatchStrategy.CONTINUOUS_CACHING:
                strategy = new _BatchingContinuousCachingStrategy__WEBPACK_IMPORTED_MODULE_7__.BatchingContinuousCachingStrategy(this.config, this.httpClient, this._hitsPoolQueue);
                break;
            default:
                strategy = new _NoBatchingContinuousCachingStrategy__WEBPACK_IMPORTED_MODULE_9__.NoBatchingContinuousCachingStrategy(this.config, this.httpClient, this._hitsPoolQueue);
                break;
        }
        return strategy;
    }
    get httpClient() {
        return this._httpClient;
    }
    get config() {
        return this._config;
    }
    startBatchingLoop() {
        const timeInterval = (this.config.trackingMangerConfig?.batchIntervals ?? _enum_index__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_TIME_INTERVAL) * 1000;
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.logInfo)(this.config, 'Batching Loop have been started', 'startBatchingLoop');
        this._intervalID = setInterval(() => {
            this.batchingLoop();
        }, timeInterval);
    }
    stopBatchingLoop() {
        clearInterval(this._intervalID);
        this._isPooling = false;
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.logInfo)(this.config, 'Batching Loop have been stopped', 'stopBatchingLoop');
    }
    async batchingLoop() {
        if (this._isPooling) {
            return;
        }
        this._isPooling = true;
        await this.strategy.sendBatch();
        this._isPooling = false;
    }
    checKLookupHitData(item) {
        if (item?.version === 1 && item?.data?.type && item?.data?.content) {
            return true;
        }
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.logError)(this.config, LOOKUP_HITS_JSON_OBJECT_ERROR, _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_LOOKUP_HIT);
        return false;
    }
    async lookupHits() {
        try {
            const hitCacheImplementation = this.config.hitCacheImplementation;
            if (this.config.disableCache || !hitCacheImplementation || typeof hitCacheImplementation.lookupHits !== 'function') {
                return;
            }
            const hitsCache = await hitCacheImplementation.lookupHits();
            if (!hitsCache || !Object.keys(hitsCache).length) {
                return;
            }
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.logDebug)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.HIT_DATA_LOADED, JSON.stringify(hitsCache)), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_LOOKUP_HIT);
            const checkHitTime = (time) => (((Date.now() - time) / 1000) <= _enum_index__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_HIT_CACHE_TIME);
            const wrongHitKeys = [];
            Object.entries(hitsCache).forEach(([key, item]) => {
                if (!this.checKLookupHitData(item) || !checkHitTime(item.data.time)) {
                    wrongHitKeys.push(key);
                    return;
                }
                let hit;
                switch (item.data.type) {
                    case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CAMPAIGN:
                        hit = new _hit_Campaign__WEBPACK_IMPORTED_MODULE_3__.Campaign(item.data.content);
                        break;
                    case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT:
                        hit = new _hit_Consent__WEBPACK_IMPORTED_MODULE_4__.Consent(item.data.content);
                        break;
                    case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.EVENT:
                        hit = new _hit_index__WEBPACK_IMPORTED_MODULE_2__.Event(item.data.content);
                        break;
                    case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.ITEM:
                        hit = new _hit_index__WEBPACK_IMPORTED_MODULE_2__.Item(item.data.content);
                        break;
                    case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.PAGE:
                        hit = new _hit_index__WEBPACK_IMPORTED_MODULE_2__.Page(item.data.content);
                        break;
                    case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.SCREEN:
                        hit = new _hit_index__WEBPACK_IMPORTED_MODULE_2__.Screen(item.data.content);
                        break;
                    case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.SEGMENT:
                        hit = new _hit_Segment__WEBPACK_IMPORTED_MODULE_5__.Segment(item.data.content);
                        break;
                    case 'ACTIVATE':
                        hit = new _hit_Activate__WEBPACK_IMPORTED_MODULE_10__.Activate(item.data.content);
                        break;
                    case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.TRANSACTION:
                        hit = new _hit_index__WEBPACK_IMPORTED_MODULE_2__.Transaction(item.data.content);
                        break;
                    default:
                        return;
                }
                hit.key = key;
                hit.createdAt = item.data.content.createdAt;
                hit.config = this.config;
                this._hitsPoolQueue.set(key, hit);
            });
            if (wrongHitKeys.length) {
                await this.strategy.flushHits(wrongHitKeys);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_6__.logError)(this.config, error.message || error, _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_LOOKUP_HIT);
        }
    }
}


/***/ }),

/***/ "./src/cache/DefaultHitCache.ts":
/*!**************************************!*\
  !*** ./src/cache/DefaultHitCache.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FS_HIT_PREFIX": () => (/* binding */ FS_HIT_PREFIX),
/* harmony export */   "DefaultHitCache": () => (/* binding */ DefaultHitCache)
/* harmony export */ });
const FS_HIT_PREFIX = 'FS_DEFAULT_HIT_CACHE';
class DefaultHitCache {
    cacheHit(hits) {
        const localDatabaseJson = localStorage.getItem(FS_HIT_PREFIX) || '{}';
        const localDatabase = JSON.parse(localDatabaseJson);
        const newLocalDatabase = {
            ...localDatabase,
            ...hits
        };
        localStorage.setItem(FS_HIT_PREFIX, JSON.stringify(newLocalDatabase));
        return Promise.resolve();
    }
    lookupHits() {
        const localDatabaseJson = localStorage.getItem(FS_HIT_PREFIX) || '{}';
        const localDatabase = JSON.parse(localDatabaseJson);
        return Promise.resolve(localDatabase);
    }
    flushHits(hitKeys) {
        const localDatabaseJson = localStorage.getItem(FS_HIT_PREFIX) || '{}';
        const localDatabase = JSON.parse(localDatabaseJson);
        hitKeys.forEach(key => {
            delete localDatabase[key];
        });
        localStorage.setItem(FS_HIT_PREFIX, JSON.stringify(localDatabase));
        return Promise.resolve();
    }
}


/***/ }),

/***/ "./src/cache/DefaultVisitorCache.ts":
/*!******************************************!*\
  !*** ./src/cache/DefaultVisitorCache.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VISITOR_PREFIX": () => (/* binding */ VISITOR_PREFIX),
/* harmony export */   "DefaultVisitorCache": () => (/* binding */ DefaultVisitorCache)
/* harmony export */ });
const VISITOR_PREFIX = 'FS_VISITOR_CACHE_';
class DefaultVisitorCache {
    cacheVisitor(visitorId, data) {
        localStorage.setItem(VISITOR_PREFIX + visitorId, JSON.stringify(data));
        return Promise.resolve();
    }
    lookupVisitor(visitorId) {
        const data = localStorage.getItem(VISITOR_PREFIX + visitorId);
        return Promise.resolve(data ? JSON.parse(data) : null);
    }
    flushVisitor(visitorId) {
        localStorage.removeItem(VISITOR_PREFIX + visitorId);
        return Promise.resolve();
    }
}


/***/ }),

/***/ "./src/config/BucketingConfig.ts":
/*!***************************************!*\
  !*** ./src/config/BucketingConfig.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BucketingConfig": () => (/* binding */ BucketingConfig)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _FlagshipConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FlagshipConfig */ "./src/config/FlagshipConfig.ts");


class BucketingConfig extends _FlagshipConfig__WEBPACK_IMPORTED_MODULE_1__.FlagshipConfig {
    constructor(param) {
        super({ ...param, decisionMode: _FlagshipConfig__WEBPACK_IMPORTED_MODULE_1__.DecisionMode.BUCKETING });
        this.pollingInterval = param?.pollingInterval ?? _enum_index__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_POLLING_INTERVAL;
        this.onBucketingFail = param?.onBucketingFail;
        this.onBucketingSuccess = param?.onBucketingSuccess;
        this.onBucketingUpdated = param?.onBucketingUpdated;
    }
}


/***/ }),

/***/ "./src/config/ConfigManager.ts":
/*!*************************************!*\
  !*** ./src/config/ConfigManager.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConfigManager": () => (/* binding */ ConfigManager)
/* harmony export */ });
class ConfigManager {
    _config;
    _decisionManager;
    _trackingManager;
    constructor(config, decisionManager, trackingManager) {
        this._config = config;
        this._decisionManager = decisionManager;
        this._trackingManager = trackingManager;
    }
    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
    }
    get decisionManager() {
        return this._decisionManager;
    }
    set decisionManager(value) {
        this._decisionManager = value;
    }
    get trackingManager() {
        return this._trackingManager;
    }
    set trackingManager(value) {
        this._trackingManager = value;
    }
}


/***/ }),

/***/ "./src/config/DecisionApiConfig.ts":
/*!*****************************************!*\
  !*** ./src/config/DecisionApiConfig.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DecisionApiConfig": () => (/* binding */ DecisionApiConfig)
/* harmony export */ });
/* harmony import */ var _FlagshipConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FlagshipConfig */ "./src/config/FlagshipConfig.ts");

class DecisionApiConfig extends _FlagshipConfig__WEBPACK_IMPORTED_MODULE_0__.FlagshipConfig {
    constructor(param) {
        super({ ...param, decisionMode: _FlagshipConfig__WEBPACK_IMPORTED_MODULE_0__.DecisionMode.DECISION_API });
    }
}


/***/ }),

/***/ "./src/config/FlagshipConfig.ts":
/*!**************************************!*\
  !*** ./src/config/FlagshipConfig.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DecisionMode": () => (/* binding */ DecisionMode),
/* harmony export */   "statusChangeError": () => (/* binding */ statusChangeError),
/* harmony export */   "FlagshipConfig": () => (/* binding */ FlagshipConfig)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _TrackingManagerConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TrackingManagerConfig */ "./src/config/TrackingManagerConfig.ts");



var DecisionMode;
(function (DecisionMode) {
    /**
     * Flagship SDK mode decision api
     */
    DecisionMode["DECISION_API"] = "API";
    /**
     * Flagship SDK mode bucketing
     */
    DecisionMode["BUCKETING"] = "BUCKETING";
})(DecisionMode || (DecisionMode = {}));
const statusChangeError = 'statusChangedCallback must be a function';
class FlagshipConfig {
    _envId;
    _apiKey;
    _decisionMode;
    _timeout;
    _logLevel;
    _statusChangedCallback;
    _logManager;
    _fetchNow;
    _pollingInterval;
    _onBucketingFail;
    _onBucketingSuccess;
    _onBucketingUpdated;
    _enableClientCache;
    _initialBucketing;
    _decisionApiUrl;
    _activateDeduplicationTime;
    _hitDeduplicationTime;
    _visitorCacheImplementation;
    _hitCacheImplementation;
    _disableCache;
    _trackingMangerConfig;
    _isCloudFlareClient;
    get isCloudFlareClient() {
        return this._isCloudFlareClient;
    }
    set isCloudFlareClient(v) {
        this._isCloudFlareClient = v;
    }
    get trackingMangerConfig() {
        return this._trackingMangerConfig;
    }
    constructor(param) {
        const { envId, apiKey, timeout, logLevel, logManager, statusChangedCallback, fetchNow, decisionMode, enableClientCache, initialBucketing, decisionApiUrl, activateDeduplicationTime, hitDeduplicationTime, visitorCacheImplementation, hitCacheImplementation, disableCache, language, trackingMangerConfig, isCloudFlareClient } = param;
        this.setSdkLanguageName(language);
        if (logManager) {
            this.logManager = logManager;
        }
        this._trackingMangerConfig = new _TrackingManagerConfig__WEBPACK_IMPORTED_MODULE_2__.TrackingManagerConfig(isCloudFlareClient ? { batchStrategy: 3 } : trackingMangerConfig || {});
        this.isCloudFlareClient = isCloudFlareClient;
        this.decisionApiUrl = decisionApiUrl || _enum_index__WEBPACK_IMPORTED_MODULE_0__.BASE_API_URL;
        this._envId = envId;
        this._apiKey = apiKey;
        this.logLevel = logLevel ?? _enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.ALL;
        this.timeout = timeout || _enum_index__WEBPACK_IMPORTED_MODULE_0__.REQUEST_TIME_OUT;
        this.fetchNow = typeof fetchNow === 'undefined' || fetchNow;
        this.enableClientCache = typeof enableClientCache === 'undefined' || enableClientCache;
        this._decisionMode = decisionMode || DecisionMode.DECISION_API;
        this._initialBucketing = initialBucketing;
        this.activateDeduplicationTime = activateDeduplicationTime ?? _enum_index__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_DEDUPLICATION_TIME;
        this.hitDeduplicationTime = hitDeduplicationTime ?? _enum_index__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_DEDUPLICATION_TIME;
        this.disableCache = !!disableCache;
        if (visitorCacheImplementation) {
            this.visitorCacheImplementation = visitorCacheImplementation;
        }
        if (hitCacheImplementation) {
            this.hitCacheImplementation = hitCacheImplementation;
        }
        this.statusChangedCallback = statusChangedCallback;
    }
    setSdkLanguageName(language) {
        switch (language) {
            case 1:
                _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name = 'ReactJS';
                break;
            case 2:
                _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name = 'React-Native';
                break;
            default:
                _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name = (typeof window !== 'undefined' && 'Deno' in window) ? 'Deno' : 'Typescript';
                break;
        }
    }
    get initialBucketing() {
        return this._initialBucketing;
    }
    set initialBucketing(v) {
        this._initialBucketing = v;
    }
    get enableClientCache() {
        return this._enableClientCache;
    }
    set enableClientCache(v) {
        this._enableClientCache = v;
    }
    get onBucketingSuccess() {
        return this._onBucketingSuccess;
    }
    set onBucketingSuccess(v) {
        this._onBucketingSuccess = v;
    }
    get onBucketingFail() {
        return this._onBucketingFail;
    }
    set onBucketingFail(v) {
        this._onBucketingFail = v;
    }
    get onBucketingUpdated() {
        return this._onBucketingUpdated;
    }
    set onBucketingUpdated(v) {
        this._onBucketingUpdated = v;
    }
    set envId(value) {
        this._envId = value;
    }
    get envId() {
        return this._envId;
    }
    set apiKey(value) {
        this._apiKey = value;
    }
    get apiKey() {
        return this._apiKey;
    }
    get decisionMode() {
        return this._decisionMode;
    }
    get timeout() {
        return this._timeout;
    }
    set timeout(value) {
        this._timeout = value;
    }
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(value) {
        this._logLevel = value;
    }
    get fetchNow() {
        return this._fetchNow;
    }
    set fetchNow(v) {
        this._fetchNow = v;
    }
    get pollingInterval() {
        return this._pollingInterval;
    }
    set pollingInterval(v) {
        this._pollingInterval = v;
    }
    get activateDeduplicationTime() {
        return this._activateDeduplicationTime;
    }
    set activateDeduplicationTime(v) {
        if (typeof v !== 'number') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.TYPE_ERROR, 'activateDeduplicationTime', 'number'), 'activateDeduplicationTime');
            return;
        }
        this._activateDeduplicationTime = v;
    }
    get hitDeduplicationTime() {
        return this._hitDeduplicationTime;
    }
    set hitDeduplicationTime(v) {
        if (typeof v !== 'number') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.TYPE_ERROR, 'hitDeduplicationTime', 'number'), 'hitDeduplicationTime');
            return;
        }
        this._hitDeduplicationTime = v;
    }
    get visitorCacheImplementation() {
        return this._visitorCacheImplementation;
    }
    set visitorCacheImplementation(v) {
        this._visitorCacheImplementation = v;
    }
    get hitCacheImplementation() {
        return this._hitCacheImplementation;
    }
    set hitCacheImplementation(v) {
        this._hitCacheImplementation = v;
    }
    get disableCache() {
        return this._disableCache;
    }
    set disableCache(v) {
        this._disableCache = v;
    }
    get statusChangedCallback() {
        return this._statusChangedCallback;
    }
    set statusChangedCallback(fn) {
        if (typeof fn !== 'function') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this, statusChangeError, 'statusChangedCallback');
            return;
        }
        this._statusChangedCallback = fn;
    }
    get logManager() {
        return this._logManager;
    }
    set logManager(value) {
        this._logManager = value;
    }
    get decisionApiUrl() {
        return this._decisionApiUrl;
    }
    set decisionApiUrl(v) {
        if (typeof v !== 'string') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.TYPE_ERROR, 'decisionApiUrl', 'string'), 'decisionApiUrl');
            return;
        }
        this._decisionApiUrl = v;
    }
}


/***/ }),

/***/ "./src/config/TrackingManagerConfig.ts":
/*!*********************************************!*\
  !*** ./src/config/TrackingManagerConfig.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TrackingManagerConfig": () => (/* binding */ TrackingManagerConfig)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");

class TrackingManagerConfig {
    _batchIntervals;
    _batchLength;
    _batchStrategy;
    constructor(param) {
        this._batchIntervals = param?.batchIntervals || _enum_index__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_TIME_INTERVAL;
        this._batchLength = param?.batchLength || _enum_index__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_BATCH_LENGTH;
        this._batchStrategy = param?.batchStrategy || _enum_index__WEBPACK_IMPORTED_MODULE_0__.BatchStrategy.CONTINUOUS_CACHING;
    }
    get batchIntervals() {
        return this._batchIntervals;
    }
    set batchIntervals(v) {
        this._batchIntervals = v;
    }
    get batchLength() {
        return this._batchLength;
    }
    set batchLength(v) {
        this._batchLength = v;
    }
    get batchStrategy() {
        return this._batchStrategy;
    }
}


/***/ }),

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConfigManager": () => (/* reexport safe */ _ConfigManager__WEBPACK_IMPORTED_MODULE_0__.ConfigManager),
/* harmony export */   "DecisionApiConfig": () => (/* reexport safe */ _DecisionApiConfig__WEBPACK_IMPORTED_MODULE_1__.DecisionApiConfig),
/* harmony export */   "BucketingConfig": () => (/* reexport safe */ _BucketingConfig__WEBPACK_IMPORTED_MODULE_2__.BucketingConfig),
/* harmony export */   "DecisionMode": () => (/* reexport safe */ _FlagshipConfig__WEBPACK_IMPORTED_MODULE_3__.DecisionMode),
/* harmony export */   "FlagshipConfig": () => (/* reexport safe */ _FlagshipConfig__WEBPACK_IMPORTED_MODULE_3__.FlagshipConfig)
/* harmony export */ });
/* harmony import */ var _ConfigManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ConfigManager */ "./src/config/ConfigManager.ts");
/* harmony import */ var _DecisionApiConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DecisionApiConfig */ "./src/config/DecisionApiConfig.ts");
/* harmony import */ var _BucketingConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BucketingConfig */ "./src/config/BucketingConfig.ts");
/* harmony import */ var _FlagshipConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FlagshipConfig */ "./src/config/FlagshipConfig.ts");






/***/ }),

/***/ "./src/decision/ApiManager.ts":
/*!************************************!*\
  !*** ./src/decision/ApiManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApiManager": () => (/* binding */ ApiManager)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _DecisionManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DecisionManager */ "./src/decision/DecisionManager.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");



class ApiManager extends _DecisionManager__WEBPACK_IMPORTED_MODULE_1__.DecisionManager {
    async getCampaignsAsync(visitor) {
        const headers = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: `${this.config.apiKey}`,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
        };
        const postData = {
            visitorId: visitor.visitorId,
            anonymousId: visitor.anonymousId,
            trigger_hit: false,
            context: visitor.context
        };
        let url = `${this.config.decisionApiUrl || _enum_index__WEBPACK_IMPORTED_MODULE_0__.BASE_API_URL}${this.config.envId}${_enum_index__WEBPACK_IMPORTED_MODULE_0__.URL_CAMPAIGNS}?${_enum_index__WEBPACK_IMPORTED_MODULE_0__.EXPOSE_ALL_KEYS}=true`;
        if (!visitor.hasConsented) {
            url += `&${_enum_index__WEBPACK_IMPORTED_MODULE_0__.SEND_CONTEXT_EVENT}=false`;
        }
        return this._httpClient.postAsync(url, {
            headers,
            timeout: this.config.timeout,
            body: postData
        })
            .then(data => {
            this.panic = !!data.body.panic;
            let response = null;
            if (data.body.campaigns) {
                response = data.body.campaigns;
            }
            return response;
        })
            .catch(error => {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, error.message || error, _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_GET_CAMPAIGNS);
            return null;
        });
    }
}


/***/ }),

/***/ "./src/decision/BucketingManager.ts":
/*!******************************************!*\
  !*** ./src/decision/BucketingManager.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BucketingManager": () => (/* binding */ BucketingManager)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _hit_Segment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hit/Segment */ "./src/hit/Segment.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _DecisionManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DecisionManager */ "./src/decision/DecisionManager.ts");




class BucketingManager extends _DecisionManager__WEBPACK_IMPORTED_MODULE_3__.DecisionManager {
    _bucketingContent;
    _lastModified;
    _isPooling;
    _murmurHash;
    _isFirstPooling;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _intervalID;
    constructor(httpClient, config, murmurHash) {
        super(httpClient, config);
        this._murmurHash = murmurHash;
        this._isFirstPooling = true;
        if (config.initialBucketing) {
            this._bucketingContent = config.initialBucketing;
        }
    }
    finishLoop(response) {
        if (response.status === 200) {
            this._bucketingContent = response.body;
        }
        if (response.headers && response.headers['last-modified']) {
            const lastModified = response.headers['last-modified'];
            if (this._lastModified !== lastModified && this.config.onBucketingUpdated) {
                this.config.onBucketingUpdated(new Date(lastModified));
            }
            this._lastModified = lastModified;
        }
        if (this._isFirstPooling) {
            this._isFirstPooling = false;
            this.updateFlagshipStatus(_enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus.READY);
        }
        if (typeof this.config.onBucketingSuccess === 'function') {
            this.config.onBucketingSuccess({ status: response.status, payload: this._bucketingContent });
        }
        this._isPooling = false;
    }
    async startPolling() {
        const timeout = this.config.pollingInterval * 1000;
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logInfo)(this.config, 'Bucketing polling starts', 'startPolling');
        await this.polling();
        if (timeout === 0) {
            return;
        }
        this._intervalID = setInterval(() => {
            this.polling();
        }, timeout);
    }
    async polling() {
        if (this._isPooling) {
            return;
        }
        this._isPooling = true;
        if (this._isFirstPooling) {
            this.updateFlagshipStatus(_enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus.POLLING);
        }
        try {
            const url = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.BUCKETING_API_URL, this.config.envId);
            const headers = {
                [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_API_KEY]: `${this.config.apiKey}`,
                [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_CLIENT]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_LANGUAGE.name,
                [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_X_SDK_VERSION]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION,
                [_enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_CONTENT_TYPE]: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HEADER_APPLICATION_JSON
            };
            if (this._lastModified) {
                headers['if-modified-since'] = this._lastModified;
            }
            const response = await this._httpClient.getAsync(url, { headers, timeout: this.config.timeout });
            this.finishLoop(response);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            this._isPooling = false;
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, error, 'startPolling');
            if (this._isFirstPooling) {
                this.updateFlagshipStatus(_enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus.NOT_INITIALIZED);
            }
            if (typeof this.config.onBucketingFail === 'function') {
                this.config.onBucketingFail(new Error(error));
            }
        }
    }
    stopPolling() {
        clearInterval(this._intervalID);
        this._isPooling = false;
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logInfo)(this.config, 'Bucketing polling stopped', 'stopPolling');
    }
    async sendContext(visitor) {
        try {
            if (Object.keys(visitor.context).length <= 3) {
                return;
            }
            const SegmentHit = new _hit_Segment__WEBPACK_IMPORTED_MODULE_1__.Segment({
                sl: visitor.context,
                visitorId: visitor.visitorId,
                anonymousId: visitor.anonymousId
            });
            await visitor.sendHit(SegmentHit);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, error.message || error, 'sendContext');
        }
    }
    async getCampaignsAsync(visitor) {
        if (!this._bucketingContent) {
            return null;
        }
        if (this._bucketingContent.panic) {
            this.panic = true;
            return [];
        }
        this.panic = false;
        if (!this._bucketingContent.campaigns) {
            return null;
        }
        this.sendContext(visitor);
        const visitorCampaigns = [];
        this._bucketingContent.campaigns.forEach(campaign => {
            const currentCampaigns = this.getVisitorCampaigns(campaign.variationGroups, campaign.id, campaign.type, visitor);
            if (currentCampaigns) {
                currentCampaigns.slug = campaign.slug;
                visitorCampaigns.push(currentCampaigns);
            }
        });
        return visitorCampaigns;
    }
    getVisitorCampaigns(variationGroups, campaignId, campaignType, visitor) {
        for (const variationGroup of variationGroups) {
            const check = this.isMatchTargeting(variationGroup, visitor);
            if (check) {
                const variation = this.getVariation(variationGroup, visitor);
                if (!variation) {
                    return null;
                }
                return {
                    id: campaignId,
                    variation: variation,
                    variationGroupId: variationGroup.id,
                    type: campaignType
                };
            }
        }
        return null;
    }
    getVariation(variationGroup, visitor) {
        const hash = this._murmurHash.murmurHash3Int32(variationGroup.id + visitor.visitorId);
        const hashAllocation = hash % 100;
        let totalAllocation = 0;
        for (const variation of variationGroup.variations) {
            const assignmentsHistory = visitor.visitorCache?.data?.assignmentsHistory;
            const cacheVariationId = assignmentsHistory ? assignmentsHistory[variationGroup.id] : null;
            if (cacheVariationId) {
                const newVariation = variationGroup.variations.find(x => x.id === cacheVariationId);
                if (!newVariation) {
                    continue;
                }
                return {
                    id: newVariation.id,
                    modifications: newVariation.modifications,
                    reference: newVariation.reference
                };
            }
            if (variation.allocation === undefined) {
                continue;
            }
            totalAllocation += variation.allocation;
            if (hashAllocation <= totalAllocation) {
                return {
                    id: variation.id,
                    modifications: variation.modifications,
                    reference: variation.reference
                };
            }
        }
        return null;
    }
    isMatchTargeting(variationGroup, visitor) {
        if (!variationGroup || !variationGroup.targeting || !variationGroup.targeting.targetingGroups) {
            return false;
        }
        return variationGroup.targeting.targetingGroups.some(targetingGroup => this.checkAndTargeting(targetingGroup.targetings, visitor));
    }
    isANDListOperator(operator) {
        return ['NOT_EQUALS', 'NOT_CONTAINS'].includes(operator);
    }
    checkAndTargeting(targetings, visitor) {
        let contextValue;
        let check = false;
        for (const { key, value, operator } of targetings) {
            if (key === 'fs_all_users') {
                check = true;
                continue;
            }
            if (key === 'fs_users') {
                contextValue = visitor.visitorId;
            }
            else {
                if (!(key in visitor.context)) {
                    check = false;
                    break;
                }
                contextValue = visitor.context[key];
            }
            check = this.testOperator(operator, contextValue, value);
            if (!check) {
                break;
            }
        }
        return check;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    testListOperatorLoop(operator, contextValue, value, initialCheck) {
        let check = initialCheck;
        for (const v of value) {
            check = this.testOperator(operator, contextValue, v);
            if (check !== initialCheck) {
                break;
            }
        }
        return check;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    testListOperator(operator, contextValue, value) {
        const andOperator = this.isANDListOperator(operator);
        if (andOperator) {
            return this.testListOperatorLoop(operator, contextValue, value, true);
        }
        return this.testListOperatorLoop(operator, contextValue, value, false);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    testOperator(operator, contextValue, value) {
        let check;
        if (Array.isArray(value)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return this.testListOperator(operator, contextValue, value);
        }
        switch (operator) {
            case 'EQUALS':
                check = contextValue === value;
                break;
            case 'NOT_EQUALS':
                check = contextValue !== value;
                break;
            case 'CONTAINS':
                check = contextValue.toString().includes(value.toString());
                break;
            case 'NOT_CONTAINS':
                check = !contextValue.toString().includes(value.toString());
                break;
            case 'GREATER_THAN':
                check = contextValue > value;
                break;
            case 'LOWER_THAN':
                check = contextValue < value;
                break;
            case 'GREATER_THAN_OR_EQUALS':
                check = contextValue >= value;
                break;
            case 'LOWER_THAN_OR_EQUALS':
                check = contextValue <= value;
                break;
            case 'STARTS_WITH':
                check = contextValue.toString().startsWith(value.toString());
                break;
            case 'ENDS_WITH':
                check = contextValue.toString().endsWith(value.toString());
                break;
            default:
                check = false;
                break;
        }
        return check;
    }
}


/***/ }),

/***/ "./src/decision/DecisionManager.ts":
/*!*****************************************!*\
  !*** ./src/decision/DecisionManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DecisionManager": () => (/* binding */ DecisionManager)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");

class DecisionManager {
    _config;
    _panic = false;
    _httpClient;
    _statusChangedCallback;
    get config() {
        return this._config;
    }
    // eslint-disable-next-line accessor-pairs
    set panic(v) {
        this.updateFlagshipStatus(v ? _enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus.READY_PANIC_ON : _enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus.READY);
        this._panic = v;
    }
    statusChangedCallback(v) {
        this._statusChangedCallback = v;
    }
    constructor(httpClient, config) {
        this._config = config;
        this._httpClient = httpClient;
    }
    updateFlagshipStatus(v) {
        if (typeof this._statusChangedCallback === 'function' && this._statusChangedCallback) {
            this._statusChangedCallback(v);
        }
    }
    getModifications(campaigns) {
        const modifications = new Map();
        campaigns.forEach((campaign) => {
            const object = campaign.variation.modifications.value;
            for (const key in object) {
                const value = object[key];
                modifications.set(key, {
                    key,
                    campaignId: campaign.id,
                    variationGroupId: campaign.variationGroupId,
                    variationId: campaign.variation.id,
                    isReference: campaign.variation.reference,
                    campaignType: campaign.type,
                    slug: campaign.slug,
                    value
                });
            }
        });
        return modifications;
    }
    isPanic() {
        return this._panic;
    }
}


/***/ }),

/***/ "./src/enum/BatchStrategy.ts":
/*!***********************************!*\
  !*** ./src/enum/BatchStrategy.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BatchStrategy": () => (/* binding */ BatchStrategy)
/* harmony export */ });
var BatchStrategy;
(function (BatchStrategy) {
    BatchStrategy[BatchStrategy["CONTINUOUS_CACHING"] = 0] = "CONTINUOUS_CACHING";
    BatchStrategy[BatchStrategy["PERIODIC_CACHING"] = 1] = "PERIODIC_CACHING";
})(BatchStrategy || (BatchStrategy = {}));


/***/ }),

/***/ "./src/enum/FlagshipConstant.ts":
/*!**************************************!*\
  !*** ./src/enum/FlagshipConstant.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SDK_LANGUAGE": () => (/* binding */ SDK_LANGUAGE),
/* harmony export */   "REQUEST_TIME_OUT": () => (/* binding */ REQUEST_TIME_OUT),
/* harmony export */   "DEFAULT_DEDUPLICATION_TIME": () => (/* binding */ DEFAULT_DEDUPLICATION_TIME),
/* harmony export */   "DEFAULT_POLLING_INTERVAL": () => (/* binding */ DEFAULT_POLLING_INTERVAL),
/* harmony export */   "DEFAULT_TIME_INTERVAL": () => (/* binding */ DEFAULT_TIME_INTERVAL),
/* harmony export */   "DEFAULT_BATCH_LENGTH": () => (/* binding */ DEFAULT_BATCH_LENGTH),
/* harmony export */   "BATCH_MAX_SIZE": () => (/* binding */ BATCH_MAX_SIZE),
/* harmony export */   "BASE_API_URL": () => (/* binding */ BASE_API_URL),
/* harmony export */   "HIT_API_URL": () => (/* binding */ HIT_API_URL),
/* harmony export */   "HIT_EVENT_URL": () => (/* binding */ HIT_EVENT_URL),
/* harmony export */   "BUCKETING_API_URL": () => (/* binding */ BUCKETING_API_URL),
/* harmony export */   "BUCKETING_API_CONTEXT_URL": () => (/* binding */ BUCKETING_API_CONTEXT_URL),
/* harmony export */   "HIT_CONSENT_URL": () => (/* binding */ HIT_CONSENT_URL),
/* harmony export */   "URL_CAMPAIGNS": () => (/* binding */ URL_CAMPAIGNS),
/* harmony export */   "URL_ACTIVATE_MODIFICATION": () => (/* binding */ URL_ACTIVATE_MODIFICATION),
/* harmony export */   "EXPOSE_ALL_KEYS": () => (/* binding */ EXPOSE_ALL_KEYS),
/* harmony export */   "SEND_CONTEXT_EVENT": () => (/* binding */ SEND_CONTEXT_EVENT),
/* harmony export */   "SDK_VERSION": () => (/* binding */ SDK_VERSION),
/* harmony export */   "VISITOR_CACHE_VERSION": () => (/* binding */ VISITOR_CACHE_VERSION),
/* harmony export */   "HIT_CACHE_VERSION": () => (/* binding */ HIT_CACHE_VERSION),
/* harmony export */   "DEFAULT_HIT_CACHE_TIME": () => (/* binding */ DEFAULT_HIT_CACHE_TIME),
/* harmony export */   "SDK_STARTED_INFO": () => (/* binding */ SDK_STARTED_INFO),
/* harmony export */   "FLAGSHIP_SDK": () => (/* binding */ FLAGSHIP_SDK),
/* harmony export */   "EMIT_READY": () => (/* binding */ EMIT_READY),
/* harmony export */   "NO_BATCHING_WITH_CONTINUOUS_CACHING_STRATEGY": () => (/* binding */ NO_BATCHING_WITH_CONTINUOUS_CACHING_STRATEGY),
/* harmony export */   "INITIALIZATION_PARAM_ERROR": () => (/* binding */ INITIALIZATION_PARAM_ERROR),
/* harmony export */   "ERROR": () => (/* binding */ ERROR),
/* harmony export */   "CONTEXT_NULL_ERROR": () => (/* binding */ CONTEXT_NULL_ERROR),
/* harmony export */   "CONTEXT_PARAM_ERROR": () => (/* binding */ CONTEXT_PARAM_ERROR),
/* harmony export */   "GET_MODIFICATION_CAST_ERROR": () => (/* binding */ GET_MODIFICATION_CAST_ERROR),
/* harmony export */   "GET_FLAG_CAST_ERROR": () => (/* binding */ GET_FLAG_CAST_ERROR),
/* harmony export */   "GET_MODIFICATION_MISSING_ERROR": () => (/* binding */ GET_MODIFICATION_MISSING_ERROR),
/* harmony export */   "GET_FLAG_MISSING_ERROR": () => (/* binding */ GET_FLAG_MISSING_ERROR),
/* harmony export */   "GET_MODIFICATION_KEY_ERROR": () => (/* binding */ GET_MODIFICATION_KEY_ERROR),
/* harmony export */   "ACTIVATE_MODIFICATION_KEY_ERROR": () => (/* binding */ ACTIVATE_MODIFICATION_KEY_ERROR),
/* harmony export */   "GET_MODIFICATION_ERROR": () => (/* binding */ GET_MODIFICATION_ERROR),
/* harmony export */   "GET_FLAG_ERROR": () => (/* binding */ GET_FLAG_ERROR),
/* harmony export */   "USER_EXPOSED_FLAG_ERROR": () => (/* binding */ USER_EXPOSED_FLAG_ERROR),
/* harmony export */   "USER_EXPOSED_CAST_ERROR": () => (/* binding */ USER_EXPOSED_CAST_ERROR),
/* harmony export */   "GET_METADATA_CAST_ERROR": () => (/* binding */ GET_METADATA_CAST_ERROR),
/* harmony export */   "ACTIVATE_MODIFICATION_ERROR": () => (/* binding */ ACTIVATE_MODIFICATION_ERROR),
/* harmony export */   "DECISION_MANAGER_MISSING_ERROR": () => (/* binding */ DECISION_MANAGER_MISSING_ERROR),
/* harmony export */   "TRACKER_MANAGER_MISSING_ERROR": () => (/* binding */ TRACKER_MANAGER_MISSING_ERROR),
/* harmony export */   "CURL_LIBRARY_IS_NOT_LOADED": () => (/* binding */ CURL_LIBRARY_IS_NOT_LOADED),
/* harmony export */   "TYPE_ERROR": () => (/* binding */ TYPE_ERROR),
/* harmony export */   "TYPE_INTEGER_ERROR": () => (/* binding */ TYPE_INTEGER_ERROR),
/* harmony export */   "VISITOR_ID_ERROR": () => (/* binding */ VISITOR_ID_ERROR),
/* harmony export */   "PANIC_MODE_ERROR": () => (/* binding */ PANIC_MODE_ERROR),
/* harmony export */   "METHOD_DEACTIVATED_CONSENT_ERROR": () => (/* binding */ METHOD_DEACTIVATED_CONSENT_ERROR),
/* harmony export */   "METHOD_DEACTIVATED_ERROR": () => (/* binding */ METHOD_DEACTIVATED_ERROR),
/* harmony export */   "METHOD_DEACTIVATED_BUCKETING_ERROR": () => (/* binding */ METHOD_DEACTIVATED_BUCKETING_ERROR),
/* harmony export */   "FLAGSHIP_VISITOR_NOT_AUTHENTICATE": () => (/* binding */ FLAGSHIP_VISITOR_NOT_AUTHENTICATE),
/* harmony export */   "PREDEFINED_CONTEXT_TYPE_ERROR": () => (/* binding */ PREDEFINED_CONTEXT_TYPE_ERROR),
/* harmony export */   "METHOD_DEACTIVATED_SEND_CONSENT_ERROR": () => (/* binding */ METHOD_DEACTIVATED_SEND_CONSENT_ERROR),
/* harmony export */   "HIT_ADDED_IN_QUEUE": () => (/* binding */ HIT_ADDED_IN_QUEUE),
/* harmony export */   "ADD_HIT": () => (/* binding */ ADD_HIT),
/* harmony export */   "BATCH_SENT_SUCCESS": () => (/* binding */ BATCH_SENT_SUCCESS),
/* harmony export */   "ACTIVATE_SENT_SUCCESS": () => (/* binding */ ACTIVATE_SENT_SUCCESS),
/* harmony export */   "SEND_BATCH": () => (/* binding */ SEND_BATCH),
/* harmony export */   "SEND_ACTIVATE": () => (/* binding */ SEND_ACTIVATE),
/* harmony export */   "SEND_HIT": () => (/* binding */ SEND_HIT),
/* harmony export */   "HIT_DATA_CACHED": () => (/* binding */ HIT_DATA_CACHED),
/* harmony export */   "HIT_DATA_FLUSHED": () => (/* binding */ HIT_DATA_FLUSHED),
/* harmony export */   "HIT_SENT_SUCCESS": () => (/* binding */ HIT_SENT_SUCCESS),
/* harmony export */   "HIT_DATA_LOADED": () => (/* binding */ HIT_DATA_LOADED),
/* harmony export */   "NEW_VISITOR_NOT_READY": () => (/* binding */ NEW_VISITOR_NOT_READY),
/* harmony export */   "PROCESS": () => (/* binding */ PROCESS),
/* harmony export */   "PROCESS_INITIALIZATION": () => (/* binding */ PROCESS_INITIALIZATION),
/* harmony export */   "PROCESS_UPDATE_CONTEXT": () => (/* binding */ PROCESS_UPDATE_CONTEXT),
/* harmony export */   "PROCESS_GET_MODIFICATION": () => (/* binding */ PROCESS_GET_MODIFICATION),
/* harmony export */   "PROCESS_GET_MODIFICATION_INFO": () => (/* binding */ PROCESS_GET_MODIFICATION_INFO),
/* harmony export */   "PROCESS_NEW_VISITOR": () => (/* binding */ PROCESS_NEW_VISITOR),
/* harmony export */   "PROCESS_ACTIVE_MODIFICATION": () => (/* binding */ PROCESS_ACTIVE_MODIFICATION),
/* harmony export */   "PROCESS_SYNCHRONIZED_MODIFICATION": () => (/* binding */ PROCESS_SYNCHRONIZED_MODIFICATION),
/* harmony export */   "PROCESS_SEND_HIT": () => (/* binding */ PROCESS_SEND_HIT),
/* harmony export */   "PROCESS_SEND_ACTIVATE": () => (/* binding */ PROCESS_SEND_ACTIVATE),
/* harmony export */   "PROCESS_GET_CAMPAIGNS": () => (/* binding */ PROCESS_GET_CAMPAIGNS),
/* harmony export */   "PROCESS_GET_ALL_MODIFICATION": () => (/* binding */ PROCESS_GET_ALL_MODIFICATION),
/* harmony export */   "PROCESS_MODIFICATIONS_FOR_CAMPAIGN": () => (/* binding */ PROCESS_MODIFICATIONS_FOR_CAMPAIGN),
/* harmony export */   "PROCESS_CACHE_HIT": () => (/* binding */ PROCESS_CACHE_HIT),
/* harmony export */   "PROCESS_FLUSH_HIT": () => (/* binding */ PROCESS_FLUSH_HIT),
/* harmony export */   "PROCESS_LOOKUP_HIT": () => (/* binding */ PROCESS_LOOKUP_HIT),
/* harmony export */   "CUSTOMER_ENV_ID_API_ITEM": () => (/* binding */ CUSTOMER_ENV_ID_API_ITEM),
/* harmony export */   "CUSTOMER_ENV_ID_API_ACTIVATE": () => (/* binding */ CUSTOMER_ENV_ID_API_ACTIVATE),
/* harmony export */   "CUSTOMER_UID": () => (/* binding */ CUSTOMER_UID),
/* harmony export */   "ANONYMOUS_ID": () => (/* binding */ ANONYMOUS_ID),
/* harmony export */   "VISITOR_ID_API_ITEM": () => (/* binding */ VISITOR_ID_API_ITEM),
/* harmony export */   "VARIATION_GROUP_ID_API_ITEM": () => (/* binding */ VARIATION_GROUP_ID_API_ITEM),
/* harmony export */   "VARIATION_GROUP_ID_API_ITEM_ACTIVATE": () => (/* binding */ VARIATION_GROUP_ID_API_ITEM_ACTIVATE),
/* harmony export */   "VISITOR_CONSENT": () => (/* binding */ VISITOR_CONSENT),
/* harmony export */   "CAMPAIGN_ID": () => (/* binding */ CAMPAIGN_ID),
/* harmony export */   "VARIATION_ID_API_ITEM": () => (/* binding */ VARIATION_ID_API_ITEM),
/* harmony export */   "DS_API_ITEM": () => (/* binding */ DS_API_ITEM),
/* harmony export */   "T_API_ITEM": () => (/* binding */ T_API_ITEM),
/* harmony export */   "QT_API_ITEM": () => (/* binding */ QT_API_ITEM),
/* harmony export */   "DL_API_ITEM": () => (/* binding */ DL_API_ITEM),
/* harmony export */   "SL_ITEM": () => (/* binding */ SL_ITEM),
/* harmony export */   "SDK_APP": () => (/* binding */ SDK_APP),
/* harmony export */   "TID_API_ITEM": () => (/* binding */ TID_API_ITEM),
/* harmony export */   "TA_API_ITEM": () => (/* binding */ TA_API_ITEM),
/* harmony export */   "TT_API_ITEM": () => (/* binding */ TT_API_ITEM),
/* harmony export */   "TC_API_ITEM": () => (/* binding */ TC_API_ITEM),
/* harmony export */   "TCC_API_ITEM": () => (/* binding */ TCC_API_ITEM),
/* harmony export */   "ICN_API_ITEM": () => (/* binding */ ICN_API_ITEM),
/* harmony export */   "SM_API_ITEM": () => (/* binding */ SM_API_ITEM),
/* harmony export */   "PM_API_ITEM": () => (/* binding */ PM_API_ITEM),
/* harmony export */   "TR_API_ITEM": () => (/* binding */ TR_API_ITEM),
/* harmony export */   "TS_API_ITEM": () => (/* binding */ TS_API_ITEM),
/* harmony export */   "IN_API_ITEM": () => (/* binding */ IN_API_ITEM),
/* harmony export */   "IC_API_ITEM": () => (/* binding */ IC_API_ITEM),
/* harmony export */   "IP_API_ITEM": () => (/* binding */ IP_API_ITEM),
/* harmony export */   "IQ_API_ITEM": () => (/* binding */ IQ_API_ITEM),
/* harmony export */   "IV_API_ITEM": () => (/* binding */ IV_API_ITEM),
/* harmony export */   "EVENT_CATEGORY_API_ITEM": () => (/* binding */ EVENT_CATEGORY_API_ITEM),
/* harmony export */   "EVENT_ACTION_API_ITEM": () => (/* binding */ EVENT_ACTION_API_ITEM),
/* harmony export */   "EVENT_LABEL_API_ITEM": () => (/* binding */ EVENT_LABEL_API_ITEM),
/* harmony export */   "EVENT_VALUE_API_ITEM": () => (/* binding */ EVENT_VALUE_API_ITEM),
/* harmony export */   "USER_IP_API_ITEM": () => (/* binding */ USER_IP_API_ITEM),
/* harmony export */   "SCREEN_RESOLUTION_API_ITEM": () => (/* binding */ SCREEN_RESOLUTION_API_ITEM),
/* harmony export */   "USER_LANGUAGE": () => (/* binding */ USER_LANGUAGE),
/* harmony export */   "SESSION_NUMBER": () => (/* binding */ SESSION_NUMBER),
/* harmony export */   "HEADER_X_API_KEY": () => (/* binding */ HEADER_X_API_KEY),
/* harmony export */   "HEADER_X_ENV_ID": () => (/* binding */ HEADER_X_ENV_ID),
/* harmony export */   "HEADER_CONTENT_TYPE": () => (/* binding */ HEADER_CONTENT_TYPE),
/* harmony export */   "HEADER_X_SDK_CLIENT": () => (/* binding */ HEADER_X_SDK_CLIENT),
/* harmony export */   "HEADER_X_SDK_VERSION": () => (/* binding */ HEADER_X_SDK_VERSION),
/* harmony export */   "HEADER_APPLICATION_JSON": () => (/* binding */ HEADER_APPLICATION_JSON)
/* harmony export */ });
/**
 * SDK language
 */
const SDK_LANGUAGE = {
    name: 'TypeScript'
};
/**
 * Default request timeout in second
 */
const REQUEST_TIME_OUT = 2;
const DEFAULT_DEDUPLICATION_TIME = 2.5;
const DEFAULT_POLLING_INTERVAL = 1;
const DEFAULT_TIME_INTERVAL = 10;
const DEFAULT_BATCH_LENGTH = 20;
const BATCH_MAX_SIZE = 2500000;
/**
 * Decision api base url
 */
const BASE_API_URL = 'https://decision.flagship.io/v2/';
const HIT_API_URL = 'https://ariane.abtasty.com';
const HIT_EVENT_URL = 'https://staging-events.flagship.io/v1'; // 'https://events.flagship.io/v2'
const BUCKETING_API_URL = 'https://cdn.flagship.io/{0}/bucketing.json';
const BUCKETING_API_CONTEXT_URL = 'https://decision.flagship.io/v2/{0}/events';
const HIT_CONSENT_URL = 'https://ariane.abtasty.com';
const URL_CAMPAIGNS = '/campaigns';
const URL_ACTIVATE_MODIFICATION = 'activate';
const EXPOSE_ALL_KEYS = 'exposeAllKeys';
const SEND_CONTEXT_EVENT = 'sendContextEvent';
/**
 * SDK version
 */
const SDK_VERSION = 'v3';
const VISITOR_CACHE_VERSION = 1;
const HIT_CACHE_VERSION = 1;
const DEFAULT_HIT_CACHE_TIME = 14400000;
/**
 * Message Info
 */
const SDK_STARTED_INFO = 'Flagship SDK (version: {0}) READY';
const FLAGSHIP_SDK = 'Flagship SDK';
const EMIT_READY = 'ready';
const NO_BATCHING_WITH_CONTINUOUS_CACHING_STRATEGY = 3;
/**
 * Message Error
 */
const INITIALIZATION_PARAM_ERROR = "Params 'envId' and 'apiKey' must not be null or empty.";
const ERROR = 'error';
const CONTEXT_NULL_ERROR = 'Context must not to be null';
const CONTEXT_PARAM_ERROR = "params {0} must be a non null String, and 'value' must be one of the following types , Number, Boolean";
const GET_MODIFICATION_CAST_ERROR = 'Modification for key {0} has a different type. Default value is returned.';
const GET_FLAG_CAST_ERROR = 'Flag for key {0} has a different type. Default value is returned.';
const GET_MODIFICATION_MISSING_ERROR = 'No modification for key {0}. Default value is returned.';
const GET_FLAG_MISSING_ERROR = 'No Flag for key {0}. Default value is returned.';
const GET_MODIFICATION_KEY_ERROR = 'Key {0} must not be null. Default value is returned.';
const ACTIVATE_MODIFICATION_KEY_ERROR = 'Key {0} must not be null, no activate will be sent.';
const GET_MODIFICATION_ERROR = 'No modification for key {0}.';
const GET_FLAG_ERROR = 'No flag for key {0}.';
const USER_EXPOSED_FLAG_ERROR = 'No flag for key {0}, no activate will be sent';
const USER_EXPOSED_CAST_ERROR = 'Flag for key {0} has a different type with defaultValue, no activate will be sent';
const GET_METADATA_CAST_ERROR = 'Flag for key {0} has a different type with defaultValue, an empty metadata object is returned';
const ACTIVATE_MODIFICATION_ERROR = 'No modification for key {0}, no activate will be sent.';
const DECISION_MANAGER_MISSING_ERROR = 'decisionManager must not be null.';
const TRACKER_MANAGER_MISSING_ERROR = 'trackerManager must not be null.';
const CURL_LIBRARY_IS_NOT_LOADED = 'curl library is not loaded';
const TYPE_ERROR = '{0} must be a {1}';
const TYPE_INTEGER_ERROR = 'value of {0} is not an {1}, it will be truncated to {1}';
const VISITOR_ID_ERROR = 'visitorId must not be null or empty';
const PANIC_MODE_ERROR = '{0} deactivated while panic mode is on.';
const METHOD_DEACTIVATED_CONSENT_ERROR = 'Method {0} is deactivated for visitor {1} : visitor did not consent.';
const METHOD_DEACTIVATED_ERROR = 'Method {0} is deactivated while SDK status is: {1}.';
const METHOD_DEACTIVATED_BUCKETING_ERROR = 'Method {0} is deactivated on Bucketing mode.';
const FLAGSHIP_VISITOR_NOT_AUTHENTICATE = 'Visitor is not authenticated yet';
const PREDEFINED_CONTEXT_TYPE_ERROR = 'Predefined Context {0} must be type of {1}';
const METHOD_DEACTIVATED_SEND_CONSENT_ERROR = 'Send consent hit is deactivated while SDK status is: {1}.';
const HIT_ADDED_IN_QUEUE = 'The hit has been added to the pool queue : {0}';
const ADD_HIT = 'ADD HIT';
const BATCH_SENT_SUCCESS = 'Batch hit has been sent : {0}';
const ACTIVATE_SENT_SUCCESS = 'Activate hit has been sent : {0}';
const SEND_BATCH = 'SEND BATCH';
const SEND_ACTIVATE = 'SEND ACTIVATE';
const SEND_HIT = 'SEND HIT';
const HIT_DATA_CACHED = 'Hit data has been saved into database : {0}';
const HIT_DATA_FLUSHED = 'The following hit keys have been flushed from database : {0}';
const HIT_SENT_SUCCESS = 'hit has been sent : {0}';
const HIT_DATA_LOADED = 'Hits data has been loaded from database: {0}';
const NEW_VISITOR_NOT_READY = 'Please start first the SDK in order to create a new Visitor';
// Process
const PROCESS = 'process';
const PROCESS_INITIALIZATION = 'INITIALIZATION';
const PROCESS_UPDATE_CONTEXT = 'UPDATE CONTEXT';
const PROCESS_GET_MODIFICATION = 'GET MODIFICATION';
const PROCESS_GET_MODIFICATION_INFO = 'GET MODIFICATION INFO';
const PROCESS_NEW_VISITOR = 'NEW VISITOR';
const PROCESS_ACTIVE_MODIFICATION = 'ACTIVE MODIFICATION';
const PROCESS_SYNCHRONIZED_MODIFICATION = 'SYNCHRONIZED MODIFICATION';
const PROCESS_SEND_HIT = 'ADD HIT';
const PROCESS_SEND_ACTIVATE = 'SEND ACTIVATE';
const PROCESS_GET_CAMPAIGNS = 'GET CAMPAIGNS';
const PROCESS_GET_ALL_MODIFICATION = 'GET ALL MODIFICATIONS';
const PROCESS_MODIFICATIONS_FOR_CAMPAIGN = 'GET MODIFICATION FOR CAMPAIGN';
const PROCESS_CACHE_HIT = 'CACHE HIT';
const PROCESS_FLUSH_HIT = 'FLUSH HIT';
const PROCESS_LOOKUP_HIT = 'LOOKUP HIT';
// Api items
const CUSTOMER_ENV_ID_API_ITEM = 'eid';
const CUSTOMER_ENV_ID_API_ACTIVATE = 'cid';
const CUSTOMER_UID = 'cuid';
const ANONYMOUS_ID = 'aid';
const VISITOR_ID_API_ITEM = 'vid';
const VARIATION_GROUP_ID_API_ITEM = 'vgid';
const VARIATION_GROUP_ID_API_ITEM_ACTIVATE = 'caid';
const VISITOR_CONSENT = 'vc';
const CAMPAIGN_ID = 'caid';
const VARIATION_ID_API_ITEM = 'vaid';
const DS_API_ITEM = 'ds';
const T_API_ITEM = 't';
const QT_API_ITEM = 'qt';
const DL_API_ITEM = 'dl';
const SL_ITEM = 'sl';
const SDK_APP = 'APP';
const TID_API_ITEM = 'tid';
const TA_API_ITEM = 'ta';
const TT_API_ITEM = 'tt';
const TC_API_ITEM = 'tc';
const TCC_API_ITEM = 'tcc';
const ICN_API_ITEM = 'icn';
const SM_API_ITEM = 'sm';
const PM_API_ITEM = 'pm';
const TR_API_ITEM = 'tr';
const TS_API_ITEM = 'ts';
const IN_API_ITEM = 'in';
const IC_API_ITEM = 'ic';
const IP_API_ITEM = 'ip';
const IQ_API_ITEM = 'iq';
const IV_API_ITEM = 'iv';
const EVENT_CATEGORY_API_ITEM = 'ec';
const EVENT_ACTION_API_ITEM = 'ea';
const EVENT_LABEL_API_ITEM = 'el';
const EVENT_VALUE_API_ITEM = 'ev';
const USER_IP_API_ITEM = 'uip';
const SCREEN_RESOLUTION_API_ITEM = 'sr';
const USER_LANGUAGE = 'ul';
const SESSION_NUMBER = 'sn';
const HEADER_X_API_KEY = 'x-api-key';
const HEADER_X_ENV_ID = 'x-env-id';
const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_X_SDK_CLIENT = 'x-sdk-client';
const HEADER_X_SDK_VERSION = 'x-sdk-version';
const HEADER_APPLICATION_JSON = 'application/json';


/***/ }),

/***/ "./src/enum/FlagshipContext.ts":
/*!*************************************!*\
  !*** ./src/enum/FlagshipContext.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEVICE_LOCALE": () => (/* binding */ DEVICE_LOCALE),
/* harmony export */   "DEVICE_TYPE": () => (/* binding */ DEVICE_TYPE),
/* harmony export */   "DEVICE_MODEL": () => (/* binding */ DEVICE_MODEL),
/* harmony export */   "LOCATION_CITY": () => (/* binding */ LOCATION_CITY),
/* harmony export */   "LOCATION_REGION": () => (/* binding */ LOCATION_REGION),
/* harmony export */   "LOCATION_COUNTRY": () => (/* binding */ LOCATION_COUNTRY),
/* harmony export */   "LOCATION_LAT": () => (/* binding */ LOCATION_LAT),
/* harmony export */   "LOCATION_LONG": () => (/* binding */ LOCATION_LONG),
/* harmony export */   "IP": () => (/* binding */ IP),
/* harmony export */   "OS_NAME": () => (/* binding */ OS_NAME),
/* harmony export */   "OS_VERSION_NAME": () => (/* binding */ OS_VERSION_NAME),
/* harmony export */   "OS_VERSION_CODE": () => (/* binding */ OS_VERSION_CODE),
/* harmony export */   "CARRIER_NAME": () => (/* binding */ CARRIER_NAME),
/* harmony export */   "INTERNET_CONNECTION": () => (/* binding */ INTERNET_CONNECTION),
/* harmony export */   "APP_VERSION_NAME": () => (/* binding */ APP_VERSION_NAME),
/* harmony export */   "APP_VERSION_CODE": () => (/* binding */ APP_VERSION_CODE),
/* harmony export */   "INTERFACE_NAME": () => (/* binding */ INTERFACE_NAME),
/* harmony export */   "FLAGSHIP_CLIENT": () => (/* binding */ FLAGSHIP_CLIENT),
/* harmony export */   "FLAGSHIP_VERSION": () => (/* binding */ FLAGSHIP_VERSION),
/* harmony export */   "FLAGSHIP_VISITOR": () => (/* binding */ FLAGSHIP_VISITOR),
/* harmony export */   "FLAGSHIP_CONTEXT": () => (/* binding */ FLAGSHIP_CONTEXT)
/* harmony export */ });
/**
     * Current device locale
     */
const DEVICE_LOCALE = 'sdk_deviceLanguage';
/**
  * Current device type  tablet, pc, server, iot, other

  */
const DEVICE_TYPE = 'sdk_deviceType';
/**
  * Current device model
  */
const DEVICE_MODEL = 'sdk_deviceModel';
/**
  * Current visitor city

  */
const LOCATION_CITY = 'sdk_city';
/**
  * Current visitor region

  */
const LOCATION_REGION = 'sdk_region';
/**
  * Current visitor country

  */
const LOCATION_COUNTRY = 'sdk_country';
/**
  * Current visitor latitude

  */
const LOCATION_LAT = 'sdk_lat';
/**
  * Current visitor longitude

  */
const LOCATION_LONG = 'sdk_long';
/**
  * Device public ip

  */
const IP = 'sdk_ip';
/**
  * OS name

  */
const OS_NAME = 'sdk_osName';
/**
  * OS version name

  */
const OS_VERSION_NAME = 'sdk_osVersionName';
/**
  * OS version code

  */
const OS_VERSION_CODE = 'sdk_osVersionCode';
/**
  * Carrier operator

  */
const CARRIER_NAME = 'sdk_carrierName';
/**
  * Internet connection type : 4G, 5G, Fiber

  */
const INTERNET_CONNECTION = 'sdk_internetConnection';
/**
  * Customer app version name

  */
const APP_VERSION_NAME = 'sdk_versionName';
/**
  * Customer app version code

  */
const APP_VERSION_CODE = 'sdk_versionCode';
/**
  * Current customer app interface name

  */
const INTERFACE_NAME = 'sdk_interfaceName';
/**
  * Flagship SDK client name

  */
const FLAGSHIP_CLIENT = 'fs_client';
/**
  * Flagship SDK version name

  */
const FLAGSHIP_VERSION = 'fs_version';
/**
  * Current visitor id

  */
const FLAGSHIP_VISITOR = 'fs_users';
const FLAGSHIP_CONTEXT = {
    [DEVICE_LOCALE]: 'string',
    [DEVICE_TYPE]: 'string',
    [DEVICE_MODEL]: 'string',
    [LOCATION_CITY]: 'string',
    [LOCATION_REGION]: 'string',
    [LOCATION_COUNTRY]: 'string',
    [LOCATION_LAT]: 'number',
    [LOCATION_LONG]: 'number',
    [IP]: 'string',
    [OS_NAME]: 'string',
    [OS_VERSION_NAME]: 'string',
    [OS_VERSION_CODE]: 'string',
    [CARRIER_NAME]: 'string',
    [INTERNET_CONNECTION]: 'string',
    [APP_VERSION_NAME]: 'string',
    [APP_VERSION_CODE]: 'string',
    [INTERFACE_NAME]: 'string',
    [FLAGSHIP_CLIENT]: 'string',
    [FLAGSHIP_VERSION]: 'string',
    [FLAGSHIP_VISITOR]: 'string'
};


/***/ }),

/***/ "./src/enum/FlagshipStatus.ts":
/*!************************************!*\
  !*** ./src/enum/FlagshipStatus.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlagshipStatus": () => (/* binding */ FlagshipStatus)
/* harmony export */ });
var FlagshipStatus;
(function (FlagshipStatus) {
    /**
        * It is the default initial status. This status remains until the sdk has been initialized successfully.
        * Flagship SDK has not been started or initialized successfully.
        * @deprecated in v2, use FlagshipStatus::NOT_INITIALIZED instead of
        */
    FlagshipStatus[FlagshipStatus["NOT_READY"] = 0] = "NOT_READY";
    /**
     * It is the default initial status. This status remains until the sdk has been initialized successfully.
     */
    FlagshipStatus[FlagshipStatus["NOT_INITIALIZED"] = 0] = "NOT_INITIALIZED";
    /**
     * Flagship SDK is starting.
     */
    FlagshipStatus[FlagshipStatus["STARTING"] = 1] = "STARTING";
    /**
     * Flagship SDK has been started successfully but is still polling campaigns.
     */
    FlagshipStatus[FlagshipStatus["POLLING"] = 2] = "POLLING";
    /**
     * Flagship SDK is ready but is running in Panic mode: All features are disabled except the one which refresh this status.
     */
    FlagshipStatus[FlagshipStatus["READY_PANIC_ON"] = 3] = "READY_PANIC_ON";
    /**
     * Flagship SDK is ready to use.
     */
    FlagshipStatus[FlagshipStatus["READY"] = 4] = "READY";
})(FlagshipStatus || (FlagshipStatus = {}));


/***/ }),

/***/ "./src/enum/HitType.ts":
/*!*****************************!*\
  !*** ./src/enum/HitType.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HitType": () => (/* binding */ HitType)
/* harmony export */ });
var HitType;
(function (HitType) {
    /**
     * User has seen a URL
     *
     */
    HitType["PAGE_VIEW"] = "PAGEVIEW";
    /**
     * User has seen a URL
     *
     */
    HitType["PAGE"] = "PAGEVIEW";
    /**
     * User has seen a screen.
     *
     */
    HitType["SCREEN_VIEW"] = "SCREENVIEW";
    /**
     * User has seen a screen.
     *
     */
    HitType["SCREEN"] = "SCREENVIEW";
    /**
     * User has made a transaction.
     *
     */
    HitType["TRANSACTION"] = "TRANSACTION";
    /**
     * Item bought in a transaction.
     *
     */
    HitType["ITEM"] = "ITEM";
    /**
     * User has made a specific action.
     *
     */
    HitType["EVENT"] = "EVENT";
    /**
     *
     */
    HitType["SEGMENT"] = "SEGMENT";
    /**
     *
     */
    HitType["CONSENT"] = "CONSENT";
    /**
     *
     */
    HitType["CAMPAIGN"] = "CAMPAIGN";
})(HitType || (HitType = {}));


/***/ }),

/***/ "./src/enum/LogLevel.ts":
/*!******************************!*\
  !*** ./src/enum/LogLevel.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LogLevel": () => (/* binding */ LogLevel)
/* harmony export */ });
var LogLevel;
(function (LogLevel) {
    /**
       * NONE = 0: Logging will be disabled.
       */
    LogLevel[LogLevel["NONE"] = 0] = "NONE";
    /**
       * EMERGENCY = 1: Only emergencies will be logged.
       */
    LogLevel[LogLevel["EMERGENCY"] = 1] = "EMERGENCY";
    /**
       * ALERT = 2: Only alerts and above will be logged.
       */
    LogLevel[LogLevel["ALERT"] = 2] = "ALERT";
    /**
       * CRITICAL = 3: Only critical and above will be logged.
       */
    LogLevel[LogLevel["CRITICAL"] = 3] = "CRITICAL";
    /**
       * ERROR = 4: Only errors and above will be logged.
       */
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    /**
       * WARNING = 5: Only warnings and above will be logged.
       */
    LogLevel[LogLevel["WARNING"] = 5] = "WARNING";
    /**
       * NOTICE = 6: Only notices and above will be logged.
       */
    LogLevel[LogLevel["NOTICE"] = 6] = "NOTICE";
    /**
       * INFO = 7: Only info logs and above will be logged.
       */
    LogLevel[LogLevel["INFO"] = 7] = "INFO";
    /**
       * DEBUG = 8: Only debug logs and above will be logged.
       */
    LogLevel[LogLevel["DEBUG"] = 8] = "DEBUG";
    /**
       * ALL = 9: All logs will be logged.
       */
    LogLevel[LogLevel["ALL"] = 9] = "ALL";
})(LogLevel || (LogLevel = {}));


/***/ }),

/***/ "./src/enum/index.ts":
/*!***************************!*\
  !*** ./src/enum/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LogLevel": () => (/* reexport safe */ _LogLevel__WEBPACK_IMPORTED_MODULE_0__.LogLevel),
/* harmony export */   "ACTIVATE_MODIFICATION_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.ACTIVATE_MODIFICATION_ERROR),
/* harmony export */   "ACTIVATE_MODIFICATION_KEY_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.ACTIVATE_MODIFICATION_KEY_ERROR),
/* harmony export */   "ACTIVATE_SENT_SUCCESS": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.ACTIVATE_SENT_SUCCESS),
/* harmony export */   "ADD_HIT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.ADD_HIT),
/* harmony export */   "ANONYMOUS_ID": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.ANONYMOUS_ID),
/* harmony export */   "BASE_API_URL": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.BASE_API_URL),
/* harmony export */   "BATCH_MAX_SIZE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.BATCH_MAX_SIZE),
/* harmony export */   "BATCH_SENT_SUCCESS": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.BATCH_SENT_SUCCESS),
/* harmony export */   "BUCKETING_API_CONTEXT_URL": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.BUCKETING_API_CONTEXT_URL),
/* harmony export */   "BUCKETING_API_URL": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.BUCKETING_API_URL),
/* harmony export */   "CAMPAIGN_ID": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.CAMPAIGN_ID),
/* harmony export */   "CONTEXT_NULL_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.CONTEXT_NULL_ERROR),
/* harmony export */   "CONTEXT_PARAM_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.CONTEXT_PARAM_ERROR),
/* harmony export */   "CURL_LIBRARY_IS_NOT_LOADED": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.CURL_LIBRARY_IS_NOT_LOADED),
/* harmony export */   "CUSTOMER_ENV_ID_API_ACTIVATE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.CUSTOMER_ENV_ID_API_ACTIVATE),
/* harmony export */   "CUSTOMER_ENV_ID_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.CUSTOMER_ENV_ID_API_ITEM),
/* harmony export */   "CUSTOMER_UID": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.CUSTOMER_UID),
/* harmony export */   "DECISION_MANAGER_MISSING_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.DECISION_MANAGER_MISSING_ERROR),
/* harmony export */   "DEFAULT_BATCH_LENGTH": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_BATCH_LENGTH),
/* harmony export */   "DEFAULT_DEDUPLICATION_TIME": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_DEDUPLICATION_TIME),
/* harmony export */   "DEFAULT_HIT_CACHE_TIME": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_HIT_CACHE_TIME),
/* harmony export */   "DEFAULT_POLLING_INTERVAL": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_POLLING_INTERVAL),
/* harmony export */   "DEFAULT_TIME_INTERVAL": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_TIME_INTERVAL),
/* harmony export */   "DL_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.DL_API_ITEM),
/* harmony export */   "DS_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.DS_API_ITEM),
/* harmony export */   "EMIT_READY": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.EMIT_READY),
/* harmony export */   "ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.ERROR),
/* harmony export */   "EVENT_ACTION_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.EVENT_ACTION_API_ITEM),
/* harmony export */   "EVENT_CATEGORY_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.EVENT_CATEGORY_API_ITEM),
/* harmony export */   "EVENT_LABEL_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.EVENT_LABEL_API_ITEM),
/* harmony export */   "EVENT_VALUE_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.EVENT_VALUE_API_ITEM),
/* harmony export */   "EXPOSE_ALL_KEYS": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.EXPOSE_ALL_KEYS),
/* harmony export */   "FLAGSHIP_SDK": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.FLAGSHIP_SDK),
/* harmony export */   "FLAGSHIP_VISITOR_NOT_AUTHENTICATE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.FLAGSHIP_VISITOR_NOT_AUTHENTICATE),
/* harmony export */   "GET_FLAG_CAST_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.GET_FLAG_CAST_ERROR),
/* harmony export */   "GET_FLAG_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.GET_FLAG_ERROR),
/* harmony export */   "GET_FLAG_MISSING_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.GET_FLAG_MISSING_ERROR),
/* harmony export */   "GET_METADATA_CAST_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.GET_METADATA_CAST_ERROR),
/* harmony export */   "GET_MODIFICATION_CAST_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.GET_MODIFICATION_CAST_ERROR),
/* harmony export */   "GET_MODIFICATION_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.GET_MODIFICATION_ERROR),
/* harmony export */   "GET_MODIFICATION_KEY_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.GET_MODIFICATION_KEY_ERROR),
/* harmony export */   "GET_MODIFICATION_MISSING_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.GET_MODIFICATION_MISSING_ERROR),
/* harmony export */   "HEADER_APPLICATION_JSON": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HEADER_APPLICATION_JSON),
/* harmony export */   "HEADER_CONTENT_TYPE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HEADER_CONTENT_TYPE),
/* harmony export */   "HEADER_X_API_KEY": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HEADER_X_API_KEY),
/* harmony export */   "HEADER_X_ENV_ID": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HEADER_X_ENV_ID),
/* harmony export */   "HEADER_X_SDK_CLIENT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HEADER_X_SDK_CLIENT),
/* harmony export */   "HEADER_X_SDK_VERSION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HEADER_X_SDK_VERSION),
/* harmony export */   "HIT_ADDED_IN_QUEUE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_ADDED_IN_QUEUE),
/* harmony export */   "HIT_API_URL": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_API_URL),
/* harmony export */   "HIT_CACHE_VERSION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_CACHE_VERSION),
/* harmony export */   "HIT_CONSENT_URL": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_CONSENT_URL),
/* harmony export */   "HIT_DATA_CACHED": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_DATA_CACHED),
/* harmony export */   "HIT_DATA_FLUSHED": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_DATA_FLUSHED),
/* harmony export */   "HIT_DATA_LOADED": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_DATA_LOADED),
/* harmony export */   "HIT_EVENT_URL": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_EVENT_URL),
/* harmony export */   "HIT_SENT_SUCCESS": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.HIT_SENT_SUCCESS),
/* harmony export */   "ICN_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.ICN_API_ITEM),
/* harmony export */   "IC_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.IC_API_ITEM),
/* harmony export */   "INITIALIZATION_PARAM_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.INITIALIZATION_PARAM_ERROR),
/* harmony export */   "IN_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.IN_API_ITEM),
/* harmony export */   "IP_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.IP_API_ITEM),
/* harmony export */   "IQ_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.IQ_API_ITEM),
/* harmony export */   "IV_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.IV_API_ITEM),
/* harmony export */   "METHOD_DEACTIVATED_BUCKETING_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.METHOD_DEACTIVATED_BUCKETING_ERROR),
/* harmony export */   "METHOD_DEACTIVATED_CONSENT_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.METHOD_DEACTIVATED_CONSENT_ERROR),
/* harmony export */   "METHOD_DEACTIVATED_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.METHOD_DEACTIVATED_ERROR),
/* harmony export */   "METHOD_DEACTIVATED_SEND_CONSENT_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.METHOD_DEACTIVATED_SEND_CONSENT_ERROR),
/* harmony export */   "NEW_VISITOR_NOT_READY": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.NEW_VISITOR_NOT_READY),
/* harmony export */   "NO_BATCHING_WITH_CONTINUOUS_CACHING_STRATEGY": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.NO_BATCHING_WITH_CONTINUOUS_CACHING_STRATEGY),
/* harmony export */   "PANIC_MODE_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PANIC_MODE_ERROR),
/* harmony export */   "PM_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PM_API_ITEM),
/* harmony export */   "PREDEFINED_CONTEXT_TYPE_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PREDEFINED_CONTEXT_TYPE_ERROR),
/* harmony export */   "PROCESS": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS),
/* harmony export */   "PROCESS_ACTIVE_MODIFICATION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_ACTIVE_MODIFICATION),
/* harmony export */   "PROCESS_CACHE_HIT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_CACHE_HIT),
/* harmony export */   "PROCESS_FLUSH_HIT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_FLUSH_HIT),
/* harmony export */   "PROCESS_GET_ALL_MODIFICATION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_GET_ALL_MODIFICATION),
/* harmony export */   "PROCESS_GET_CAMPAIGNS": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_GET_CAMPAIGNS),
/* harmony export */   "PROCESS_GET_MODIFICATION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_GET_MODIFICATION),
/* harmony export */   "PROCESS_GET_MODIFICATION_INFO": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_GET_MODIFICATION_INFO),
/* harmony export */   "PROCESS_INITIALIZATION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_INITIALIZATION),
/* harmony export */   "PROCESS_LOOKUP_HIT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_LOOKUP_HIT),
/* harmony export */   "PROCESS_MODIFICATIONS_FOR_CAMPAIGN": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_MODIFICATIONS_FOR_CAMPAIGN),
/* harmony export */   "PROCESS_NEW_VISITOR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_NEW_VISITOR),
/* harmony export */   "PROCESS_SEND_ACTIVATE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_SEND_ACTIVATE),
/* harmony export */   "PROCESS_SEND_HIT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_SEND_HIT),
/* harmony export */   "PROCESS_SYNCHRONIZED_MODIFICATION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_SYNCHRONIZED_MODIFICATION),
/* harmony export */   "PROCESS_UPDATE_CONTEXT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.PROCESS_UPDATE_CONTEXT),
/* harmony export */   "QT_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.QT_API_ITEM),
/* harmony export */   "REQUEST_TIME_OUT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.REQUEST_TIME_OUT),
/* harmony export */   "SCREEN_RESOLUTION_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SCREEN_RESOLUTION_API_ITEM),
/* harmony export */   "SDK_APP": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SDK_APP),
/* harmony export */   "SDK_LANGUAGE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SDK_LANGUAGE),
/* harmony export */   "SDK_STARTED_INFO": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SDK_STARTED_INFO),
/* harmony export */   "SDK_VERSION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SDK_VERSION),
/* harmony export */   "SEND_ACTIVATE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SEND_ACTIVATE),
/* harmony export */   "SEND_BATCH": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SEND_BATCH),
/* harmony export */   "SEND_CONTEXT_EVENT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SEND_CONTEXT_EVENT),
/* harmony export */   "SEND_HIT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SEND_HIT),
/* harmony export */   "SESSION_NUMBER": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SESSION_NUMBER),
/* harmony export */   "SL_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SL_ITEM),
/* harmony export */   "SM_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.SM_API_ITEM),
/* harmony export */   "TA_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TA_API_ITEM),
/* harmony export */   "TCC_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TCC_API_ITEM),
/* harmony export */   "TC_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TC_API_ITEM),
/* harmony export */   "TID_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TID_API_ITEM),
/* harmony export */   "TRACKER_MANAGER_MISSING_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TRACKER_MANAGER_MISSING_ERROR),
/* harmony export */   "TR_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TR_API_ITEM),
/* harmony export */   "TS_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TS_API_ITEM),
/* harmony export */   "TT_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TT_API_ITEM),
/* harmony export */   "TYPE_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TYPE_ERROR),
/* harmony export */   "TYPE_INTEGER_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.TYPE_INTEGER_ERROR),
/* harmony export */   "T_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.T_API_ITEM),
/* harmony export */   "URL_ACTIVATE_MODIFICATION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.URL_ACTIVATE_MODIFICATION),
/* harmony export */   "URL_CAMPAIGNS": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.URL_CAMPAIGNS),
/* harmony export */   "USER_EXPOSED_CAST_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.USER_EXPOSED_CAST_ERROR),
/* harmony export */   "USER_EXPOSED_FLAG_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.USER_EXPOSED_FLAG_ERROR),
/* harmony export */   "USER_IP_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.USER_IP_API_ITEM),
/* harmony export */   "USER_LANGUAGE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.USER_LANGUAGE),
/* harmony export */   "VARIATION_GROUP_ID_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.VARIATION_GROUP_ID_API_ITEM),
/* harmony export */   "VARIATION_GROUP_ID_API_ITEM_ACTIVATE": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.VARIATION_GROUP_ID_API_ITEM_ACTIVATE),
/* harmony export */   "VARIATION_ID_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.VARIATION_ID_API_ITEM),
/* harmony export */   "VISITOR_CACHE_VERSION": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.VISITOR_CACHE_VERSION),
/* harmony export */   "VISITOR_CONSENT": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.VISITOR_CONSENT),
/* harmony export */   "VISITOR_ID_API_ITEM": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.VISITOR_ID_API_ITEM),
/* harmony export */   "VISITOR_ID_ERROR": () => (/* reexport safe */ _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__.VISITOR_ID_ERROR),
/* harmony export */   "FlagshipStatus": () => (/* reexport safe */ _FlagshipStatus__WEBPACK_IMPORTED_MODULE_2__.FlagshipStatus),
/* harmony export */   "HitType": () => (/* reexport safe */ _HitType__WEBPACK_IMPORTED_MODULE_3__.HitType),
/* harmony export */   "BatchStrategy": () => (/* reexport safe */ _BatchStrategy__WEBPACK_IMPORTED_MODULE_4__.BatchStrategy)
/* harmony export */ });
/* harmony import */ var _LogLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LogLevel */ "./src/enum/LogLevel.ts");
/* harmony import */ var _FlagshipConstant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _FlagshipStatus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FlagshipStatus */ "./src/enum/FlagshipStatus.ts");
/* harmony import */ var _HitType__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HitType */ "./src/enum/HitType.ts");
/* harmony import */ var _BatchStrategy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BatchStrategy */ "./src/enum/BatchStrategy.ts");







/***/ }),

/***/ "./src/flag/FlagMetadata.ts":
/*!**********************************!*\
  !*** ./src/flag/FlagMetadata.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlagMetadata": () => (/* binding */ FlagMetadata)
/* harmony export */ });
class FlagMetadata {
    campaignId;
    variationGroupId;
    variationId;
    isReference;
    campaignType;
    slug;
    constructor(flagMetadata) {
        const { campaignId, variationGroupId, variationId, isReference, campaignType, slug } = flagMetadata;
        this.campaignId = campaignId;
        this.variationGroupId = variationGroupId;
        this.variationId = variationId;
        this.isReference = isReference;
        this.campaignType = campaignType;
        this.slug = slug;
    }
    static Empty() {
        return new FlagMetadata({
            campaignId: '',
            campaignType: '',
            variationId: '',
            variationGroupId: '',
            isReference: false,
            slug: null
        });
    }
}


/***/ }),

/***/ "./src/flag/Flags.ts":
/*!***************************!*\
  !*** ./src/flag/Flags.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Flag": () => (/* binding */ Flag)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _FlagMetadata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FlagMetadata */ "./src/flag/FlagMetadata.ts");


class Flag {
    _visitor;
    _key;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _defaultValue;
    constructor(param) {
        const { key, visitor, defaultValue } = param;
        this._key = key;
        this._visitor = visitor;
        this._defaultValue = defaultValue;
    }
    exists() {
        const flagDTO = this._visitor.flagsData.get(this._key);
        return !!(flagDTO?.campaignId && flagDTO.variationId && flagDTO.variationGroupId);
    }
    get metadata() {
        const flagDTO = this._visitor.flagsData.get(this._key);
        const metadata = new _FlagMetadata__WEBPACK_IMPORTED_MODULE_1__.FlagMetadata({
            campaignId: flagDTO?.campaignId || '',
            variationGroupId: flagDTO?.variationGroupId || '',
            variationId: flagDTO?.variationId || '',
            isReference: !!flagDTO?.isReference,
            campaignType: flagDTO?.campaignType || '',
            slug: flagDTO?.slug
        });
        if (!flagDTO) {
            return metadata;
        }
        return this._visitor.getFlagMetadata({
            metadata: metadata,
            hasSameType: !flagDTO.value || (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.hasSameType)(flagDTO.value, this._defaultValue),
            key: flagDTO.key
        });
    }
    userExposed() {
        const flagDTO = this._visitor.flagsData.get(this._key);
        return this._visitor.userExposed({ key: this._key, flag: flagDTO, defaultValue: this._defaultValue });
    }
    getValue(userExposed = true) {
        const flagDTO = this._visitor.flagsData.get(this._key);
        return this._visitor.getFlagValue({
            key: this._key,
            defaultValue: this._defaultValue,
            flag: flagDTO,
            userExposed
        });
    }
}


/***/ }),

/***/ "./src/flag/index.ts":
/*!***************************!*\
  !*** ./src/flag/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Flag": () => (/* reexport safe */ _Flags__WEBPACK_IMPORTED_MODULE_0__.Flag),
/* harmony export */   "FlagMetadata": () => (/* reexport safe */ _FlagMetadata__WEBPACK_IMPORTED_MODULE_1__.FlagMetadata)
/* harmony export */ });
/* harmony import */ var _Flags__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Flags */ "./src/flag/Flags.ts");
/* harmony import */ var _FlagMetadata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FlagMetadata */ "./src/flag/FlagMetadata.ts");




/***/ }),

/***/ "./src/hit/Activate.ts":
/*!*****************************!*\
  !*** ./src/hit/Activate.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Activate": () => (/* binding */ Activate)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");


const ERROR_MESSAGE = 'variationGroupId and variationId are required';
class Activate extends _HitAbstract__WEBPACK_IMPORTED_MODULE_1__.HitAbstract {
    _variationGroupId;
    _variationId;
    constructor(param) {
        super({
            type: 'ACTIVATE',
            userIp: param.userIp,
            screenResolution: param.screenResolution,
            locale: param.locale,
            sessionNumber: param.sessionNumber,
            visitorId: param.visitorId,
            anonymousId: param.anonymousId
        });
        this.variationGroupId = param.variationGroupId;
        this.variationId = param.variationId;
    }
    get variationGroupId() {
        return this._variationGroupId;
    }
    set variationGroupId(v) {
        this._variationGroupId = v;
    }
    get variationId() {
        return this._variationId;
    }
    set variationId(v) {
        this._variationId = v;
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()) && this.variationGroupId && this.variationId);
    }
    toApiKeys() {
        const apiKeys = {
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.VISITOR_ID_API_ITEM]: this.anonymousId || this.visitorId,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.VARIATION_ID_API_ITEM]: this.variationId,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.VARIATION_GROUP_ID_API_ITEM_ACTIVATE]: this.variationGroupId,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.CUSTOMER_ENV_ID_API_ACTIVATE]: this.config.envId,
            [_enum_index__WEBPACK_IMPORTED_MODULE_0__.ANONYMOUS_ID]: null
        };
        if (this.visitorId && this.anonymousId) {
            apiKeys[_enum_index__WEBPACK_IMPORTED_MODULE_0__.VISITOR_ID_API_ITEM] = this.visitorId;
            apiKeys[_enum_index__WEBPACK_IMPORTED_MODULE_0__.ANONYMOUS_ID] = this.anonymousId;
        }
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            variationGroupId: this.variationGroupId,
            variationId: this.variationId
        };
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/Batch.ts":
/*!**************************!*\
  !*** ./src/hit/Batch.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BATCH": () => (/* binding */ BATCH),
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Batch": () => (/* binding */ Batch)
/* harmony export */ });
/* harmony import */ var _enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");


const BATCH = 'BATCH';
const ERROR_MESSAGE = 'Please check required fields';
class Batch extends _HitAbstract__WEBPACK_IMPORTED_MODULE_1__.HitAbstract {
    _hits;
    get hits() {
        return this._hits;
    }
    set hits(v) {
        this._hits = v;
    }
    constructor(params) {
        super({ ...params, visitorId: '', anonymousId: '', type: BATCH });
        this.hits = params.hits;
    }
    isReady() {
        return !!(super.isReady() &&
            this.hits &&
            this.hits.length > 0 &&
            this.hits.every(hit => hit.isReady(false)));
    }
    toApiKeys() {
        const apiKeys = {
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.DS_API_ITEM]: this.ds,
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.CUSTOMER_ENV_ID_API_ITEM]: `${this.config?.envId}`,
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.T_API_ITEM]: this.type,
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.QT_API_ITEM]: Date.now() - this.createdAt
        };
        apiKeys.h = this.hits.map(hit => {
            const hitKeys = hit.toApiKeys();
            delete hitKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.DS_API_ITEM];
            return hitKeys;
        });
        return apiKeys;
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/Campaign.ts":
/*!*****************************!*\
  !*** ./src/hit/Campaign.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Campaign": () => (/* binding */ Campaign)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");


const ERROR_MESSAGE = 'variationGroupId and campaignId are required';
class Campaign extends _HitAbstract__WEBPACK_IMPORTED_MODULE_1__.HitAbstract {
    _variationGroupId;
    _campaignId;
    constructor(param) {
        super({
            type: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CAMPAIGN,
            userIp: param.userIp,
            screenResolution: param.screenResolution,
            locale: param.locale,
            sessionNumber: param.sessionNumber,
            visitorId: param.visitorId,
            anonymousId: param.anonymousId
        });
        this.variationGroupId = param.variationGroupId;
        this.campaignId = param.campaignId;
    }
    get variationGroupId() {
        return this._variationGroupId;
    }
    set variationGroupId(v) {
        this._variationGroupId = v;
    }
    get campaignId() {
        return this._campaignId;
    }
    set campaignId(v) {
        this._campaignId = v;
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()) && this.variationGroupId && this.campaignId);
    }
    toApiKeys() {
        const apiKeys = super.toApiKeys();
        apiKeys[_enum_index__WEBPACK_IMPORTED_MODULE_0__.VARIATION_GROUP_ID_API_ITEM] = this.variationGroupId;
        apiKeys[_enum_index__WEBPACK_IMPORTED_MODULE_0__.CAMPAIGN_ID] = this.campaignId;
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            variationGroupId: this.variationGroupId,
            campaignId: this.campaignId
        };
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/Consent.ts":
/*!****************************!*\
  !*** ./src/hit/Consent.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Consent": () => (/* binding */ Consent)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");


const ERROR_MESSAGE = 'visitorConsent is required';
class Consent extends _HitAbstract__WEBPACK_IMPORTED_MODULE_1__.HitAbstract {
    _visitorConsent;
    constructor(param) {
        super({
            type: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.CONSENT,
            userIp: param.userIp,
            screenResolution: param.screenResolution,
            locale: param.locale,
            sessionNumber: param.sessionNumber,
            visitorId: param.visitorId,
            anonymousId: param.anonymousId
        });
        this.visitorConsent = param.visitorConsent;
    }
    get visitorConsent() {
        return this._visitorConsent;
    }
    set visitorConsent(v) {
        this._visitorConsent = v;
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()));
    }
    toApiKeys() {
        const apiKeys = super.toApiKeys();
        apiKeys[_enum_index__WEBPACK_IMPORTED_MODULE_0__.VISITOR_CONSENT] = this.visitorConsent;
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            visitorConsent: this.visitorConsent
        };
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/Event.ts":
/*!**************************!*\
  !*** ./src/hit/Event.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "CATEGORY_ERROR": () => (/* binding */ CATEGORY_ERROR),
/* harmony export */   "VALUE_FIELD_ERROR": () => (/* binding */ VALUE_FIELD_ERROR),
/* harmony export */   "EventCategory": () => (/* binding */ EventCategory),
/* harmony export */   "Event": () => (/* binding */ Event)
/* harmony export */ });
/* harmony import */ var _enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _enum_HitType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/HitType */ "./src/enum/HitType.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");




const ERROR_MESSAGE = 'event category and event action are required';
const CATEGORY_ERROR = 'The category value must be either EventCategory::ACTION_TRACKING or EventCategory::ACTION_TRACKING';
const VALUE_FIELD_ERROR = 'value must be an integer and be >= 0';
var EventCategory;
(function (EventCategory) {
    EventCategory["ACTION_TRACKING"] = "Action Tracking";
    EventCategory["USER_ENGAGEMENT"] = "User Engagement";
})(EventCategory || (EventCategory = {}));
class Event extends _HitAbstract__WEBPACK_IMPORTED_MODULE_3__.HitAbstract {
    _category;
    _action;
    _label;
    _value;
    _custom;
    get category() {
        return this._category;
    }
    /**
     * Specify Action Tracking or User Engagement.
     */
    set category(v) {
        if (!(Object.values(EventCategory).includes(v))) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, CATEGORY_ERROR, 'category');
            return;
        }
        this._category = v;
    }
    get action() {
        return this._action;
    }
    /**
     * Specify Event name that will also serve as the KPI
     * that you will have inside your reporting
     */
    set action(v) {
        if (!this.isNotEmptyString(v, 'action')) {
            return;
        }
        this._action = v;
    }
    get label() {
        return this._label;
    }
    /**
     * Specify additional description of event.
     */
    set label(v) {
        if (!this.isNotEmptyString(v, 'label')) {
            return;
        }
        this._label = v;
    }
    get value() {
        return this._value;
    }
    /**
     * Specify the monetary value associated with an event
     * (e.g. you earn 10 to 100 euros depending on the quality of lead generated).
     *
     * <br/> NOTE: this value must be non-negative.
     */
    set value(v) {
        if (!Number.isInteger(v) || v < 0) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, VALUE_FIELD_ERROR, 'value');
            return;
        }
        this._value = v;
    }
    constructor(param) {
        super({
            type: _enum_HitType__WEBPACK_IMPORTED_MODULE_1__.HitType.EVENT,
            userIp: param.userIp,
            screenResolution: param.screenResolution,
            locale: param.locale,
            sessionNumber: param.sessionNumber,
            visitorId: param.visitorId,
            anonymousId: param.anonymousId
        });
        const { category, action, label, value } = param;
        this.category = category;
        this.action = action;
        if (label) {
            this.label = label;
        }
        if (value) {
            this.value = value;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toApiKeys() {
        const apiKeys = super.toApiKeys();
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.EVENT_CATEGORY_API_ITEM] = this.category;
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.EVENT_ACTION_API_ITEM] = this.action;
        if (this.label) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.EVENT_LABEL_API_ITEM] = this.label;
        }
        if (this.value) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.EVENT_VALUE_API_ITEM] = this.value;
        }
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            category: this.category,
            action: this.action,
            label: this.label,
            value: this.value
        };
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()) && this.category && this.action);
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/HitAbstract.ts":
/*!********************************!*\
  !*** ./src/hit/HitAbstract.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HitAbstract": () => (/* binding */ HitAbstract)
/* harmony export */ });
/* harmony import */ var _enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");


class HitAbstract {
    _visitorId;
    _config;
    _type;
    _ds;
    _anonymousId;
    _userIp;
    _screenResolution;
    _locale;
    _sessionNumber;
    _key;
    _createdAt;
    get key() {
        return this._key;
    }
    set key(v) {
        this._key = v;
    }
    get sessionNumber() {
        return this._sessionNumber;
    }
    set sessionNumber(v) {
        this._sessionNumber = v;
    }
    get locale() {
        return this._locale;
    }
    set locale(v) {
        this._locale = v;
    }
    get screenResolution() {
        return this._screenResolution;
    }
    set screenResolution(v) {
        this._screenResolution = v;
    }
    get userIp() {
        return this._userIp;
    }
    set userIp(v) {
        this._userIp = v;
    }
    get anonymousId() {
        return this._anonymousId;
    }
    set anonymousId(v) {
        this._anonymousId = v;
    }
    get visitorId() {
        return this._visitorId;
    }
    set visitorId(v) {
        this._visitorId = v;
    }
    get ds() {
        return this._ds;
    }
    set ds(v) {
        this._ds = v;
    }
    get type() {
        return this._type;
    }
    get config() {
        return this._config;
    }
    set config(v) {
        this._config = v;
    }
    get createdAt() {
        return this._createdAt;
    }
    set createdAt(v) {
        this._createdAt = v;
    }
    constructor(hit) {
        const { type, userIp, screenResolution, locale, sessionNumber, visitorId, anonymousId } = hit;
        this._type = type;
        if (userIp) {
            this.userIp = userIp;
        }
        if (screenResolution) {
            this.screenResolution = screenResolution;
        }
        if (locale) {
            this.locale = locale;
        }
        if (sessionNumber) {
            this.sessionNumber = sessionNumber;
        }
        this.visitorId = visitorId;
        this._anonymousId = anonymousId || null;
        this.createdAt = Date.now();
    }
    /**
     * Return true if value is a string and not empty, otherwise return false
     * @param value
     * @param itemName
     * @returns
     */
    isNotEmptyString(value, itemName) {
        if (!value || typeof value !== 'string') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TYPE_ERROR, itemName, 'string'), itemName);
            return false;
        }
        return true;
    }
    isNumeric(value, itemName) {
        if (!value || typeof value !== 'number') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TYPE_ERROR, itemName, 'number'), itemName);
            return false;
        }
        return true;
    }
    isInteger(value, itemName) {
        if (!Number.isInteger(value)) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TYPE_ERROR, itemName, 'integer'), itemName);
            return false;
        }
        return true;
    }
    /**
     * Return an object with Api parameters as keys
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toApiKeys() {
        const apiKeys = {
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.VISITOR_ID_API_ITEM]: this.visitorId,
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.DS_API_ITEM]: this.ds,
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.CUSTOMER_ENV_ID_API_ITEM]: `${this.config?.envId}`,
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.T_API_ITEM]: this.type,
            [_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.QT_API_ITEM]: Date.now() - this._createdAt
        };
        if (this.userIp) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.USER_IP_API_ITEM] = this.userIp;
        }
        if (this.screenResolution) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.SCREEN_RESOLUTION_API_ITEM] = this.screenResolution;
        }
        if (this.locale) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.USER_LANGUAGE] = this.locale;
        }
        if (this.sessionNumber) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.SESSION_NUMBER] = this.sessionNumber;
        }
        if (this.visitorId && this.anonymousId) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.VISITOR_ID_API_ITEM] = this.anonymousId;
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.CUSTOMER_UID] = this.visitorId;
        }
        else {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.VISITOR_ID_API_ITEM] = this.anonymousId || this.visitorId;
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.CUSTOMER_UID] = null;
        }
        return apiKeys;
    }
    toObject() {
        return {
            key: this.key,
            visitorId: this.visitorId,
            ds: this.ds,
            type: this.type,
            userIp: this.userIp,
            screenResolution: this.screenResolution,
            locale: this.locale,
            sessionNumber: this.sessionNumber,
            anonymousId: this.anonymousId,
            createdAt: this.createdAt
        };
    }
    /**
     * Return true if all required attributes are given, otherwise return false
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReady(_checkParent = true) {
        return !!(this.visitorId &&
            this.ds &&
            this.config &&
            this.config.envId &&
            this.type);
    }
}


/***/ }),

/***/ "./src/hit/Item.ts":
/*!*************************!*\
  !*** ./src/hit/Item.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Item": () => (/* binding */ Item)
/* harmony export */ });
/* harmony import */ var _enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _enum_HitType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/HitType */ "./src/enum/HitType.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");



const ERROR_MESSAGE = 'Transaction Id, Item name and item code are required';
class Item extends _HitAbstract__WEBPACK_IMPORTED_MODULE_2__.HitAbstract {
    _transactionId;
    _productName;
    _productSku;
    _itemPrice;
    _itemQuantity;
    _itemCategory;
    get transactionId() {
        return this._transactionId;
    }
    /**
     * Specify transaction unique identifier.
     */
    set transactionId(v) {
        if (!this.isNotEmptyString(v, 'transactionId')) {
            return;
        }
        this._transactionId = v;
    }
    get productName() {
        return this._productName;
    }
    /**
     * Specify name of the item product.
     */
    set productName(v) {
        if (!this.isNotEmptyString(v, 'productName')) {
            return;
        }
        this._productName = v;
    }
    get productSku() {
        return this._productSku;
    }
    /**
     * Specify the SKU or item code.
     */
    set productSku(v) {
        if (!this.isNotEmptyString(v, 'productSku')) {
            return;
        }
        this._productSku = v;
    }
    get itemPrice() {
        return this._itemPrice;
    }
    /**
     * Specify the price for a single item
     */
    set itemPrice(v) {
        if (!this.isNumeric(v, 'itemPrice')) {
            return;
        }
        this._itemPrice = v;
    }
    get itemQuantity() {
        return this._itemQuantity;
    }
    /**
     * Specify the number of items purchased.
     */
    set itemQuantity(v) {
        if (!this.isInteger(v, 'itemQuantity')) {
            return;
        }
        this._itemQuantity = Math.trunc(v);
    }
    get itemCategory() {
        return this._itemCategory;
    }
    /**
     * Specify the category that the item belongs to
     */
    set itemCategory(v) {
        if (!this.isNotEmptyString(v, 'itemCategory')) {
            return;
        }
        this._itemCategory = v;
    }
    /**
     *Item constructor.
     * @param transactionId : Transaction unique identifier.
     * @param productName : Name of the item product.
     * @param productSku : The SKU or item code.
     */
    constructor(param) {
        super({
            type: _enum_HitType__WEBPACK_IMPORTED_MODULE_1__.HitType.ITEM,
            userIp: param.userIp,
            screenResolution: param.screenResolution,
            locale: param.locale,
            sessionNumber: param.sessionNumber,
            visitorId: param.visitorId,
            anonymousId: param.anonymousId
        });
        const { transactionId, productName, productSku, itemCategory, itemPrice, itemQuantity } = param;
        this.transactionId = transactionId;
        this.productName = productName;
        this.productSku = productSku;
        if (itemCategory) {
            this.itemCategory = itemCategory;
        }
        if (itemPrice) {
            this.itemPrice = itemPrice;
        }
        if (itemQuantity) {
            this.itemQuantity = itemQuantity;
        }
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()) &&
            this.transactionId &&
            this.productName &&
            this.productSku);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toApiKeys() {
        const apiKeys = super.toApiKeys();
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TID_API_ITEM] = this.transactionId;
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.IN_API_ITEM] = this.productName;
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.IC_API_ITEM] = this.productSku;
        if (this.itemPrice) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.IP_API_ITEM] = this.itemPrice;
        }
        if (this.itemQuantity) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.IQ_API_ITEM] = this.itemQuantity;
        }
        if (this.itemCategory) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.IV_API_ITEM] = this.itemCategory;
        }
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            transactionId: this.transactionId,
            productName: this.productName,
            productSku: this.productSku,
            itemPrice: this.itemPrice,
            itemQuantity: this.itemQuantity,
            itemCategory: this.itemCategory
        };
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/Page.ts":
/*!*************************!*\
  !*** ./src/hit/Page.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Page": () => (/* binding */ Page)
/* harmony export */ });
/* harmony import */ var _enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _enum_HitType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/HitType */ "./src/enum/HitType.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");



const ERROR_MESSAGE = 'documentLocation url is required';
class Page extends _HitAbstract__WEBPACK_IMPORTED_MODULE_2__.HitAbstract {
    _documentLocation;
    get documentLocation() {
        return this._documentLocation;
    }
    set documentLocation(v) {
        if (!this.isNotEmptyString(v, 'documentLocation')) {
            return;
        }
        this._documentLocation = v;
    }
    constructor(page) {
        super({
            type: _enum_HitType__WEBPACK_IMPORTED_MODULE_1__.HitType.PAGE_VIEW,
            userIp: page.userIp,
            screenResolution: page.screenResolution,
            locale: page.locale,
            sessionNumber: page.sessionNumber,
            visitorId: page.visitorId,
            anonymousId: page.anonymousId
        });
        this.documentLocation = page.documentLocation;
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()) && this.documentLocation);
    }
    toApiKeys() {
        const apiKeys = super.toApiKeys();
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.DL_API_ITEM] = this.documentLocation;
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            documentLocation: this.documentLocation
        };
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/Screen.ts":
/*!***************************!*\
  !*** ./src/hit/Screen.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Screen": () => (/* binding */ Screen)
/* harmony export */ });
/* harmony import */ var _enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _enum_HitType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/HitType */ "./src/enum/HitType.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");



const ERROR_MESSAGE = 'Screen name is required';
class Screen extends _HitAbstract__WEBPACK_IMPORTED_MODULE_2__.HitAbstract {
    _documentLocation;
    get documentLocation() {
        return this._documentLocation;
    }
    set documentLocation(v) {
        if (!this.isNotEmptyString(v, 'documentLocation')) {
            return;
        }
        this._documentLocation = v;
    }
    constructor(param) {
        super({
            type: _enum_HitType__WEBPACK_IMPORTED_MODULE_1__.HitType.SCREEN_VIEW,
            userIp: param.userIp,
            screenResolution: param.screenResolution,
            locale: param.locale,
            sessionNumber: param.sessionNumber,
            visitorId: param.visitorId,
            anonymousId: param.anonymousId
        });
        this.documentLocation = param.documentLocation;
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()) && this.documentLocation);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toApiKeys() {
        const apiKeys = super.toApiKeys();
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.DL_API_ITEM] = this.documentLocation;
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            documentLocation: this.documentLocation
        };
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/Segment.ts":
/*!****************************!*\
  !*** ./src/hit/Segment.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Segment": () => (/* binding */ Segment)
/* harmony export */ });
/* harmony import */ var _enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _enum_HitType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/HitType */ "./src/enum/HitType.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");



const ERROR_MESSAGE = 'sl is required';
class Segment extends _HitAbstract__WEBPACK_IMPORTED_MODULE_2__.HitAbstract {
    _sl;
    get sl() {
        return this._sl;
    }
    set sl(v) {
        this._sl = v;
    }
    constructor(param) {
        super({
            type: _enum_HitType__WEBPACK_IMPORTED_MODULE_1__.HitType.SEGMENT,
            userIp: param.userIp,
            screenResolution: param.screenResolution,
            locale: param.locale,
            sessionNumber: param.sessionNumber,
            visitorId: param.visitorId,
            anonymousId: param.anonymousId
        });
        this.sl = param.sl;
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()) && this.sl);
    }
    toApiKeys() {
        const apiKeys = super.toApiKeys();
        const context = {};
        Object.entries(this.sl).forEach(([key, value]) => {
            context[key] = value.toString();
        });
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.SL_ITEM] = context;
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            sl: this.sl
        };
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/Transaction.ts":
/*!********************************!*\
  !*** ./src/hit/Transaction.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CURRENCY_ERROR": () => (/* binding */ CURRENCY_ERROR),
/* harmony export */   "ERROR_MESSAGE": () => (/* binding */ ERROR_MESSAGE),
/* harmony export */   "Transaction": () => (/* binding */ Transaction)
/* harmony export */ });
/* harmony import */ var _enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/FlagshipConstant */ "./src/enum/FlagshipConstant.ts");
/* harmony import */ var _enum_HitType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/HitType */ "./src/enum/HitType.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");
/* eslint-disable @typescript-eslint/no-explicit-any */




const CURRENCY_ERROR = '{0} must be a string and have exactly 3 letters';
const ERROR_MESSAGE = 'Transaction Id and Transaction affiliation are required';
class Transaction extends _HitAbstract__WEBPACK_IMPORTED_MODULE_3__.HitAbstract {
    _transactionId;
    _affiliation;
    _taxes;
    _currency;
    _couponCode;
    _itemCount;
    _shippingMethod;
    _paymentMethod;
    _totalRevenue;
    _shippingCosts;
    get transactionId() {
        return this._transactionId;
    }
    set transactionId(v) {
        if (!this.isNotEmptyString(v, 'transactionId')) {
            return;
        }
        this._transactionId = v;
    }
    get affiliation() {
        return this._affiliation;
    }
    set affiliation(v) {
        if (!this.isNotEmptyString(v, 'affiliation')) {
            return;
        }
        this._affiliation = v;
    }
    get taxes() {
        return this._taxes;
    }
    set taxes(v) {
        if (!this.isNumeric(v, 'taxes')) {
            return;
        }
        this._taxes = v;
    }
    get currency() {
        return this._currency;
    }
    set currency(v) {
        if (!v || typeof v !== 'string' || v.length !== 3) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(CURRENCY_ERROR, 'currency'), 'currency');
            return;
        }
        this._currency = v;
    }
    get couponCode() {
        return this._couponCode;
    }
    set couponCode(v) {
        if (!this.isNotEmptyString(v, 'couponCode')) {
            return;
        }
        this._couponCode = v;
    }
    get itemCount() {
        return this._itemCount;
    }
    set itemCount(v) {
        if (!this.isInteger(v, 'itemCount')) {
            return;
        }
        this._itemCount = Math.trunc(v);
    }
    get shippingMethod() {
        return this._shippingMethod;
    }
    set shippingMethod(v) {
        if (!this.isNotEmptyString(v, 'shippingMethod')) {
            return;
        }
        this._shippingMethod = v;
    }
    get paymentMethod() {
        return this._paymentMethod;
    }
    set paymentMethod(v) {
        if (!this.isNotEmptyString(v, 'paymentMethod')) {
            return;
        }
        this._paymentMethod = v;
    }
    get totalRevenue() {
        return this._totalRevenue;
    }
    set totalRevenue(v) {
        if (!this.isNumeric(v, 'totalRevenue')) {
            return;
        }
        this._totalRevenue = v;
    }
    get shippingCosts() {
        return this._shippingCosts;
    }
    set shippingCosts(v) {
        if (!this.isNumeric(v, 'shippingCosts')) {
            return;
        }
        this._shippingCosts = v;
    }
    constructor(param) {
        super({
            type: _enum_HitType__WEBPACK_IMPORTED_MODULE_1__.HitType.TRANSACTION,
            userIp: param.userIp,
            screenResolution: param.screenResolution,
            locale: param.locale,
            sessionNumber: param.sessionNumber,
            visitorId: param.visitorId,
            anonymousId: param.anonymousId
        });
        const { transactionId, affiliation, taxes, currency, couponCode, itemCount, shippingMethod, paymentMethod, totalRevenue, shippingCosts } = param;
        this.transactionId = transactionId;
        this.affiliation = affiliation;
        if (taxes) {
            this.taxes = taxes;
        }
        if (currency) {
            this.currency = currency;
        }
        if (couponCode) {
            this.couponCode = couponCode;
        }
        if (itemCount) {
            this.itemCount = itemCount;
        }
        if (shippingMethod) {
            this.shippingMethod = shippingMethod;
        }
        if (paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
        if (totalRevenue) {
            this.totalRevenue = totalRevenue;
        }
        if (shippingCosts) {
            this.shippingCosts = shippingCosts;
        }
    }
    isReady(checkParent = true) {
        return !!((!checkParent || super.isReady()) && this.transactionId && this.affiliation);
    }
    toApiKeys() {
        const apiKeys = super.toApiKeys();
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TID_API_ITEM] = this.transactionId;
        apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TA_API_ITEM] = this.affiliation;
        if (this.taxes) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TT_API_ITEM] = this.taxes;
        }
        if (this.currency) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TC_API_ITEM] = this.currency;
        }
        if (this.couponCode) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TCC_API_ITEM] = this.couponCode;
        }
        if (this.itemCount) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.ICN_API_ITEM] = this.itemCount;
        }
        if (this.shippingMethod) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.SM_API_ITEM] = this.shippingMethod;
        }
        if (this.paymentMethod) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.PM_API_ITEM] = this.paymentMethod;
        }
        if (this.totalRevenue) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TR_API_ITEM] = this.totalRevenue;
        }
        if (this.shippingCosts) {
            apiKeys[_enum_FlagshipConstant__WEBPACK_IMPORTED_MODULE_0__.TS_API_ITEM] = this.shippingCosts;
        }
        return apiKeys;
    }
    toObject() {
        return {
            ...super.toObject(),
            transactionId: this.transactionId,
            affiliation: this.affiliation,
            taxes: this.taxes,
            currency: this.currency,
            couponCode: this.couponCode,
            itemCount: this.itemCount,
            shippingMethod: this.shippingMethod,
            paymentMethod: this.paymentMethod,
            totalRevenue: this.totalRevenue,
            shippingCosts: this.shippingCosts
        };
    }
    getErrorMessage() {
        return ERROR_MESSAGE;
    }
}


/***/ }),

/***/ "./src/hit/index.ts":
/*!**************************!*\
  !*** ./src/hit/index.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Event": () => (/* reexport safe */ _Event__WEBPACK_IMPORTED_MODULE_0__.Event),
/* harmony export */   "EventCategory": () => (/* reexport safe */ _Event__WEBPACK_IMPORTED_MODULE_0__.EventCategory),
/* harmony export */   "Item": () => (/* reexport safe */ _Item__WEBPACK_IMPORTED_MODULE_1__.Item),
/* harmony export */   "Page": () => (/* reexport safe */ _Page__WEBPACK_IMPORTED_MODULE_2__.Page),
/* harmony export */   "Screen": () => (/* reexport safe */ _Screen__WEBPACK_IMPORTED_MODULE_3__.Screen),
/* harmony export */   "Transaction": () => (/* reexport safe */ _Transaction__WEBPACK_IMPORTED_MODULE_4__.Transaction),
/* harmony export */   "HitAbstract": () => (/* reexport safe */ _HitAbstract__WEBPACK_IMPORTED_MODULE_5__.HitAbstract),
/* harmony export */   "Consent": () => (/* reexport safe */ _Consent__WEBPACK_IMPORTED_MODULE_6__.Consent),
/* harmony export */   "Campaign": () => (/* reexport safe */ _Campaign__WEBPACK_IMPORTED_MODULE_7__.Campaign),
/* harmony export */   "Segment": () => (/* reexport safe */ _Segment__WEBPACK_IMPORTED_MODULE_8__.Segment)
/* harmony export */ });
/* harmony import */ var _Event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Event */ "./src/hit/Event.ts");
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Item */ "./src/hit/Item.ts");
/* harmony import */ var _Page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Page */ "./src/hit/Page.ts");
/* harmony import */ var _Screen__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Screen */ "./src/hit/Screen.ts");
/* harmony import */ var _Transaction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Transaction */ "./src/hit/Transaction.ts");
/* harmony import */ var _HitAbstract__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./HitAbstract */ "./src/hit/HitAbstract.ts");
/* harmony import */ var _Consent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Consent */ "./src/hit/Consent.ts");
/* harmony import */ var _Campaign__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Campaign */ "./src/hit/Campaign.ts");
/* harmony import */ var _Segment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Segment */ "./src/hit/Segment.ts");











/***/ }),

/***/ "./src/main/Flagship.ts":
/*!******************************!*\
  !*** ./src/main/Flagship.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Flagship": () => (/* binding */ Flagship)
/* harmony export */ });
/* harmony import */ var _visitor_Visitor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../visitor/Visitor */ "./src/visitor/Visitor.ts");
/* harmony import */ var _enum_FlagshipStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/FlagshipStatus */ "./src/enum/FlagshipStatus.ts");
/* harmony import */ var _config_FlagshipConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/FlagshipConfig */ "./src/config/FlagshipConfig.ts");
/* harmony import */ var _config_DecisionApiConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/DecisionApiConfig */ "./src/config/DecisionApiConfig.ts");
/* harmony import */ var _config_ConfigManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config/ConfigManager */ "./src/config/ConfigManager.ts");
/* harmony import */ var _decision_ApiManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../decision/ApiManager */ "./src/decision/ApiManager.ts");
/* harmony import */ var _api_TrackingManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../api/TrackingManager */ "./src/api/TrackingManager.ts");
/* harmony import */ var _utils_FlagshipLogManager__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/FlagshipLogManager */ "./src/utils/FlagshipLogManager.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _visitor_VisitorDelegate__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../visitor/VisitorDelegate */ "./src/visitor/VisitorDelegate.ts");
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../config/index */ "./src/config/index.ts");
/* harmony import */ var _decision_BucketingManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../decision/BucketingManager */ "./src/decision/BucketingManager.ts");
/* harmony import */ var _utils_MurmurHash__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/MurmurHash */ "./src/utils/MurmurHash.ts");
/* harmony import */ var _utils_HttpClient__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../utils/HttpClient */ "./src/utils/HttpClient.ts");
/* harmony import */ var _cache_DefaultHitCache__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../cache/DefaultHitCache */ "./src/cache/DefaultHitCache.ts");
/* harmony import */ var _cache_DefaultVisitorCache__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../cache/DefaultVisitorCache */ "./src/cache/DefaultVisitorCache.ts");
/* harmony import */ var _sdkVersion__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../sdkVersion */ "./src/sdkVersion.ts");


















class Flagship {
    // eslint-disable-next-line no-use-before-define
    static _instance;
    _configManger;
    _config;
    _status;
    _visitorInstance;
    set configManager(value) {
        this._configManger = value;
    }
    get configManager() {
        return this._configManger;
    }
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        // singleton
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }
    setStatus(status) {
        const statusChanged = this.getConfig().statusChangedCallback;
        if (this._status !== status) {
            if (!this.getConfig().isCloudFlareClient) {
                if (status === _enum_FlagshipStatus__WEBPACK_IMPORTED_MODULE_1__.FlagshipStatus.READY) {
                    this.configManager?.trackingManager?.startBatchingLoop();
                }
                else {
                    this.configManager?.trackingManager?.stopBatchingLoop();
                }
            }
            if (this.getConfig() && statusChanged) {
                this._status = status;
                statusChanged(status);
                return;
            }
        }
        this._status = status;
    }
    /**
     * Return current status of Flagship SDK.
     */
    static getStatus() {
        return this.getInstance()._status;
    }
    /**
     * Return current status of Flagship SDK.
     */
    getStatus() {
        return this._status;
    }
    /**
     * Return the current config set by the customer and used by the SDK.
     */
    static getConfig() {
        return this.getInstance()._config;
    }
    /**
     * Return the current config set by the customer and used by the SDK.
     */
    getConfig() {
        return this._config;
    }
    /**
     * Return the last visitor created if isNewInstance key is false. Return undefined otherwise.
     */
    getVisitor() {
        return this._visitorInstance;
    }
    /**
     * Return the last visitor created if isNewInstance key is false. Return undefined otherwise.
     */
    static getVisitor() {
        return this.getInstance().getVisitor();
    }
    buildConfig(config) {
        if (config instanceof _config_FlagshipConfig__WEBPACK_IMPORTED_MODULE_2__.FlagshipConfig) {
            return config;
        }
        let newConfig;
        if (config?.decisionMode === _config_FlagshipConfig__WEBPACK_IMPORTED_MODULE_2__.DecisionMode.BUCKETING) {
            newConfig = new _config_index__WEBPACK_IMPORTED_MODULE_11__.BucketingConfig(config);
        }
        else {
            newConfig = new _config_DecisionApiConfig__WEBPACK_IMPORTED_MODULE_3__.DecisionApiConfig(config);
        }
        return newConfig;
    }
    buildDecisionManager(flagship, config, httpClient) {
        let decisionManager;
        const setStatus = (status) => {
            flagship.setStatus(status);
        };
        if (config.decisionMode === _config_FlagshipConfig__WEBPACK_IMPORTED_MODULE_2__.DecisionMode.BUCKETING || config.isCloudFlareClient) {
            decisionManager = new _decision_BucketingManager__WEBPACK_IMPORTED_MODULE_12__.BucketingManager(httpClient, config, new _utils_MurmurHash__WEBPACK_IMPORTED_MODULE_13__.MurmurHash());
            const bucketingManager = decisionManager;
            decisionManager.statusChangedCallback(setStatus);
            if (!config.isCloudFlareClient) {
                bucketingManager.startPolling();
            }
        }
        else {
            decisionManager = new _decision_ApiManager__WEBPACK_IMPORTED_MODULE_5__.ApiManager(httpClient, config);
            decisionManager.statusChangedCallback(setStatus);
        }
        return decisionManager;
    }
    /**
     * Start the flagship SDK, with a custom configuration implementation
     * @param {string} envId : Environment id provided by Flagship.
     * @param {string} apiKey : Secure api key provided by Flagship.
     * @param {IFlagshipConfig} config : (optional) SDK configuration.
     */
    static start(envId, apiKey, config) {
        const flagship = this.getInstance();
        config = flagship.buildConfig(config);
        const configCheck = {
            useCustomLogManager: !!config.logManager,
            useCustomCacheManager: !!config.hitCacheImplementation || !!config.visitorCacheImplementation
        };
        config.envId = envId;
        config.apiKey = apiKey;
        flagship._config = config;
        flagship.setStatus(_enum_FlagshipStatus__WEBPACK_IMPORTED_MODULE_1__.FlagshipStatus.STARTING);
        // check custom logger
        if (!config.logManager) {
            config.logManager = new _utils_FlagshipLogManager__WEBPACK_IMPORTED_MODULE_7__.FlagshipLogManager(config.isCloudFlareClient);
        }
        if (!envId || !apiKey) {
            flagship.setStatus(_enum_FlagshipStatus__WEBPACK_IMPORTED_MODULE_1__.FlagshipStatus.NOT_INITIALIZED);
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__.logError)(config, _enum_index__WEBPACK_IMPORTED_MODULE_9__.INITIALIZATION_PARAM_ERROR, _enum_index__WEBPACK_IMPORTED_MODULE_9__.PROCESS_INITIALIZATION);
            return flagship;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!config.hitCacheImplementation && (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__.isBrowser)()) {
            configCheck.useCustomLogManager = false;
            config.hitCacheImplementation = new _cache_DefaultHitCache__WEBPACK_IMPORTED_MODULE_15__.DefaultHitCache();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!config.visitorCacheImplementation && (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__.isBrowser)()) {
            config.visitorCacheImplementation = new _cache_DefaultVisitorCache__WEBPACK_IMPORTED_MODULE_16__.DefaultVisitorCache();
        }
        let decisionManager = flagship.configManager?.decisionManager;
        if (typeof decisionManager === 'object' && decisionManager instanceof _decision_BucketingManager__WEBPACK_IMPORTED_MODULE_12__.BucketingManager && !config.isCloudFlareClient) {
            decisionManager.stopPolling();
        }
        const httpClient = new _utils_HttpClient__WEBPACK_IMPORTED_MODULE_14__.HttpClient();
        decisionManager = flagship.buildDecisionManager(flagship, config, httpClient);
        let trackingManager = flagship.configManager?.trackingManager;
        if (!trackingManager) {
            trackingManager = new _api_TrackingManager__WEBPACK_IMPORTED_MODULE_6__.TrackingManager(httpClient, config);
        }
        flagship.configManager = new _config_ConfigManager__WEBPACK_IMPORTED_MODULE_4__.ConfigManager(config, decisionManager, trackingManager);
        if (flagship._status === _enum_FlagshipStatus__WEBPACK_IMPORTED_MODULE_1__.FlagshipStatus.STARTING) {
            flagship.setStatus(_enum_FlagshipStatus__WEBPACK_IMPORTED_MODULE_1__.FlagshipStatus.READY);
        }
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__.logInfo)(config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_9__.SDK_STARTED_INFO, _sdkVersion__WEBPACK_IMPORTED_MODULE_17__.version), _enum_index__WEBPACK_IMPORTED_MODULE_9__.PROCESS_INITIALIZATION);
        // const initMonitoring = new Monitoring({
        //   action: 'SDK-INITIALIZATION',
        //   subComponent: 'Flagship.start',
        //   logLevel: LogLevel.INFO,
        //   message: 'Flagship initialized',
        //   sdkConfigCustomCacheManager: configCheck.useCustomCacheManager,
        //   sdkConfigCustomLogManager: configCheck.useCustomLogManager,
        //   sdkConfigMode: config.decisionMode,
        //   sdkConfigPollingTime: config.pollingInterval?.toString(),
        //   sdkConfigStatusListener: !!config.statusChangedCallback,
        //   sdkConfigTimeout: config.timeout?.toString(),
        //   sdkStatus: FlagshipStatus[flagship.getStatus()],
        //   sdkConfigTrackingManagerConfigBatchIntervals: config.trackingMangerConfig?.batchIntervals?.toString(),
        //   sdkConfigTrackingManagerConfigBatchLength: config.trackingMangerConfig?.batchLength?.toString(),
        //   sdkConfigTrackingManagerConfigStrategy: BatchStrategy[config.trackingMangerConfig?.batchStrategy as BatchStrategy],
        //   visitorId: '0',
        //   anonymousId: '',
        //   config
        // })
        // trackingManager.addHit(initMonitoring)
        return flagship;
    }
    newVisitor(param1, param2) {
        return Flagship.newVisitor(param1, param2);
    }
    static newVisitor(param1, param2) {
        let visitorId;
        let context;
        let isAuthenticated = false;
        let hasConsented = true;
        let initialModifications;
        let initialCampaigns;
        const isServerSide = !(0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__.isBrowser)();
        let isNewInstance = isServerSide;
        if (!this._instance?.configManager) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_8__.logError)(this.getConfig(), _enum_index__WEBPACK_IMPORTED_MODULE_9__.NEW_VISITOR_NOT_READY, _enum_index__WEBPACK_IMPORTED_MODULE_9__.PROCESS_NEW_VISITOR);
            return null;
        }
        if (typeof param1 === 'string' || param1 === null) {
            visitorId = param1 || undefined;
            context = param2 || {};
        }
        else {
            visitorId = param1?.visitorId;
            context = param1?.context || {};
            isAuthenticated = !!param1?.isAuthenticated;
            hasConsented = param1?.hasConsented ?? true;
            initialModifications = param1?.initialFlagsData || param1?.initialModifications;
            initialCampaigns = param1?.initialCampaigns;
            isNewInstance = param1?.isNewInstance ?? isNewInstance;
        }
        const visitorDelegate = new _visitor_VisitorDelegate__WEBPACK_IMPORTED_MODULE_10__.VisitorDelegate({
            visitorId,
            context,
            isAuthenticated,
            hasConsented,
            configManager: this.getInstance().configManager,
            initialModifications: initialModifications,
            initialCampaigns: initialCampaigns,
            initialFlagsData: initialModifications
        });
        const visitor = new _visitor_Visitor__WEBPACK_IMPORTED_MODULE_0__.Visitor(visitorDelegate);
        this.getInstance()._visitorInstance = !isNewInstance ? visitor : undefined;
        if (this.getConfig().fetchNow && !this.getConfig().isCloudFlareClient) {
            visitor.fetchFlags();
        }
        return visitor;
    }
}


/***/ }),

/***/ "./src/nodeDeps.browser.ts":
/*!*********************************!*\
  !*** ./src/nodeDeps.browser.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "globalOption": () => (/* binding */ globalOption),
/* harmony export */   "fetch": () => (/* binding */ fetch),
/* harmony export */   "EventEmitter": () => (/* reexport safe */ events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
const globalOption = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = globalThis.fetch;



/***/ }),

/***/ "./src/sdkVersion.ts":
/*!***************************!*\
  !*** ./src/sdkVersion.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
// Generated by genversion.
const version = '3.0.10';


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/utils/FlagshipLogManager.ts":
/*!*****************************************!*\
  !*** ./src/utils/FlagshipLogManager.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FlagshipLogManager": () => (/* binding */ FlagshipLogManager)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");

class FlagshipLogManager {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    consoleError;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    consoleWarn;
    constructor(isCloudFlareClient = false) {
        this.consoleError = isCloudFlareClient ? console.log : console.error;
        this.consoleWarn = isCloudFlareClient ? console.log : console.warn;
    }
    emergency(message, tag) {
        this.consoleError(this.formatOutput(_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.EMERGENCY, message, tag));
    }
    alert(message, tag) {
        this.consoleError(this.formatOutput(_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.ALERT, message, tag));
    }
    critical(message, tag) {
        this.consoleError(this.formatOutput(_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.CRITICAL, message, tag));
    }
    error(message, tag) {
        this.consoleError(this.formatOutput(_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.ERROR, message, tag));
    }
    warning(message, tag) {
        this.consoleWarn(this.formatOutput(_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.WARNING, message, tag));
    }
    notice(message, tag) {
        this.log(_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.NOTICE, message, tag);
    }
    info(message, tag) {
        console.info(this.formatOutput(_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.INFO, message, tag));
    }
    debug(message, tag) {
        console.debug(this.formatOutput(_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.DEBUG, message, tag));
    }
    log(level, message, tag) {
        console.log(this.formatOutput(level, message, tag));
    }
    formatOutput(level, message, tag) {
        const now = new Date();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getTwoDigit = (value) => {
            return value.toString().length === 1 ? `0${value}` : value;
        };
        return `[${getTwoDigit(now.getFullYear())}-${getTwoDigit(now.getMonth())}-${getTwoDigit(now.getDay())} ${getTwoDigit(now.getHours())}:${getTwoDigit(now.getMinutes())}] [${_enum_index__WEBPACK_IMPORTED_MODULE_0__.FLAGSHIP_SDK}] [${_enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel[level]}] [${tag}] : ${message}`;
    }
}


/***/ }),

/***/ "./src/utils/HttpClient.ts":
/*!*********************************!*\
  !*** ./src/utils/HttpClient.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpClient": () => (/* binding */ HttpClient)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _nodeDeps__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../nodeDeps */ "./src/nodeDeps.browser.ts");


class HttpClient {
    async getResponse(response) {
        const applicationType = response.headers.get('Content-Type');
        const checkJson = applicationType === 'application/json';
        const bodyString = await response.text();
        let body;
        if (bodyString && checkJson) {
            body = JSON.parse(bodyString);
        }
        if (response.status >= 400) {
            throw new Error(bodyString || response.statusText);
        }
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        return {
            status: response.status,
            body: body,
            headers
        };
    }
    getAsync(url, options) {
        const c = new AbortController();
        const id = setTimeout(() => c.abort(), (options?.timeout ? options.timeout : _enum_index__WEBPACK_IMPORTED_MODULE_0__.REQUEST_TIME_OUT) * 1000);
        return (0,_nodeDeps__WEBPACK_IMPORTED_MODULE_1__.fetch)(url, {
            ..._nodeDeps__WEBPACK_IMPORTED_MODULE_1__.globalOption,
            method: 'GET',
            headers: options?.headers,
            signal: c.signal,
            keepalive: true
        })
            .then(this.getResponse)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error) => {
            throw error;
        })
            .finally(() => {
            clearInterval(id);
        });
    }
    postAsync(url, options) {
        const c = new AbortController();
        const id = setTimeout(() => c.abort(), options.timeout ? options.timeout * 1000 : _enum_index__WEBPACK_IMPORTED_MODULE_0__.REQUEST_TIME_OUT * 1000);
        return (0,_nodeDeps__WEBPACK_IMPORTED_MODULE_1__.fetch)(url, {
            ..._nodeDeps__WEBPACK_IMPORTED_MODULE_1__.globalOption,
            method: 'POST',
            headers: options.headers,
            body: JSON.stringify(options.body),
            signal: c.signal,
            keepalive: true
        })
            .then(this.getResponse)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error) => {
            throw error;
        })
            .finally(() => {
            clearInterval(id);
        });
    }
}


/***/ }),

/***/ "./src/utils/MurmurHash.ts":
/*!*********************************!*\
  !*** ./src/utils/MurmurHash.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MurmurHash": () => (/* binding */ MurmurHash)
/* harmony export */ });
/* eslint-disable no-fallthrough */
class MurmurHash {
    murmurHash3Int32(key, seed = 0) {
        let h1, h1b, k1, i;
        const remainder = key.length & 3; // key.length % 4
        const bytes = key.length - remainder;
        h1 = seed;
        const c1 = 0xcc9e2d51;
        const c2 = 0x1b873593;
        i = 0;
        while (i < bytes) {
            k1 = (key.charCodeAt(i) & 0xff) | ((key.charCodeAt(++i) & 0xff) << 8) | ((key.charCodeAt(++i) & 0xff) << 16) | ((key.charCodeAt(++i) & 0xff) << 24);
            ++i;
            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
            h1 = (h1 << 13) | (h1 >>> 19);
            h1b = (((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
            h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
        }
        k1 = 0;
        switch (remainder) {
            case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
            case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
            case 1:
                k1 ^= (key.charCodeAt(i) & 0xff);
                k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                h1 ^= k1;
        }
        h1 ^= key.length;
        h1 ^= h1 >>> 16;
        h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = (((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) & 0xffffffff;
        h1 ^= h1 >>> 16;
        return h1 >>> 0;
    }
}


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sprintf": () => (/* binding */ sprintf),
/* harmony export */   "logError": () => (/* binding */ logError),
/* harmony export */   "logInfo": () => (/* binding */ logInfo),
/* harmony export */   "logDebug": () => (/* binding */ logDebug),
/* harmony export */   "sleep": () => (/* binding */ sleep),
/* harmony export */   "isBrowser": () => (/* binding */ isBrowser),
/* harmony export */   "hasSameType": () => (/* binding */ hasSameType),
/* harmony export */   "uuidV4": () => (/* binding */ uuidV4),
/* harmony export */   "errorFormat": () => (/* binding */ errorFormat)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");

/**
 * Return a formatted string
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sprintf(format, ...value) {
    let formatted = format;
    for (let i = 0; i < value.length; i++) {
        const element = value[i];
        formatted = formatted.replace(new RegExp(`\\{${i}\\}`, 'g'), element);
    }
    return formatted;
}
function logError(config, message, tag) {
    if (!config ||
        !config.logManager ||
        typeof config.logManager.error !== 'function' ||
        !config.logLevel ||
        config.logLevel < _enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.ERROR) {
        return;
    }
    config.logManager.error(message, tag);
}
function logInfo(config, message, tag) {
    if (!config ||
        !config.logManager ||
        typeof config.logManager.info !== 'function' ||
        !config.logLevel ||
        config.logLevel < _enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.INFO) {
        return;
    }
    config.logManager.info(message, tag);
}
function logDebug(config, message, tag) {
    if (!config ||
        !config.logManager ||
        typeof config.logManager.debug !== 'function' ||
        !config.logLevel ||
        config.logLevel < _enum_index__WEBPACK_IMPORTED_MODULE_0__.LogLevel.DEBUG) {
        return;
    }
    config.logManager.debug(message, tag);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function isBrowser() {
    return typeof window !== 'undefined' && !('Deno' in window);
}
function hasSameType(flagValue, defaultValue) {
    if (typeof flagValue !== typeof defaultValue) {
        return false;
    }
    if (typeof flagValue === 'object' && typeof defaultValue === 'object' &&
        Array.isArray(flagValue) !== Array.isArray(defaultValue)) {
        return false;
    }
    return true;
}
function uuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
        const rand = Math.random() * 16 | 0;
        const value = char === 'x' ? rand : (rand & 0x3 | 0x8);
        return value.toString(16);
    });
}
function errorFormat(errorMessage, errorData) {
    return JSON.stringify({
        errorMessage,
        data: errorData
    });
}


/***/ }),

/***/ "./src/visitor/DefaultStrategy.ts":
/*!****************************************!*\
  !*** ./src/visitor/DefaultStrategy.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TYPE_HIT_REQUIRED_ERROR": () => (/* binding */ TYPE_HIT_REQUIRED_ERROR),
/* harmony export */   "HIT_NULL_ERROR": () => (/* binding */ HIT_NULL_ERROR),
/* harmony export */   "DefaultStrategy": () => (/* binding */ DefaultStrategy)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _hit_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hit/index */ "./src/hit/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _VisitorStrategyAbstract__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./VisitorStrategyAbstract */ "./src/visitor/VisitorStrategyAbstract.ts");
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config/index */ "./src/config/index.ts");
/* harmony import */ var _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enum/FlagshipContext */ "./src/enum/FlagshipContext.ts");
/* harmony import */ var _flag_FlagMetadata__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../flag/FlagMetadata */ "./src/flag/FlagMetadata.ts");
/* harmony import */ var _hit_Activate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hit/Activate */ "./src/hit/Activate.ts");








const TYPE_HIT_REQUIRED_ERROR = 'property type is required and must ';
const HIT_NULL_ERROR = 'Hit must not be null';
class DefaultStrategy extends _VisitorStrategyAbstract__WEBPACK_IMPORTED_MODULE_3__.VisitorStrategyAbstract {
    checkPredefinedContext(key, value) {
        const type = _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_5__.FLAGSHIP_CONTEXT[key];
        if (!type) {
            return null;
        }
        let check = false;
        if (type === 'string') {
            check = typeof value === 'string';
        }
        else if (type === 'number') {
            check = typeof value === 'number';
        }
        if (!check) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.PREDEFINED_CONTEXT_TYPE_ERROR, key, type), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_UPDATE_CONTEXT);
        }
        return check;
    }
    /**
     *  Update the visitor context values, matching the given keys, used for targeting.
     *
     * A new context value associated with this key will be created if there is no previous matching value.
     * Context key must be String, and value type must be one of the following : Number, Boolean, String.
     * @param {string} key : context key.
     * @param {primitive} value : context value.
     */
    updateContextKeyValue(key, value) {
        const valueType = typeof value;
        if (typeof key !== 'string' ||
            key === '' ||
            (valueType !== 'string' &&
                valueType !== 'number' &&
                valueType !== 'boolean')) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.visitor.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.CONTEXT_PARAM_ERROR, key), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_UPDATE_CONTEXT);
            return;
        }
        if (key.match(/^fs_/i)) {
            return;
        }
        const predefinedContext = this.checkPredefinedContext(key, value);
        if (typeof predefinedContext === 'boolean' && !predefinedContext) {
            return;
        }
        this.visitor.context[key] = value;
    }
    updateContext(context) {
        if (!context) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.visitor.config, _enum_index__WEBPACK_IMPORTED_MODULE_0__.CONTEXT_NULL_ERROR, _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_UPDATE_CONTEXT);
            return;
        }
        for (const key in context) {
            const value = context[key];
            this.updateContextKeyValue(key, value);
        }
    }
    clearContext() {
        this.visitor.context = {};
    }
    checkAndGetModification(params, activateAll) {
        const { key, defaultValue, activate } = params;
        if (!key || typeof key !== 'string') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_MODIFICATION_KEY_ERROR, key), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_GET_MODIFICATION);
            return defaultValue;
        }
        const modification = this.visitor.flagsData.get(key);
        if (!modification) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logInfo)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_MODIFICATION_MISSING_ERROR, key), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_GET_MODIFICATION);
            return defaultValue;
        }
        const castError = () => {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_MODIFICATION_CAST_ERROR, key), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_GET_MODIFICATION);
            if (!modification.value && (activate || activateAll)) {
                this.activateModification(key);
            }
        };
        if (typeof modification.value === 'object' &&
            typeof defaultValue === 'object' &&
            Array.isArray(modification.value) !== Array.isArray(defaultValue)) {
            castError();
            return defaultValue;
        }
        if (typeof modification.value !== typeof defaultValue) {
            castError();
            return defaultValue;
        }
        if (activate || activateAll) {
            this.activateModification(key);
        }
        return modification.value;
    }
    async getModifications(params, activateAll) {
        return this.getModificationsSync(params, activateAll);
    }
    getModificationsSync(params, activateAll) {
        const flags = {};
        params.forEach((item) => {
            flags[item.key] = this.checkAndGetModification(item, activateAll);
        });
        return flags;
    }
    async getModification(params) {
        return this.getModificationSync(params);
    }
    getModificationSync(params) {
        return this.checkAndGetModification(params);
    }
    async getModificationInfo(key) {
        return this.getModificationInfoSync(key);
    }
    getModificationInfoSync(key) {
        if (!key || typeof key !== 'string') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.visitor.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_MODIFICATION_KEY_ERROR, key), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_GET_MODIFICATION_INFO);
            return null;
        }
        const modification = this.visitor.flagsData.get(key);
        if (!modification) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.visitor.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_MODIFICATION_ERROR, key), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_GET_MODIFICATION_INFO);
            return null;
        }
        return modification;
    }
    fetchVisitorCampaigns(visitor) {
        if (!Array.isArray(visitor?.visitorCache?.data.campaigns)) {
            return null;
        }
        visitor.updateContext(visitor.visitorCache.data.context || {});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return visitor.visitorCache.data.campaigns.map((campaign) => {
            return {
                id: campaign.campaignId,
                variationGroupId: campaign.variationGroupId,
                slug: campaign.slug,
                variation: {
                    id: campaign.variationId,
                    reference: !!campaign.isReference,
                    modifications: {
                        type: campaign.type,
                        value: campaign.flags
                    }
                }
            };
        });
    }
    async globalFetchFlags(functionName) {
        try {
            let campaigns = await this.decisionManager.getCampaignsAsync(this.visitor);
            if (!campaigns) {
                campaigns = this.fetchVisitorCampaigns(this.visitor);
            }
            if (!campaigns) {
                return;
            }
            this.visitor.campaigns = campaigns;
            this.visitor.flagsData = this.decisionManager.getModifications(this.visitor.campaigns);
            this.visitor.emit(_enum_index__WEBPACK_IMPORTED_MODULE_0__.EMIT_READY);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            this.visitor.emit(_enum_index__WEBPACK_IMPORTED_MODULE_0__.EMIT_READY, error);
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, error.message || error, functionName);
        }
    }
    async synchronizeModifications() {
        return this.globalFetchFlags(_enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_SYNCHRONIZED_MODIFICATION);
    }
    async activateModification(params) {
        if (!params || typeof params !== 'string') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.ACTIVATE_MODIFICATION_KEY_ERROR, params), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_ACTIVE_MODIFICATION);
            return;
        }
        return this.activate(params);
    }
    async activateModifications(params) {
        if (!params || !Array.isArray(params)) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_MODIFICATION_KEY_ERROR, params), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_ACTIVE_MODIFICATION);
            return;
        }
        params.forEach((item) => {
            if (typeof item === 'string') {
                this.activate(item);
            }
            else
                this.activate(item.key);
        });
    }
    isDeDuplicated(key, deDuplicationTime) {
        if (deDuplicationTime === 0) {
            return false;
        }
        const deDuplicationCache = this.visitor.deDuplicationCache[key];
        if (deDuplicationCache && (Date.now() - deDuplicationCache) <= (deDuplicationTime * 1000)) {
            return true;
        }
        this.visitor.deDuplicationCache[key] = Date.now();
        this.visitor.clearDeDuplicationCache(deDuplicationTime);
        return false;
    }
    async sendActivate(flagDto, functionName = _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_ACTIVE_MODIFICATION) {
        const activateHit = new _hit_Activate__WEBPACK_IMPORTED_MODULE_7__.Activate({
            variationGroupId: flagDto.variationGroupId,
            variationId: flagDto.variationId,
            visitorId: this.visitor.visitorId,
            anonymousId: this.visitor.anonymousId
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, ...activateHitItem } = activateHit.toObject();
        if (this.isDeDuplicated(JSON.stringify(activateHitItem), this.config.hitDeduplicationTime)) {
            return;
        }
        await this.prepareAndSendHit(activateHit, functionName);
    }
    async activate(key) {
        const flag = this.visitor.flagsData.get(key);
        if (!flag) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.visitor.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.ACTIVATE_MODIFICATION_ERROR, key), _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_ACTIVE_MODIFICATION);
            return;
        }
        if (!this.hasTrackingManager(_enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_ACTIVE_MODIFICATION)) {
            return;
        }
        await this.sendActivate(flag);
    }
    async sendHit(hit) {
        if (!this.hasTrackingManager(_enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_SEND_HIT)) {
            return;
        }
        await this.prepareAndSendHit(hit);
    }
    async sendHits(hits) {
        if (!this.hasTrackingManager(_enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_SEND_HIT)) {
            return;
        }
        for (const hit of hits) {
            await this.prepareAndSendHit(hit);
        }
    }
    getHitLegacy(hit) {
        let newHit = null;
        const hitTypeToEnum = {
            Screen: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.SCREEN_VIEW,
            ScreenView: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.SCREEN_VIEW,
            Transaction: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.TRANSACTION,
            Page: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.PAGE_VIEW,
            PageView: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.PAGE_VIEW,
            Item: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.ITEM,
            Event: _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.EVENT
        };
        const commonProperties = {
            type: hitTypeToEnum[hit.type]
        };
        const hitData = { ...commonProperties, ...hit.data };
        switch (commonProperties.type?.toUpperCase()) {
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.EVENT:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Event(hitData);
                break;
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.ITEM:
                // eslint-disable-next-line no-case-declarations
                const data = hit.data;
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Item({
                    ...hitData,
                    productName: data.name,
                    productSku: data.code,
                    transactionId: data.transactionId,
                    itemCategory: data.category,
                    itemPrice: data.price,
                    itemQuantity: data.quantity
                });
                break;
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.PAGE_VIEW:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Page(hitData);
                break;
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.SCREEN_VIEW:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Screen(hitData);
                break;
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.TRANSACTION:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Transaction(hit.data);
                break;
        }
        return newHit;
    }
    getHit(hit) {
        let newHit = null;
        switch (hit.type.toUpperCase()) {
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.EVENT:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Event(hit);
                break;
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.ITEM:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Item(hit);
                break;
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.PAGE_VIEW:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Page(hit);
                break;
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.SCREEN_VIEW:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Screen(hit);
                break;
            case _enum_index__WEBPACK_IMPORTED_MODULE_0__.HitType.TRANSACTION:
                newHit = new _hit_index__WEBPACK_IMPORTED_MODULE_1__.Transaction(hit);
                break;
        }
        return newHit;
    }
    async prepareAndSendHit(hit, functionName = _enum_index__WEBPACK_IMPORTED_MODULE_0__.PROCESS_SEND_HIT) {
        let hitInstance;
        if (!hit?.type) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, HIT_NULL_ERROR, functionName);
            return;
        }
        if (hit instanceof _hit_index__WEBPACK_IMPORTED_MODULE_1__.HitAbstract) {
            hitInstance = hit;
        }
        else if ('data' in hit) {
            const hitShape = hit;
            const hitFromInt = this.getHitLegacy(hitShape);
            if (!hitFromInt) {
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, TYPE_HIT_REQUIRED_ERROR, functionName);
                return;
            }
            hitInstance = hitFromInt;
        }
        else {
            const hitFromInt = this.getHit(hit);
            if (!hitFromInt) {
                (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, TYPE_HIT_REQUIRED_ERROR, functionName);
                return;
            }
            hitInstance = hitFromInt;
        }
        hitInstance.visitorId = this.visitor.visitorId;
        hitInstance.ds = _enum_index__WEBPACK_IMPORTED_MODULE_0__.SDK_APP;
        hitInstance.config = this.config;
        hitInstance.anonymousId = this.visitor.anonymousId;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, ...hitInstanceItem } = hitInstance.toObject();
        if (this.isDeDuplicated(JSON.stringify(hitInstanceItem), this.config.hitDeduplicationTime)) {
            return;
        }
        if (!hitInstance.isReady()) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, hitInstance.getErrorMessage(), functionName);
            return;
        }
        try {
            await this.trackingManager.addHit(hitInstance);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, error.message || error, functionName);
        }
    }
    /**
     * returns a Promise<object> containing all the data for all the campaigns associated with the current visitor.
     *@deprecated
     */
    async getAllModifications(activate = false) {
        return this.getAllFlagsData(activate);
    }
    async getAllFlagsData(activate) {
        if (activate) {
            this.visitor.flagsData.forEach((_, key) => {
                this.activateModification(key);
            });
        }
        return {
            visitorId: this.visitor.visitorId,
            campaigns: this.visitor.campaigns
        };
    }
    /**
     * Get data for a specific campaign.
     * @param campaignId Identifies the campaign whose modifications you want to retrieve.
     * @param activate
     * @deprecated
     * @returns
     */
    async getModificationsForCampaign(campaignId, activate = false) {
        return this.getFlatsDataForCampaign(campaignId, activate);
    }
    async getFlatsDataForCampaign(campaignId, activate) {
        if (activate) {
            this.visitor.flagsData.forEach((value) => {
                if (value.campaignId === campaignId) {
                    this.userExposed({ key: value.key, flag: value, defaultValue: value.value });
                }
            });
        }
        return {
            visitorId: this.visitor.visitorId,
            campaigns: this.visitor.campaigns.filter((x) => x.id === campaignId)
        };
    }
    authenticate(visitorId) {
        const functionName = 'authenticate';
        if (this.config.decisionMode === _config_index__WEBPACK_IMPORTED_MODULE_4__.DecisionMode.BUCKETING) {
            this.logDeactivateOnBucketing(functionName);
            return;
        }
        if (!visitorId) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, _enum_index__WEBPACK_IMPORTED_MODULE_0__.VISITOR_ID_ERROR, functionName);
            return;
        }
        this.visitor.anonymousId = this.visitor.visitorId;
        this.visitor.visitorId = visitorId;
    }
    unauthenticate() {
        const functionName = 'unauthenticate';
        if (this.config.decisionMode === _config_index__WEBPACK_IMPORTED_MODULE_4__.DecisionMode.BUCKETING) {
            this.logDeactivateOnBucketing(functionName);
            return;
        }
        if (!this.visitor.anonymousId) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, _enum_index__WEBPACK_IMPORTED_MODULE_0__.FLAGSHIP_VISITOR_NOT_AUTHENTICATE, functionName);
            return;
        }
        this.visitor.visitorId = this.visitor.anonymousId;
        this.visitor.anonymousId = null;
    }
    async fetchFlags() {
        return this.globalFetchFlags('fetchFlags');
    }
    async userExposed(param) {
        const { key, flag, defaultValue } = param;
        const functionName = 'userExposed';
        if (!flag) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logInfo)(this.visitor.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.USER_EXPOSED_FLAG_ERROR, key), functionName);
            return;
        }
        if (defaultValue !== null && defaultValue !== undefined && flag.value && !(0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.hasSameType)(flag.value, defaultValue)) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logInfo)(this.visitor.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.USER_EXPOSED_CAST_ERROR, key), functionName);
            return;
        }
        if (!this.hasTrackingManager(functionName)) {
            return;
        }
        return this.sendActivate(flag, functionName);
    }
    getFlagValue(param) {
        const { key, defaultValue, flag, userExposed } = param;
        const functionName = 'getFlag value';
        if (!flag) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logInfo)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_FLAG_MISSING_ERROR, key), functionName);
            return defaultValue;
        }
        if (!flag.value) {
            if (userExposed) {
                this.userExposed({ key, flag, defaultValue });
            }
            return defaultValue;
        }
        if (defaultValue !== null && defaultValue !== undefined && !(0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.hasSameType)(flag.value, defaultValue)) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logInfo)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_FLAG_CAST_ERROR, key), functionName);
            return defaultValue;
        }
        if (userExposed) {
            this.userExposed({ key, flag, defaultValue });
        }
        return flag.value;
    }
    getFlagMetadata(param) {
        const { metadata, hasSameType: checkType, key } = param;
        const functionName = 'flag.metadata';
        if (!checkType) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logInfo)(this.visitor.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.GET_METADATA_CAST_ERROR, key), functionName);
            return _flag_FlagMetadata__WEBPACK_IMPORTED_MODULE_6__.FlagMetadata.Empty();
        }
        return metadata;
    }
    logDeactivateOnBucketing(functionName) {
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.METHOD_DEACTIVATED_BUCKETING_ERROR, functionName), functionName);
    }
}


/***/ }),

/***/ "./src/visitor/NoConsentStrategy.ts":
/*!******************************************!*\
  !*** ./src/visitor/NoConsentStrategy.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoConsentStrategy": () => (/* binding */ NoConsentStrategy)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _DefaultStrategy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultStrategy */ "./src/visitor/DefaultStrategy.ts");



class NoConsentStrategy extends _DefaultStrategy__WEBPACK_IMPORTED_MODULE_2__.DefaultStrategy {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async activateModification(_params) {
        this.log('activateModification');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async activateModifications(_params) {
        this.log('activateModifications');
    }
    async lookupHits() {
        //
    }
    async lookupVisitor() {
        //
    }
    async cacheVisitor() {
        //
    }
    async cacheHit() {
        //
    }
    fetchVisitorCampaigns() {
        return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendHit(_hit) {
        this.log('sendHit');
        return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendHits(_hits) {
        this.log('sendHits');
        return Promise.resolve();
    }
    async userExposed() {
        this.log('userExposed');
    }
    log(methodName) {
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.METHOD_DEACTIVATED_CONSENT_ERROR, methodName, this.visitor.visitorId), methodName);
    }
}


/***/ }),

/***/ "./src/visitor/NotReadyStrategy.ts":
/*!*****************************************!*\
  !*** ./src/visitor/NotReadyStrategy.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NotReadyStrategy": () => (/* binding */ NotReadyStrategy)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _DefaultStrategy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultStrategy */ "./src/visitor/DefaultStrategy.ts");
/* harmony import */ var _flag_FlagMetadata__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../flag/FlagMetadata */ "./src/flag/FlagMetadata.ts");




class NotReadyStrategy extends _DefaultStrategy__WEBPACK_IMPORTED_MODULE_2__.DefaultStrategy {
    async synchronizeModifications() {
        this.log('synchronizeModifications');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getModificationSync(params) {
        this.log('getModification');
        return params.defaultValue;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getModificationsSync(params, _activateAll) {
        this.log('getModifications');
        const flags = {};
        params.forEach(item => {
            flags[item.key] = item.defaultValue;
        });
        return flags;
    }
    async lookupHits() {
        //
    }
    async lookupVisitor() {
        //
    }
    async cacheVisitor() {
        //
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getModificationInfoSync(_key) {
        this.log('getModificationInfo');
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async activateModification(_params) {
        this.log('activateModification');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async activateModifications(_params) {
        this.log('activateModifications');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendHit(_hit) {
        this.log('sendHit');
        return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendHits(_hits) {
        this.log('sendHits');
        return Promise.resolve();
    }
    async fetchFlags() {
        this.log('fetchFlags');
    }
    getFlagValue(param) {
        this.log('Flag.value');
        return param.defaultValue;
    }
    async userExposed() {
        this.log('userExposed');
    }
    getFlagMetadata() {
        this.log('flag.metadata');
        return _flag_FlagMetadata__WEBPACK_IMPORTED_MODULE_3__.FlagMetadata.Empty();
    }
    log(methodName) {
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.METHOD_DEACTIVATED_ERROR, methodName, _enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus[_enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus.NOT_INITIALIZED]), methodName);
    }
}


/***/ }),

/***/ "./src/visitor/PanicStrategy.ts":
/*!**************************************!*\
  !*** ./src/visitor/PanicStrategy.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PanicStrategy": () => (/* binding */ PanicStrategy)
/* harmony export */ });
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _DefaultStrategy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultStrategy */ "./src/visitor/DefaultStrategy.ts");
/* harmony import */ var _flag_FlagMetadata__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../flag/FlagMetadata */ "./src/flag/FlagMetadata.ts");




class PanicStrategy extends _DefaultStrategy__WEBPACK_IMPORTED_MODULE_2__.DefaultStrategy {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setConsent(hasConsented) {
        this.visitor.hasConsented = hasConsented;
        const methodName = 'setConsent';
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.METHOD_DEACTIVATED_SEND_CONSENT_ERROR, _enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus[_enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus.READY_PANIC_ON]), methodName);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateContext(_context) {
        this.log('updateContext');
    }
    clearContext() {
        this.log('clearContext');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getModificationSync(params) {
        this.log('getModification');
        return params.defaultValue;
    }
    async lookupHits() {
        //
    }
    async lookupVisitor() {
        //
    }
    async cacheVisitor() {
        //
    }
    async cacheHit() {
        //
    }
    fetchVisitorCampaigns() {
        return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getModificationsSync(params, _activateAll) {
        this.log('getModifications');
        const flags = {};
        params.forEach(item => {
            flags[item.key] = item.defaultValue;
        });
        return flags;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getModificationInfoSync(_key) {
        this.log('getModificationInfo');
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async activateModification(_params) {
        this.log('activateModification');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async activateModifications(_params) {
        this.log('activateModifications');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendHit(_hit) {
        this.log('sendHit');
        return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendHits(_hits) {
        this.log('sendHits');
        return Promise.resolve();
    }
    getFlagValue(param) {
        this.log('Flag.value');
        return param.defaultValue;
    }
    async userExposed() {
        this.log('userExposed');
    }
    getFlagMetadata() {
        this.log('flag.metadata');
        return _flag_FlagMetadata__WEBPACK_IMPORTED_MODULE_3__.FlagMetadata.Empty();
    }
    log(methodName) {
        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_0__.METHOD_DEACTIVATED_ERROR, methodName, _enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus[_enum_index__WEBPACK_IMPORTED_MODULE_0__.FlagshipStatus.READY_PANIC_ON]), methodName);
    }
}


/***/ }),

/***/ "./src/visitor/Visitor.ts":
/*!********************************!*\
  !*** ./src/visitor/Visitor.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Visitor": () => (/* binding */ Visitor)
/* harmony export */ });
/* harmony import */ var _nodeDeps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../nodeDeps */ "./src/nodeDeps.browser.ts");
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");


class Visitor extends _nodeDeps__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    visitorDelegate;
    constructor(visitorDelegate) {
        super();
        this.visitorDelegate = visitorDelegate;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.visitorDelegate.on(_enum_index__WEBPACK_IMPORTED_MODULE_1__.EMIT_READY, (err) => {
            this.emit(_enum_index__WEBPACK_IMPORTED_MODULE_1__.EMIT_READY, err);
        });
    }
    getModificationsArray() {
        return this.visitorDelegate.getModificationsArray();
    }
    getFlagsDataArray() {
        return this.visitorDelegate.getFlagsDataArray();
    }
    get visitorId() {
        return this.visitorDelegate.visitorId;
    }
    set visitorId(v) {
        this.visitorDelegate.visitorId = v;
    }
    get anonymousId() {
        return this.visitorDelegate.anonymousId;
    }
    get hasConsented() {
        return this.visitorDelegate.hasConsented;
    }
    setConsent(hasConsented) {
        this.visitorDelegate.setConsent(hasConsented);
    }
    get config() {
        return this.visitorDelegate.config;
    }
    get context() {
        return this.visitorDelegate.context;
    }
    get flagsData() {
        return this.visitorDelegate.flagsData;
    }
    get modifications() {
        return this.visitorDelegate.flagsData;
    }
    updateContext(context) {
        this.visitorDelegate.updateContext(context);
    }
    clearContext() {
        this.visitorDelegate.clearContext();
    }
    getFlag(key, defaultValue) {
        return this.visitorDelegate.getFlag(key, defaultValue);
    }
    getModification(params) {
        return this.visitorDelegate.getModification(params);
    }
    getModificationSync(params) {
        return this.visitorDelegate.getModificationSync(params);
    }
    getModifications(params, activateAll) {
        return this.visitorDelegate.getModifications(params, activateAll);
    }
    getModificationsSync(params, activateAll) {
        return this.visitorDelegate.getModificationsSync(params, activateAll);
    }
    getModificationInfo(key) {
        return this.visitorDelegate.getModificationInfo(key);
    }
    getModificationInfoSync(key) {
        return this.visitorDelegate.getModificationInfoSync(key);
    }
    synchronizeModifications() {
        return this.visitorDelegate.synchronizeModifications();
    }
    fetchFlags() {
        return this.visitorDelegate.fetchFlags();
    }
    activateModification(key) {
        return this.visitorDelegate.activateModification(key);
    }
    activateModifications(params) {
        return this.visitorDelegate.activateModifications(params);
    }
    sendHit(hit) {
        return this.visitorDelegate.sendHit(hit);
    }
    sendHits(hits) {
        return this.visitorDelegate.sendHits(hits);
    }
    getAllModifications(activate = false) {
        return this.visitorDelegate.getAllModifications(activate);
    }
    getModificationsForCampaign(campaignId, activate = false) {
        return this.visitorDelegate.getModificationsForCampaign(campaignId, activate);
    }
    getAllFlagsData(activate = false) {
        return this.visitorDelegate.getAllFlagsData(activate);
    }
    getFlatsDataForCampaign(campaignId, activate = false) {
        return this.visitorDelegate.getFlatsDataForCampaign(campaignId, activate);
    }
    authenticate(visitorId) {
        this.visitorDelegate.authenticate(visitorId);
    }
    unauthenticate() {
        this.visitorDelegate.unauthenticate();
    }
}


/***/ }),

/***/ "./src/visitor/VisitorAbstract.ts":
/*!****************************************!*\
  !*** ./src/visitor/VisitorAbstract.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VisitorAbstract": () => (/* binding */ VisitorAbstract)
/* harmony export */ });
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/index */ "./src/config/index.ts");
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _DefaultStrategy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DefaultStrategy */ "./src/visitor/DefaultStrategy.ts");
/* harmony import */ var _nodeDeps__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../nodeDeps */ "./src/nodeDeps.browser.ts");
/* harmony import */ var _main_Flagship__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/Flagship */ "./src/main/Flagship.ts");
/* harmony import */ var _NotReadyStrategy__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./NotReadyStrategy */ "./src/visitor/NotReadyStrategy.ts");
/* harmony import */ var _PanicStrategy__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PanicStrategy */ "./src/visitor/PanicStrategy.ts");
/* harmony import */ var _NoConsentStrategy__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./NoConsentStrategy */ "./src/visitor/NoConsentStrategy.ts");
/* harmony import */ var _VisitorCache__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./VisitorCache */ "./src/visitor/VisitorCache.ts");










class VisitorAbstract extends _nodeDeps__WEBPACK_IMPORTED_MODULE_4__.EventEmitter {
    _visitorId;
    _context;
    _flags;
    _configManager;
    _campaigns;
    _hasConsented;
    _anonymousId;
    deDuplicationCache;
    _isCleaningDeDuplicationCache;
    visitorCache;
    constructor(param) {
        const { visitorId, configManager, context, isAuthenticated, hasConsented, initialModifications, initialFlagsData, initialCampaigns } = param;
        super();
        this._isCleaningDeDuplicationCache = false;
        this.deDuplicationCache = {};
        this._context = {};
        this._configManager = configManager;
        const VisitorCache = this.config.enableClientCache ? _VisitorCache__WEBPACK_IMPORTED_MODULE_9__.cacheVisitor.loadVisitorProfile() : null;
        this.visitorId = visitorId || VisitorCache?.visitorId || (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.uuidV4)();
        this.campaigns = [];
        this._anonymousId = VisitorCache?.anonymousId || null;
        if (!this._anonymousId && isAuthenticated && this.config.decisionMode === _config_index__WEBPACK_IMPORTED_MODULE_0__.DecisionMode.DECISION_API) {
            this._anonymousId = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.uuidV4)();
        }
        this.setConsent(hasConsented ?? true);
        this.updateContext(context);
        this.loadPredefinedContext();
        this.updateCache();
        this.setInitialFlags(initialFlagsData || initialModifications);
        this.setInitializeCampaigns(initialCampaigns, !!initialModifications);
    }
    clearDeDuplicationCache(deDuplicationTime) {
        if (this._isCleaningDeDuplicationCache) {
            return;
        }
        this._isCleaningDeDuplicationCache = true;
        const entries = Object.entries(this.deDuplicationCache);
        for (const [key, value] of entries) {
            if ((Date.now() - value) > (deDuplicationTime * 1000)) {
                delete this.deDuplicationCache[key];
            }
        }
        this._isCleaningDeDuplicationCache = false;
    }
    getModificationsArray() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Array.from(this._flags, ([_, item]) => item);
    }
    getFlagsDataArray() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Array.from(this._flags, ([_, item]) => item);
    }
    setInitialFlags(modifications) {
        this._flags = new Map();
        if (!modifications || (!(modifications instanceof Map) && !Array.isArray(modifications))) {
            return;
        }
        modifications.forEach((item) => {
            this._flags.set(item.key, item);
        });
    }
    setInitializeCampaigns(campaigns, hasModifications) {
        if (campaigns && Array.isArray(campaigns) && !hasModifications) {
            this.getStrategy().updateCampaigns(campaigns);
        }
    }
    updateCache() {
        const visitorProfil = {
            visitorId: this.visitorId,
            anonymousId: this.anonymousId
        };
        _VisitorCache__WEBPACK_IMPORTED_MODULE_9__.cacheVisitor.saveVisitorProfile(visitorProfil);
    }
    loadPredefinedContext() {
        this.context.fs_client = _enum_index__WEBPACK_IMPORTED_MODULE_1__.SDK_LANGUAGE.name;
        this.context.fs_version = _enum_index__WEBPACK_IMPORTED_MODULE_1__.SDK_VERSION;
        this.context.fs_users = this.visitorId;
    }
    get visitorId() {
        return this._visitorId;
    }
    set visitorId(v) {
        if (!v || typeof v !== 'string') {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.logError)(this.config, _enum_index__WEBPACK_IMPORTED_MODULE_1__.VISITOR_ID_ERROR, 'VISITOR ID');
            return;
        }
        this._visitorId = v;
        this.loadPredefinedContext();
        this.visitorCache = undefined;
    }
    /**
     * Return True or False if the visitor has consented for protected data usage.
     * @return bool
     */
    get hasConsented() {
        return this._hasConsented;
    }
    set hasConsented(v) {
        this._hasConsented = v;
    }
    /**
      * Set if visitor has consented for protected data usage.
      * @param {boolean} hasConsented True if the visitor has consented false otherwise.
      */
    setConsent(hasConsented) {
        this.hasConsented = hasConsented;
        this.getStrategy().setConsent(hasConsented);
    }
    get context() {
        return this._context;
    }
    /**
    * Clear the current context and set a new context value
    */
    set context(v) {
        this._context = {};
        this.updateContext(v);
    }
    get flagsData() {
        return this._flags;
    }
    set flagsData(v) {
        this._flags = v;
    }
    get modifications() {
        return this._flags;
    }
    set modifications(v) {
        this._flags = v;
    }
    get configManager() {
        return this._configManager;
    }
    get config() {
        return this.configManager.config;
    }
    get campaigns() {
        return this._campaigns;
    }
    set campaigns(v) {
        this._campaigns = v;
    }
    get anonymousId() {
        return this._anonymousId;
    }
    set anonymousId(v) {
        this._anonymousId = v;
    }
    getStrategy() {
        let strategy;
        if (!_main_Flagship__WEBPACK_IMPORTED_MODULE_5__.Flagship.getStatus() || _main_Flagship__WEBPACK_IMPORTED_MODULE_5__.Flagship.getStatus() === _enum_index__WEBPACK_IMPORTED_MODULE_1__.FlagshipStatus.NOT_INITIALIZED) {
            strategy = new _NotReadyStrategy__WEBPACK_IMPORTED_MODULE_6__.NotReadyStrategy(this);
        }
        else if (_main_Flagship__WEBPACK_IMPORTED_MODULE_5__.Flagship.getStatus() === _enum_index__WEBPACK_IMPORTED_MODULE_1__.FlagshipStatus.READY_PANIC_ON) {
            strategy = new _PanicStrategy__WEBPACK_IMPORTED_MODULE_7__.PanicStrategy(this);
        }
        else if (!this.hasConsented) {
            strategy = new _NoConsentStrategy__WEBPACK_IMPORTED_MODULE_8__.NoConsentStrategy(this);
        }
        else {
            strategy = new _DefaultStrategy__WEBPACK_IMPORTED_MODULE_3__.DefaultStrategy(this);
        }
        return strategy;
    }
}


/***/ }),

/***/ "./src/visitor/VisitorCache.ts":
/*!*************************************!*\
  !*** ./src/visitor/VisitorCache.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CLIENT_CACHE_KEY": () => (/* binding */ CLIENT_CACHE_KEY),
/* harmony export */   "cacheVisitor": () => (/* binding */ cacheVisitor)
/* harmony export */ });
const CLIENT_CACHE_KEY = 'FS_CLIENT_VISITOR';
const cacheVisitor = {
    saveVisitorProfile(visitorProfile) {
        try {
            localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(visitorProfile));
        }
        catch (error) {
        }
    },
    loadVisitorProfile() {
        let data = null;
        try {
            data = localStorage.getItem(CLIENT_CACHE_KEY);
        }
        catch (error) {
        }
        return data ? JSON.parse(data) : null;
    }
};


/***/ }),

/***/ "./src/visitor/VisitorDelegate.ts":
/*!****************************************!*\
  !*** ./src/visitor/VisitorDelegate.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VisitorDelegate": () => (/* binding */ VisitorDelegate)
/* harmony export */ });
/* harmony import */ var _VisitorAbstract__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VisitorAbstract */ "./src/visitor/VisitorAbstract.ts");
/* harmony import */ var _flag_Flags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../flag/Flags */ "./src/flag/Flags.ts");


class VisitorDelegate extends _VisitorAbstract__WEBPACK_IMPORTED_MODULE_0__.VisitorAbstract {
    updateContext(context) {
        this.getStrategy().updateContext(context);
        this.loadPredefinedContext();
    }
    clearContext() {
        this.getStrategy().clearContext();
    }
    getFlag(key, defaultValue) {
        return new _flag_Flags__WEBPACK_IMPORTED_MODULE_1__.Flag({ key, visitor: this, defaultValue });
    }
    getModification(params) {
        return this.getStrategy().getModification(params);
    }
    getModificationSync(params) {
        return this.getStrategy().getModificationSync(params);
    }
    getModifications(params, activateAll) {
        return this.getStrategy().getModifications(params, activateAll);
    }
    getModificationsSync(params, activateAll) {
        return this.getStrategy().getModificationsSync(params, activateAll);
    }
    getModificationInfo(key) {
        return this.getStrategy().getModificationInfo(key);
    }
    getModificationInfoSync(key) {
        return this.getStrategy().getModificationInfoSync(key);
    }
    async synchronizeModifications() {
        await this.getStrategy().lookupVisitor();
        await this.getStrategy().synchronizeModifications();
        await this.getStrategy().cacheVisitor();
    }
    activateModification(key) {
        return this.getStrategy().activateModification(key);
    }
    activateModifications(params) {
        return this.getStrategy().activateModifications(params);
    }
    sendHit(hit) {
        return this.getStrategy().sendHit(hit);
    }
    sendHits(hits) {
        return this.getStrategy().sendHits(hits);
    }
    getAllModifications(activate = false) {
        return this.getStrategy().getAllModifications(activate);
    }
    getAllFlagsData(activate = false) {
        return this.getStrategy().getAllFlagsData(activate);
    }
    getModificationsForCampaign(campaignId, activate = false) {
        return this.getStrategy().getModificationsForCampaign(campaignId, activate);
    }
    getFlatsDataForCampaign(campaignId, activate = false) {
        return this.getStrategy().getFlatsDataForCampaign(campaignId, activate);
    }
    authenticate(visitorId) {
        this.getStrategy().authenticate(visitorId);
        this.updateCache();
    }
    unauthenticate() {
        this.getStrategy().unauthenticate();
        this.updateCache();
    }
    async fetchFlags() {
        await this.getStrategy().lookupVisitor();
        await this.getStrategy().fetchFlags();
        await this.getStrategy().cacheVisitor();
    }
    userExposed(param) {
        return this.getStrategy().userExposed(param);
    }
    getFlagValue(param) {
        return this.getStrategy().getFlagValue(param);
    }
    getFlagMetadata(param) {
        return this.getStrategy().getFlagMetadata(param);
    }
}


/***/ }),

/***/ "./src/visitor/VisitorStrategyAbstract.ts":
/*!************************************************!*\
  !*** ./src/visitor/VisitorStrategyAbstract.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LOOKUP_HITS_JSON_ERROR": () => (/* binding */ LOOKUP_HITS_JSON_ERROR),
/* harmony export */   "LOOKUP_HITS_JSON_OBJECT_ERROR": () => (/* binding */ LOOKUP_HITS_JSON_OBJECT_ERROR),
/* harmony export */   "LOOKUP_VISITOR_JSON_OBJECT_ERROR": () => (/* binding */ LOOKUP_VISITOR_JSON_OBJECT_ERROR),
/* harmony export */   "VISITOR_ID_MISMATCH_ERROR": () => (/* binding */ VISITOR_ID_MISMATCH_ERROR),
/* harmony export */   "VisitorStrategyAbstract": () => (/* binding */ VisitorStrategyAbstract)
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enum/index */ "./src/enum/index.ts");
/* harmony import */ var _hit_Consent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hit/Consent */ "./src/hit/Consent.ts");



const LOOKUP_HITS_JSON_ERROR = 'JSON DATA must be an array of object';
const LOOKUP_HITS_JSON_OBJECT_ERROR = 'JSON DATA must fit the type HitCacheDTO';
const LOOKUP_VISITOR_JSON_OBJECT_ERROR = 'JSON DATA must fit the type VisitorCacheDTO';
const VISITOR_ID_MISMATCH_ERROR = 'Visitor ID mismatch: {0} vs {1}';
class VisitorStrategyAbstract {
    visitor;
    get configManager() {
        return this.visitor.configManager;
    }
    get trackingManager() {
        return this.configManager.trackingManager;
    }
    get decisionManager() {
        return this.configManager.decisionManager;
    }
    get config() {
        return this.visitor.config;
    }
    constructor(visitor) {
        this.visitor = visitor;
    }
    updateCampaigns(campaigns) {
        try {
            this.visitor.campaigns = campaigns;
            this.visitor.flagsData = this.decisionManager.getModifications(campaigns);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.logError)(this.config, error.message || error, 'updateCampaigns');
        }
    }
    hasTrackingManager(process) {
        const check = this.trackingManager;
        if (!check) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.logError)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.sprintf)(_enum_index__WEBPACK_IMPORTED_MODULE_1__.TRACKER_MANAGER_MISSING_ERROR), process);
        }
        return !!check;
    }
    setConsent(hasConsented) {
        const method = 'setConsent';
        this.visitor.hasConsented = hasConsented;
        if (!hasConsented) {
            this.flushVisitor();
        }
        if (!this.hasTrackingManager(method)) {
            return;
        }
        const consentHit = new _hit_Consent__WEBPACK_IMPORTED_MODULE_2__.Consent({
            visitorConsent: hasConsented,
            visitorId: this.visitor.visitorId,
            anonymousId: this.visitor.anonymousId
        });
        consentHit.ds = _enum_index__WEBPACK_IMPORTED_MODULE_1__.SDK_APP;
        consentHit.config = this.config;
        this.trackingManager.addHit(consentHit).catch((error) => {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.logError)(this.config, error.message || error, method);
        });
    }
    checKLookupVisitorDataV1(item) {
        if (!item || !item.data || !item.data.visitorId) {
            return false;
        }
        const campaigns = item.data.campaigns;
        if (!campaigns) {
            return true;
        }
        if (!Array.isArray(campaigns)) {
            return false;
        }
        if (item.data.visitorId !== this.visitor.visitorId) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.logInfo)(this.config, (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.sprintf)(VISITOR_ID_MISMATCH_ERROR, item.data.visitorId, this.visitor.visitorId), 'lookupVisitor');
            return false;
        }
        return campaigns.every(x => x.campaignId && x.type && x.variationGroupId && x.variationId);
    }
    checKLookupVisitorData(item) {
        if (item.version === 1) {
            return this.checKLookupVisitorDataV1(item);
        }
        return false;
    }
    async lookupVisitor() {
        try {
            const visitorCacheInstance = this.config.visitorCacheImplementation;
            if (this.config.disableCache || !visitorCacheInstance || !visitorCacheInstance.lookupVisitor || typeof visitorCacheInstance.lookupVisitor !== 'function') {
                return;
            }
            const visitorCache = await visitorCacheInstance.lookupVisitor(this.visitor.visitorId);
            if (!visitorCache) {
                return;
            }
            if (!this.checKLookupVisitorData(visitorCache)) {
                throw new Error(LOOKUP_VISITOR_JSON_OBJECT_ERROR);
            }
            this.visitor.visitorCache = visitorCache;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.logError)(this.config, error.message || error, 'lookupVisitor');
        }
    }
    async cacheVisitor() {
        try {
            const visitorCacheInstance = this.config.visitorCacheImplementation;
            if (this.config.disableCache || !visitorCacheInstance || typeof visitorCacheInstance.cacheVisitor !== 'function') {
                return;
            }
            const assignmentsHistory = {};
            const data = {
                version: _enum_index__WEBPACK_IMPORTED_MODULE_1__.VISITOR_CACHE_VERSION,
                data: {
                    visitorId: this.visitor.visitorId,
                    anonymousId: this.visitor.anonymousId,
                    consent: this.visitor.hasConsented,
                    context: this.visitor.context,
                    campaigns: this.visitor.campaigns.map(campaign => {
                        assignmentsHistory[campaign.variationGroupId] = campaign.variation.id;
                        return {
                            campaignId: campaign.id,
                            slug: campaign.slug,
                            variationGroupId: campaign.variationGroupId,
                            variationId: campaign.variation.id,
                            isReference: campaign.variation.reference,
                            type: campaign.variation.modifications.type,
                            activated: false,
                            flags: campaign.variation.modifications.value
                        };
                    })
                }
            };
            data.data.assignmentsHistory = { ...this.visitor.visitorCache?.data?.assignmentsHistory, ...assignmentsHistory };
            await visitorCacheInstance.cacheVisitor(this.visitor.visitorId, data);
            this.visitor.visitorCache = data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.logError)(this.config, error.message || error, 'cacheVisitor');
        }
    }
    async flushVisitor() {
        try {
            const visitorCacheInstance = this.config.visitorCacheImplementation;
            if (this.config.disableCache || !visitorCacheInstance || typeof visitorCacheInstance.flushVisitor !== 'function') {
                return;
            }
            await visitorCacheInstance.flushVisitor(this.visitor.visitorId);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.logError)(this.config, error.message || error, 'flushVisitor');
        }
    }
}


/***/ }),

/***/ "./src/visitor/index.ts":
/*!******************************!*\
  !*** ./src/visitor/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NoConsentStrategy": () => (/* reexport safe */ _NoConsentStrategy__WEBPACK_IMPORTED_MODULE_0__.NoConsentStrategy),
/* harmony export */   "NotReadyStrategy": () => (/* reexport safe */ _NotReadyStrategy__WEBPACK_IMPORTED_MODULE_1__.NotReadyStrategy),
/* harmony export */   "DefaultStrategy": () => (/* reexport safe */ _DefaultStrategy__WEBPACK_IMPORTED_MODULE_2__.DefaultStrategy),
/* harmony export */   "PanicStrategy": () => (/* reexport safe */ _PanicStrategy__WEBPACK_IMPORTED_MODULE_3__.PanicStrategy),
/* harmony export */   "Visitor": () => (/* reexport safe */ _Visitor__WEBPACK_IMPORTED_MODULE_4__.Visitor),
/* harmony export */   "VisitorDelegate": () => (/* reexport safe */ _VisitorDelegate__WEBPACK_IMPORTED_MODULE_5__.VisitorDelegate)
/* harmony export */ });
/* harmony import */ var _NoConsentStrategy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NoConsentStrategy */ "./src/visitor/NoConsentStrategy.ts");
/* harmony import */ var _NotReadyStrategy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NotReadyStrategy */ "./src/visitor/NotReadyStrategy.ts");
/* harmony import */ var _DefaultStrategy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultStrategy */ "./src/visitor/DefaultStrategy.ts");
/* harmony import */ var _PanicStrategy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PanicStrategy */ "./src/visitor/PanicStrategy.ts");
/* harmony import */ var _Visitor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Visitor */ "./src/visitor/Visitor.ts");
/* harmony import */ var _VisitorDelegate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./VisitorDelegate */ "./src/visitor/VisitorDelegate.ts");








/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Flagship": () => (/* reexport safe */ _main_Flagship__WEBPACK_IMPORTED_MODULE_0__.Flagship),
/* harmony export */   "DecisionApiConfig": () => (/* reexport safe */ _config_index__WEBPACK_IMPORTED_MODULE_1__.DecisionApiConfig),
/* harmony export */   "DecisionMode": () => (/* reexport safe */ _config_index__WEBPACK_IMPORTED_MODULE_1__.DecisionMode),
/* harmony export */   "Event": () => (/* reexport safe */ _hit_index__WEBPACK_IMPORTED_MODULE_2__.Event),
/* harmony export */   "EventCategory": () => (/* reexport safe */ _hit_index__WEBPACK_IMPORTED_MODULE_2__.EventCategory),
/* harmony export */   "Item": () => (/* reexport safe */ _hit_index__WEBPACK_IMPORTED_MODULE_2__.Item),
/* harmony export */   "Page": () => (/* reexport safe */ _hit_index__WEBPACK_IMPORTED_MODULE_2__.Page),
/* harmony export */   "Screen": () => (/* reexport safe */ _hit_index__WEBPACK_IMPORTED_MODULE_2__.Screen),
/* harmony export */   "Transaction": () => (/* reexport safe */ _hit_index__WEBPACK_IMPORTED_MODULE_2__.Transaction),
/* harmony export */   "HitAbstract": () => (/* reexport safe */ _hit_index__WEBPACK_IMPORTED_MODULE_2__.HitAbstract),
/* harmony export */   "FlagshipStatus": () => (/* reexport safe */ _enum_index__WEBPACK_IMPORTED_MODULE_3__.FlagshipStatus),
/* harmony export */   "LogLevel": () => (/* reexport safe */ _enum_index__WEBPACK_IMPORTED_MODULE_3__.LogLevel),
/* harmony export */   "HitType": () => (/* reexport safe */ _enum_index__WEBPACK_IMPORTED_MODULE_3__.HitType),
/* harmony export */   "BatchStrategy": () => (/* reexport safe */ _enum_index__WEBPACK_IMPORTED_MODULE_3__.BatchStrategy),
/* harmony export */   "APP_VERSION_CODE": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.APP_VERSION_CODE),
/* harmony export */   "APP_VERSION_NAME": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.APP_VERSION_NAME),
/* harmony export */   "CARRIER_NAME": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.CARRIER_NAME),
/* harmony export */   "DEVICE_LOCALE": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.DEVICE_LOCALE),
/* harmony export */   "DEVICE_MODEL": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.DEVICE_MODEL),
/* harmony export */   "DEVICE_TYPE": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.DEVICE_TYPE),
/* harmony export */   "FLAGSHIP_CLIENT": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.FLAGSHIP_CLIENT),
/* harmony export */   "FLAGSHIP_CONTEXT": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.FLAGSHIP_CONTEXT),
/* harmony export */   "FLAGSHIP_VERSION": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.FLAGSHIP_VERSION),
/* harmony export */   "FLAGSHIP_VISITOR": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.FLAGSHIP_VISITOR),
/* harmony export */   "INTERFACE_NAME": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.INTERFACE_NAME),
/* harmony export */   "INTERNET_CONNECTION": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.INTERNET_CONNECTION),
/* harmony export */   "IP": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.IP),
/* harmony export */   "LOCATION_CITY": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.LOCATION_CITY),
/* harmony export */   "LOCATION_COUNTRY": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.LOCATION_COUNTRY),
/* harmony export */   "LOCATION_LAT": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.LOCATION_LAT),
/* harmony export */   "LOCATION_LONG": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.LOCATION_LONG),
/* harmony export */   "LOCATION_REGION": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.LOCATION_REGION),
/* harmony export */   "OS_NAME": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.OS_NAME),
/* harmony export */   "OS_VERSION_CODE": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.OS_VERSION_CODE),
/* harmony export */   "OS_VERSION_NAME": () => (/* reexport safe */ _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__.OS_VERSION_NAME),
/* harmony export */   "Visitor": () => (/* reexport safe */ _visitor_index__WEBPACK_IMPORTED_MODULE_6__.Visitor),
/* harmony export */   "Flag": () => (/* reexport safe */ _flag_index__WEBPACK_IMPORTED_MODULE_7__.Flag),
/* harmony export */   "FlagMetadata": () => (/* reexport safe */ _flag_index__WEBPACK_IMPORTED_MODULE_7__.FlagMetadata),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _main_Flagship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main/Flagship */ "./src/main/Flagship.ts");
/* harmony import */ var _config_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config/index */ "./src/config/index.ts");
/* harmony import */ var _hit_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hit/index */ "./src/hit/index.ts");
/* harmony import */ var _enum_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enum/index */ "./src/enum/index.ts");
/* harmony import */ var _enum_FlagshipContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./enum/FlagshipContext */ "./src/enum/FlagshipContext.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./types */ "./src/types.ts");
/* harmony import */ var _visitor_index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./visitor/index */ "./src/visitor/index.ts");
/* harmony import */ var _flag_index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./flag/index */ "./src/flag/index.ts");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_main_Flagship__WEBPACK_IMPORTED_MODULE_0__.Flagship);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.jamstack.js.map
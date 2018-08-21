(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/EntityList.ts":
/*!***************************!*\
  !*** ./src/EntityList.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    }\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EntityListBase_1 = __webpack_require__(/*! ./EntityListBase */ \"./src/EntityListBase.ts\");\r\nvar EventEmitter_1 = __webpack_require__(/*! ./EventEmitter */ \"./src/EventEmitter.ts\");\r\nvar EEntityListEventTypes;\r\n(function (EEntityListEventTypes) {\r\n    EEntityListEventTypes[\"set\"] = \"set\";\r\n    EEntityListEventTypes[\"unset\"] = \"unset\";\r\n})(EEntityListEventTypes = exports.EEntityListEventTypes || (exports.EEntityListEventTypes = {}));\r\n;\r\nvar EntityList = /** @class */ (function (_super) {\r\n    __extends(EntityList, _super);\r\n    function EntityList(idKey, transform) {\r\n        if (idKey === void 0) { idKey = \"idKey\"; }\r\n        if (transform === void 0) { transform = null; }\r\n        var _this = _super.call(this, idKey) || this;\r\n        _this.eventEmitter = new EventEmitter_1.EventEmitter();\r\n        _this.parent = null;\r\n        _this.parentSetListenerId = null;\r\n        _this.parentUnsetListenerId = null;\r\n        _this.transform = null;\r\n        _this.transform = transform;\r\n        return _this;\r\n    }\r\n    EntityList.prototype.set = function (data) {\r\n        if (this.parent)\r\n            return this.parent.set(data);\r\n        return this.setLocal(data);\r\n    };\r\n    EntityList.prototype.unset = function (data) {\r\n        if (this.parent)\r\n            return this.parent.unset(data);\r\n        return this.unsetLocal(data);\r\n    };\r\n    EntityList.prototype.setLocal = function (data) {\r\n        var entity = _super.prototype.set.call(this, data);\r\n        this.eventEmitter.emit(EEntityListEventTypes.set, entity);\r\n        return entity;\r\n    };\r\n    EntityList.prototype.unsetLocal = function (data) {\r\n        var entity = _super.prototype.unset.call(this, data);\r\n        if (entity)\r\n            this.eventEmitter.emit(EEntityListEventTypes.unset, entity);\r\n        return entity;\r\n    };\r\n    EntityList.prototype.pipe = function (transform) {\r\n        var el = new EntityList(this.idKey, transform);\r\n        el.pipeFrom(this);\r\n        return el;\r\n    };\r\n    EntityList.prototype.pipeFrom = function (parent) {\r\n        var _this = this;\r\n        this.parent = parent;\r\n        this.parentSetListenerId = parent.on(EEntityListEventTypes.set, function (data) {\r\n            var entity;\r\n            if (_this.transform) {\r\n                var result = _this.transform(data);\r\n                if (typeof result === \"boolean\") {\r\n                    if (result)\r\n                        entity = data;\r\n                }\r\n                else {\r\n                    entity = result;\r\n                }\r\n            }\r\n            else\r\n                entity = data;\r\n            if (entity)\r\n                _this.setLocalExact(entity);\r\n        });\r\n        this.parentUnsetListenerId = parent.on(EEntityListEventTypes.unset, function (data) { return _this.unsetLocal(data); });\r\n        return this;\r\n    };\r\n    EntityList.prototype.unpipe = function () {\r\n        var parent = this.parent;\r\n        if (!parent)\r\n            return;\r\n        parent.off(this.parentSetListenerId);\r\n        parent.off(this.parentUnsetListenerId);\r\n        this.parentSetListenerId = null;\r\n        this.parentUnsetListenerId = null;\r\n        return this;\r\n    };\r\n    EntityList.prototype.on = function (eventType, fn, context) {\r\n        return this.eventEmitter.on(eventType, fn, context);\r\n    };\r\n    EntityList.prototype.off = function (listenerId) {\r\n        this.eventEmitter.off(listenerId);\r\n    };\r\n    return EntityList;\r\n}(EntityListBase_1.EntityListBase));\r\nexports.EntityList = EntityList;\r\n\n\n//# sourceURL=webpack:///./src/EntityList.ts?");

/***/ }),

/***/ "./src/EntityListBase.ts":
/*!*******************************!*\
  !*** ./src/EntityListBase.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EntityListBase = /** @class */ (function () {\r\n    function EntityListBase(idKey) {\r\n        if (idKey === void 0) { idKey = \"idKey\"; }\r\n        this.length = 0;\r\n        this.updateTime = 0;\r\n        this.renderTime = 0;\r\n        this.nextEntityIdInc = 0;\r\n        this.renderedEntities = [];\r\n        this.entityContainers = [];\r\n        this.entityContainersMap = {};\r\n        this.idKey = idKey;\r\n    }\r\n    EntityListBase.prototype.set = function (data) {\r\n        var _a;\r\n        var passedId = this.findId(data);\r\n        var entityId = passedId ? passedId : this.generateId();\r\n        var container = this.entityContainersMap[entityId];\r\n        // if new entity\r\n        if (!container) {\r\n            container = this.entityContainersMap[entityId] = { entity: null };\r\n            this.entityContainers.push(container);\r\n            this.length++;\r\n        }\r\n        var entity = __assign({}, data, (_a = {}, _a[this.idKey] = entityId, _a));\r\n        container.entity = entity;\r\n        this.updateTime = Date.now();\r\n        return entity;\r\n    };\r\n    EntityListBase.prototype.get = function (data) {\r\n        var entityId = typeof data === \"string\" ? data : this.findId(data);\r\n        var container = this.entityContainersMap[entityId];\r\n        return container ? container.entity : undefined;\r\n    };\r\n    EntityListBase.prototype.unset = function (data) {\r\n        var entityId = this.findId(data);\r\n        if (!entityId)\r\n            return;\r\n        var container = this.entityContainersMap[entityId];\r\n        delete this.entityContainersMap[entityId];\r\n        if (!container)\r\n            return;\r\n        var index = this.entityContainers.indexOf(container);\r\n        if (index === -1)\r\n            return;\r\n        this.entityContainers.splice(index, 1);\r\n        this.length--;\r\n        this.updateTime = Date.now();\r\n        return container.entity;\r\n    };\r\n    EntityListBase.prototype.setMany = function (datas) {\r\n        datas.forEach(this.set, this);\r\n    };\r\n    EntityListBase.prototype.toArray = function () {\r\n        if (this.renderTime < this.updateTime)\r\n            this.render();\r\n        return this.renderedEntities;\r\n    };\r\n    EntityListBase.prototype.setLocalExact = function (entity) {\r\n        var entityId = entity[this.idKey];\r\n        var container = this.entityContainersMap[entityId];\r\n        // if new entity\r\n        if (!container) {\r\n            container = this.entityContainersMap[entityId] = { entity: null };\r\n            this.entityContainers.push(container);\r\n            this.length++;\r\n        }\r\n        container.entity = entity;\r\n        this.updateTime = Date.now();\r\n        return entity;\r\n    };\r\n    EntityListBase.prototype.findId = function (data) {\r\n        var foundId = typeof data === \"string\" ? data : data[this.idKey];\r\n        return typeof foundId === \"string\" ? foundId : undefined;\r\n    };\r\n    EntityListBase.prototype.generateId = function () {\r\n        return \"entity_\" + this.nextEntityIdInc++;\r\n    };\r\n    EntityListBase.prototype.render = function () {\r\n        this.renderedEntities = Object.freeze(this.entityContainers.map(function (_a) {\r\n            var entity = _a.entity;\r\n            return entity;\r\n        }));\r\n        this.renderTime = Date.now();\r\n    };\r\n    return EntityListBase;\r\n}());\r\nexports.EntityListBase = EntityListBase;\r\n\n\n//# sourceURL=webpack:///./src/EntityListBase.ts?");

/***/ }),

/***/ "./src/EventEmitter.ts":
/*!*****************************!*\
  !*** ./src/EventEmitter.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EventEmitter = /** @class */ (function () {\r\n    function EventEmitter() {\r\n        this.listeners = {};\r\n        this.listenersMap = {}; // `listener id => event name` map\r\n        this.nextListenerId = 0;\r\n    }\r\n    EventEmitter.prototype.on = function (eventType, fn, context) {\r\n        var listeners = this.listeners[eventType] || (this.listeners[eventType] = []);\r\n        var id = this.nextListenerId;\r\n        this.nextListenerId += 1;\r\n        var listener = { id: id, fn: fn, context: context };\r\n        listeners.push(listener);\r\n        this.listenersMap[id] = {\r\n            eventType: eventType,\r\n            listener: listener\r\n        };\r\n        return id;\r\n    };\r\n    EventEmitter.prototype.off = function (listenerId) {\r\n        var meta = this.listenersMap[listenerId];\r\n        if (!meta)\r\n            return;\r\n        var listeners = this.listeners[meta.eventType];\r\n        var index = listeners.indexOf(meta.listener);\r\n        if (index === -1)\r\n            return;\r\n        listeners.splice(index, 1);\r\n        delete this.listenersMap[listenerId];\r\n        if (listeners.length === 0)\r\n            delete this.listeners[meta.eventType];\r\n    };\r\n    EventEmitter.prototype.emit = function (event, data) {\r\n        var listeners = this.listeners[event];\r\n        if (!listeners)\r\n            return;\r\n        listeners.forEach(function (_a) {\r\n            var fn = _a.fn, context = _a.context;\r\n            return fn.call(context, data);\r\n        });\r\n    };\r\n    return EventEmitter;\r\n}());\r\nexports.EventEmitter = EventEmitter;\r\n\n\n//# sourceURL=webpack:///./src/EventEmitter.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EntityList_1 = __webpack_require__(/*! ./EntityList */ \"./src/EntityList.ts\");\r\nexports.EntityList = EntityList_1.EntityList;\r\nexports.EEntityListEventTypes = EntityList_1.EEntityListEventTypes;\r\nvar EntityListBase_1 = __webpack_require__(/*! ./EntityListBase */ \"./src/EntityListBase.ts\");\r\nexports.EntityListBase = EntityListBase_1.EntityListBase;\r\nvar EventEmitter_1 = __webpack_require__(/*! ./EventEmitter */ \"./src/EventEmitter.ts\");\r\nexports.EventEmitter = EventEmitter_1.EventEmitter;\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });
});
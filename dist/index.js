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
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EntityList = /** @class */ (function () {\r\n    function EntityList(options) {\r\n        if (options === void 0) { options = {}; }\r\n        this.length = 0;\r\n        this.entities = [];\r\n        this.sortedEntities = {};\r\n        this.id = String(options.id);\r\n        this.idKey = options.idKey || \"id\";\r\n    }\r\n    EntityList.prototype.set = function (data) {\r\n        var id = data[this.idKey];\r\n        this.remove(this.sortedEntities[id]);\r\n        this.entities.push(data);\r\n        this.sortedEntities[id] = data;\r\n        this.length = this.entities.length;\r\n        return data;\r\n    };\r\n    EntityList.prototype.get = function (data) {\r\n        var id = typeof data === \"string\" ? data : data[this.idKey];\r\n        return this.sortedEntities[id];\r\n    };\r\n    EntityList.prototype.unset = function (data) {\r\n        var id = typeof data === \"string\" ? data : data[this.idKey];\r\n        var entity = this.sortedEntities[id];\r\n        return this.remove(entity);\r\n    };\r\n    EntityList.prototype.toArray = function () {\r\n        return Object.freeze(this.entities.slice());\r\n    };\r\n    EntityList.prototype.toObject = function () {\r\n        return Object.freeze(__assign({}, this.sortedEntities));\r\n    };\r\n    EntityList.prototype.remove = function (data) {\r\n        var index = this.entities.indexOf(data);\r\n        if (index === -1)\r\n            return;\r\n        this.entities = this.entities.slice(0, index).concat(this.entities.slice(index + 1));\r\n        delete this.sortedEntities[data[this.idKey]];\r\n        this.length = this.entities.length;\r\n        return data;\r\n    };\r\n    return EntityList;\r\n}());\r\nexports.EntityList = EntityList;\r\n\n\n//# sourceURL=webpack:///./src/EntityList.ts?");

/***/ }),

/***/ "./src/EntityManager.ts":
/*!******************************!*\
  !*** ./src/EntityManager.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EntityList_1 = __webpack_require__(/*! ./EntityList */ \"./src/EntityList.ts\");\r\nvar EventEmitter_1 = __webpack_require__(/*! ./EventEmitter */ \"./src/EventEmitter.ts\");\r\nvar EEntityManagerEventTypes;\r\n(function (EEntityManagerEventTypes) {\r\n    EEntityManagerEventTypes[\"set\"] = \"set\";\r\n    EEntityManagerEventTypes[\"unset\"] = \"unset\";\r\n    EEntityManagerEventTypes[\"update\"] = \"update\";\r\n})(EEntityManagerEventTypes = exports.EEntityManagerEventTypes || (exports.EEntityManagerEventTypes = {}));\r\nvar EntityManager = /** @class */ (function () {\r\n    function EntityManager(options) {\r\n        if (options === void 0) { options = {}; }\r\n        this.groups = Object.freeze({});\r\n        this.version = Symbol();\r\n        this.lastEntity = null;\r\n        this.parentListenerIds = [];\r\n        this.eventEmitter = new EventEmitter_1.EventEmitter();\r\n        this.idKey = options.idKey || \"id\";\r\n        this.groupEntityLists = new EntityList_1.EntityList({ idKey: \"id\" });\r\n        this.groupTransforms = new EntityList_1.EntityList({ idKey: \"id\", });\r\n        if (options.parent)\r\n            this.setParent(options.parent);\r\n        if (options.groups)\r\n            this.groupMany(options.groups);\r\n    }\r\n    EntityManager.prototype.group = function (id, transform) {\r\n        var _a;\r\n        this.groupTransforms.set({\r\n            id: id,\r\n            transform: transform,\r\n        });\r\n        var el = new EntityList_1.EntityList({ idKey: this.idKey, id: id });\r\n        this.groupEntityLists.set(el);\r\n        this.groups = __assign({}, this.groups, (_a = {}, _a[id] = el, _a));\r\n    };\r\n    EntityManager.prototype.ungroup = function (id) {\r\n        this.groupTransforms.unset(id);\r\n    };\r\n    EntityManager.prototype.getGroups = function () {\r\n        return this.groupEntityLists.toObject();\r\n    };\r\n    EntityManager.prototype.groupMany = function (groups) {\r\n        var _this = this;\r\n        Object\r\n            .keys(groups)\r\n            .forEach(function (groupId) {\r\n            _this.group(groupId, groups[groupId]);\r\n        }, this);\r\n    };\r\n    EntityManager.prototype.set = function (data) {\r\n        if (this.parent)\r\n            this.parent.set(data);\r\n        else\r\n            this.setLocal(data);\r\n    };\r\n    EntityManager.prototype.unset = function (data) {\r\n        if (this.parent)\r\n            this.parent.unset(data);\r\n        else\r\n            this.unsetLocal(data);\r\n    };\r\n    EntityManager.prototype.setMany = function (datas) {\r\n        var versionBefore = this.version;\r\n        this.eventEmitter.mute();\r\n        datas.forEach(this.set, this);\r\n        this.eventEmitter.unmute();\r\n        // if any of datas went to any of groups\r\n        if (versionBefore !== this.version)\r\n            this.eventEmitter.emit(EEntityManagerEventTypes.update, this.lastEntity);\r\n    };\r\n    EntityManager.prototype.unsetMany = function (datas) {\r\n        var versionBefore = this.version;\r\n        this.eventEmitter.mute();\r\n        datas.forEach(this.unset, this);\r\n        this.eventEmitter.unmute();\r\n        // if any of datas went to any of groups\r\n        if (versionBefore !== this.version)\r\n            this.eventEmitter.emit(EEntityManagerEventTypes.update, this.lastEntity);\r\n    };\r\n    EntityManager.prototype.setLocal = function (data) {\r\n        var _this = this;\r\n        var isSet = false;\r\n        var isUnset = false;\r\n        this.groupTransforms.toArray().forEach(function (_a) {\r\n            var id = _a.id, transform = _a.transform;\r\n            var result = transform(data);\r\n            var group = _this.groupEntityLists.get(id);\r\n            if (result === false) {\r\n                var unsetResult = group.unset(data);\r\n                if (unsetResult) {\r\n                    isUnset = !isSet;\r\n                    _this.lastEntity = data;\r\n                    _this.version = Symbol();\r\n                }\r\n            }\r\n            else {\r\n                var entity = result === true ? data : result;\r\n                group.set(entity);\r\n                _this.lastEntity = data;\r\n                _this.version = Symbol();\r\n                isSet = true;\r\n                isUnset = false;\r\n            }\r\n        });\r\n        if (isSet)\r\n            this.eventEmitter.emit(EEntityManagerEventTypes.set, data);\r\n        else if (isUnset)\r\n            this.eventEmitter.emit(EEntityManagerEventTypes.unset, data);\r\n    };\r\n    EntityManager.prototype.unsetLocal = function (data) {\r\n        var _this = this;\r\n        this.groupTransforms.toArray().forEach(function (_a) {\r\n            var id = _a.id;\r\n            var group = _this.groupEntityLists.get(id);\r\n            var result = group.unset(data);\r\n            if (result) {\r\n                _this.lastEntity = result;\r\n                _this.version = Symbol();\r\n            }\r\n        });\r\n        this.eventEmitter.emit(EEntityManagerEventTypes.unset, data);\r\n    };\r\n    EntityManager.prototype.setParent = function (parent) {\r\n        if (this.parent)\r\n            this.unsetParent();\r\n        this.parent = parent;\r\n        this.parentListenerIds = [\r\n            parent.on(EEntityManagerEventTypes.set, this.setLocal, this),\r\n            parent.on(EEntityManagerEventTypes.unset, this.unsetLocal, this),\r\n        ];\r\n    };\r\n    EntityManager.prototype.unsetParent = function () {\r\n        if (!this.parent)\r\n            return;\r\n        this.parentListenerIds.forEach(this.parent.off, this.parent);\r\n        this.parent = undefined;\r\n    };\r\n    EntityManager.prototype.on = function (eventId, listener, thisArg) {\r\n        return this.eventEmitter.on(eventId, listener, thisArg);\r\n    };\r\n    EntityManager.prototype.off = function (listenerId) {\r\n        this.eventEmitter.off(listenerId);\r\n    };\r\n    EntityManager.prototype.branch = function (options) {\r\n        return new EntityManager({\r\n            parent: this,\r\n            idKey: this.idKey,\r\n            groups: options ? options.groups : undefined,\r\n        });\r\n    };\r\n    EntityManager.generateId = function () {\r\n        return Symbol(\"entityId\");\r\n    };\r\n    EntityManager.nextIdInc = 0;\r\n    return EntityManager;\r\n}());\r\nexports.EntityManager = EntityManager;\r\n\n\n//# sourceURL=webpack:///./src/EntityManager.ts?");

/***/ }),

/***/ "./src/EventEmitter.ts":
/*!*****************************!*\
  !*** ./src/EventEmitter.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EventEmitter = /** @class */ (function () {\r\n    function EventEmitter() {\r\n        this.listenerContainers = {};\r\n        this.sortedListenerContainers = {};\r\n        this.isMuted = false;\r\n    }\r\n    EventEmitter.prototype.on = function (eventId, listener, thisArg) {\r\n        if (!this.listenerContainers[eventId])\r\n            this.listenerContainers[eventId] = [];\r\n        var id = Symbol();\r\n        var container = {\r\n            id: id,\r\n            listener: listener,\r\n            thisArg: thisArg,\r\n            eventId: eventId,\r\n        };\r\n        this.listenerContainers[eventId].push(container);\r\n        this.sortedListenerContainers[id] = container;\r\n        return id;\r\n    };\r\n    EventEmitter.prototype.off = function (listenerId) {\r\n        var listener = this.sortedListenerContainers[listenerId];\r\n        if (!listener)\r\n            return;\r\n        var listeners = this.listenerContainers[listener.eventId];\r\n        var index = listeners.indexOf(listener);\r\n        listeners.splice(index, 1);\r\n        delete this.sortedListenerContainers[listenerId];\r\n    };\r\n    EventEmitter.prototype.emit = function (eventId, data) {\r\n        if (this.isMuted)\r\n            return;\r\n        var listeners = this.listenerContainers[eventId];\r\n        if (!listeners)\r\n            return;\r\n        listeners\r\n            .forEach(function (_a) {\r\n            var listener = _a.listener, thisArg = _a.thisArg;\r\n            listener.call(thisArg, data);\r\n        });\r\n    };\r\n    EventEmitter.prototype.clear = function () {\r\n        this.sortedListenerContainers = {};\r\n        this.listenerContainers = {};\r\n    };\r\n    EventEmitter.prototype.mute = function () {\r\n        this.isMuted = true;\r\n    };\r\n    EventEmitter.prototype.unmute = function () {\r\n        this.isMuted = false;\r\n    };\r\n    return EventEmitter;\r\n}());\r\nexports.EventEmitter = EventEmitter;\r\n\n\n//# sourceURL=webpack:///./src/EventEmitter.ts?");

/***/ }),

/***/ "./src/SystemManager.ts":
/*!******************************!*\
  !*** ./src/SystemManager.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EntityManager_1 = __webpack_require__(/*! ./EntityManager */ \"./src/EntityManager.ts\");\r\nvar SystemManager = /** @class */ (function () {\r\n    function SystemManager(options) {\r\n        if (options === void 0) { options = { idKey: \"id\" }; }\r\n        this.systemContainers = [];\r\n        this.idKey = this.idKey;\r\n        this.entities = new EntityManager_1.EntityManager({\r\n            idKey: this.idKey,\r\n            groups: { all: function () { return true; }, },\r\n        });\r\n        if (options.systems)\r\n            this.addMany(options.systems);\r\n    }\r\n    SystemManager.prototype.add = function (system) {\r\n        this.systemContainers.push({\r\n            system: system,\r\n            branch: this.entities.branch({ groups: system.groups }),\r\n            branchListenerIds: [],\r\n            isInUpdate: false,\r\n            updateTimeoutId: null\r\n        });\r\n    };\r\n    SystemManager.prototype.addMany = function (systems) {\r\n        systems.forEach(this.add, this);\r\n    };\r\n    SystemManager.prototype.start = function () {\r\n        this.systemContainers.forEach(function (container) {\r\n            var system = container.system, branch = container.branch;\r\n            if (system.update) {\r\n                var updateHandler_1 = function () {\r\n                    clearTimeout(container.updateTimeoutId);\r\n                    if (container.isInUpdate) {\r\n                        container.updateTimeoutId = setTimeout(updateHandler_1, 0);\r\n                        return;\r\n                    }\r\n                    container.isInUpdate = true;\r\n                    system.update(branch, system);\r\n                    container.isInUpdate = false;\r\n                };\r\n                container.branchListenerIds = [\r\n                    branch.on(EntityManager_1.EEntityManagerEventTypes.set, updateHandler_1),\r\n                    branch.on(EntityManager_1.EEntityManagerEventTypes.unset, updateHandler_1),\r\n                    branch.on(EntityManager_1.EEntityManagerEventTypes.update, updateHandler_1),\r\n                ];\r\n            }\r\n            if (system.start) {\r\n                container.isInUpdate = true;\r\n                system.start(branch, system);\r\n                container.isInUpdate = false;\r\n            }\r\n        });\r\n    };\r\n    SystemManager.prototype.stop = function () {\r\n        this.systemContainers.forEach(function (_a) {\r\n            var branchListenerIds = _a.branchListenerIds, branch = _a.branch, system = _a.system;\r\n            branchListenerIds.forEach(branch.off, branch);\r\n            if (system.stop)\r\n                system.stop(branch, system);\r\n        });\r\n    };\r\n    return SystemManager;\r\n}());\r\nexports.SystemManager = SystemManager;\r\n\n\n//# sourceURL=webpack:///./src/SystemManager.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EntityList_1 = __webpack_require__(/*! ./EntityList */ \"./src/EntityList.ts\");\r\nexports.EntityList = EntityList_1.EntityList;\r\nvar EntityManager_1 = __webpack_require__(/*! ./EntityManager */ \"./src/EntityManager.ts\");\r\nexports.EntityManager = EntityManager_1.EntityManager;\r\nexports.EEntityManagerEventTypes = EntityManager_1.EEntityManagerEventTypes;\r\nvar EventEmitter_1 = __webpack_require__(/*! ./EventEmitter */ \"./src/EventEmitter.ts\");\r\nexports.EventEmitter = EventEmitter_1.EventEmitter;\r\nvar SystemManager_1 = __webpack_require__(/*! ./SystemManager */ \"./src/SystemManager.ts\");\r\nexports.SystemManager = SystemManager_1.SystemManager;\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });
});
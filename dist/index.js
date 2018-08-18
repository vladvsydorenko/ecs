/******/ (function(modules) { // webpackBootstrap
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

/***/ "./src/EntityManager.ts":
/*!******************************!*\
  !*** ./src/EntityManager.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n;\r\nvar EEntityManagerEventTypes;\r\n(function (EEntityManagerEventTypes) {\r\n    EEntityManagerEventTypes[\"set\"] = \"set\";\r\n    EEntityManagerEventTypes[\"unset\"] = \"unset\";\r\n})(EEntityManagerEventTypes = exports.EEntityManagerEventTypes || (exports.EEntityManagerEventTypes = {}));\r\n;\r\nvar EntityManager = /** @class */ (function () {\r\n    function EntityManager(entities) {\r\n        if (entities === void 0) { entities = {}; }\r\n        this.length = 0;\r\n        this.listeners = {};\r\n        this.nextEntityId = 0;\r\n        this.nextListenerId = 0;\r\n        this.entities = entities;\r\n        this.lastUpdated = Date.now();\r\n    }\r\n    EntityManager.prototype.set = function (data) {\r\n        var id = data.id !== undefined ? data.id : \"entity_\" + this.nextEntityId++;\r\n        var entity = this.entities[id] = Object.freeze(__assign({}, data, { id: id }));\r\n        this.length = Object.keys(this.entities).length;\r\n        this.lastUpdated = Date.now();\r\n        this.notify(EEntityManagerEventTypes.set, entity);\r\n        return entity;\r\n    };\r\n    EntityManager.prototype.unset = function (entity) {\r\n        if (!this.entities[entity.id])\r\n            throw new Error(\"Attempt to unset not existed entity by id \\\"\" + entity.id + \"\\\"\");\r\n        delete this.entities[entity.id];\r\n        this.length = Object.keys(this.entities).length;\r\n        this.lastUpdated = Date.now();\r\n        this.notify(EEntityManagerEventTypes.unset, entity);\r\n    };\r\n    EntityManager.prototype.on = function (event, fn, context) {\r\n        var id = this.nextListenerId++;\r\n        var listeners = this.listeners[event] || (this.listeners[event] = []);\r\n        listeners.push({\r\n            id: id,\r\n            fn: fn,\r\n            context: context\r\n        });\r\n        return id;\r\n    };\r\n    EntityManager.prototype.off = function (id) {\r\n        var _this = this;\r\n        Object.keys(this.listeners).forEach(function (event) {\r\n            var index;\r\n            _this.listeners[event].some(function (listener, i) {\r\n                if (listener.id !== id)\r\n                    return;\r\n                index = i;\r\n                return true;\r\n            });\r\n            if (index === undefined)\r\n                return;\r\n            _this.listeners[event].splice(index, 1);\r\n            if (_this.listeners[event].length === 0)\r\n                delete _this.listeners[event];\r\n        });\r\n    };\r\n    EntityManager.prototype.toArray = function () {\r\n        var _this = this;\r\n        return Object.keys(this.entities).map(function (key) { return _this.entities[key]; });\r\n    };\r\n    EntityManager.prototype.forEach = function (fn) {\r\n        this.toArray().forEach(fn);\r\n    };\r\n    EntityManager.prototype.filter = function (fn) {\r\n        return this.toArray().filter(fn);\r\n    };\r\n    EntityManager.prototype.find = function (fn) {\r\n        return this.toArray().find(fn);\r\n    };\r\n    EntityManager.prototype.some = function (fn) {\r\n        return this.toArray().some(fn);\r\n    };\r\n    EntityManager.prototype.every = function (fn) {\r\n        return this.toArray().every(fn);\r\n    };\r\n    EntityManager.prototype.notify = function (event, entity) {\r\n        var listeners = this.listeners[event];\r\n        if (!listeners)\r\n            return;\r\n        listeners.forEach(function (listener) {\r\n            listener.context ? listener.fn.call(listener.context, entity) : listener.fn(entity);\r\n        });\r\n    };\r\n    return EntityManager;\r\n}());\r\nexports.EntityManager = EntityManager;\r\n\n\n//# sourceURL=webpack:///./src/EntityManager.ts?");

/***/ }),

/***/ "./src/SystemManager.ts":
/*!******************************!*\
  !*** ./src/SystemManager.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar EntityManager_1 = __webpack_require__(/*! ./EntityManager */ \"./src/EntityManager.ts\");\r\nvar SystemManager = /** @class */ (function () {\r\n    function SystemManager(em) {\r\n        this.systems = [];\r\n        this.emListenerIds = [];\r\n        this.isInUpdate = false;\r\n        this.nextSystemId = 0;\r\n        this.updateTimeoutId = null;\r\n        this.em = em;\r\n    }\r\n    SystemManager.prototype.start = function () {\r\n        var em = this.em;\r\n        this.systems.forEach(function (_a) {\r\n            var system = _a.system;\r\n            return system.start && system.start(em);\r\n        });\r\n        this.emListenerIds.push(em.on(EntityManager_1.EEntityManagerEventTypes.set, this.onUpdate, this));\r\n        this.emListenerIds.push(em.on(EntityManager_1.EEntityManagerEventTypes.unset, this.onUpdate, this));\r\n        if (this.systems.length > 0 && this.em.length > 0)\r\n            this.update();\r\n    };\r\n    SystemManager.prototype.stop = function () {\r\n        var _this = this;\r\n        this.emListenerIds.forEach(function (id) { return _this.em.off(id); });\r\n    };\r\n    SystemManager.prototype.add = function (system) {\r\n        var id = this.nextSystemId++;\r\n        this.systems.push({\r\n            id: id,\r\n            system: system,\r\n            lastUpdated: null,\r\n        });\r\n        return id;\r\n    };\r\n    SystemManager.prototype.remove = function (id) {\r\n        var index = -1;\r\n        this.systems.some(function (system, i) {\r\n            if (system.id !== id)\r\n                return;\r\n            index = i;\r\n            return true;\r\n        });\r\n        if (index === -1)\r\n            throw new Error(\"Attempt to remove not added system with id \\\"\" + id + \"\\\"\");\r\n        this.systems.splice(index, 1);\r\n    };\r\n    SystemManager.prototype.update = function () {\r\n        var em = this.em;\r\n        this.isInUpdate = true;\r\n        this.systems.forEach(function (container) {\r\n            if (container.lastUpdated === em.lastUpdated)\r\n                return;\r\n            container.system.update(em);\r\n            container.lastUpdated = em.lastUpdated;\r\n        });\r\n        this.isInUpdate = false;\r\n    };\r\n    SystemManager.prototype.onUpdate = function () {\r\n        var _this = this;\r\n        if (!this.isInUpdate) {\r\n            this.update();\r\n            return;\r\n        }\r\n        clearTimeout(this.updateTimeoutId);\r\n        this.updateTimeoutId = setTimeout(function () { return _this.onUpdate(); });\r\n    };\r\n    return SystemManager;\r\n}());\r\nexports.SystemManager = SystemManager;\r\n\n\n//# sourceURL=webpack:///./src/SystemManager.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar sm = __webpack_require__(/*! ./SystemManager */ \"./src/SystemManager.ts\");\r\nvar em = __webpack_require__(/*! ./EntityManager */ \"./src/EntityManager.ts\");\r\nvar ECS;\r\n(function (ECS) {\r\n    ECS.SystemManager = sm.SystemManager;\r\n    ECS.EntityManager = em.EntityManager;\r\n    ECS.EEntityManagerEventTypes = em.EEntityManagerEventTypes;\r\n})(ECS = exports.ECS || (exports.ECS = {}));\r\n;\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });
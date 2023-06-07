/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _main_nim__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.nim */ \"./src/main.nim\");\n/* harmony import */ var _main_nim__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_main_nim__WEBPACK_IMPORTED_MODULE_0__);\n\n_main_nim__WEBPACK_IMPORTED_MODULE_0___default().hello();\n\n//# sourceURL=webpack://my-webpack-project/./src/index.js?");

/***/ }),

/***/ "./src/main.nim":
/*!**********************!*\
  !*** ./src/main.nim ***!
  \**********************/
/***/ (() => {

eval("throw new Error(\"Module build failed (from ./node_modules/nim-loader/dist/loader.js):\\nError: Command failed: nim js -o:/tmp/403f02edfb2532ea190728a9dc5062c3.js /home/casper/projects/site2/scripts/nim_load/src/main.nim\\nHint: used config file '/home/casper/.choosenim/toolchains/nim-1.6.10/config/nim.cfg' [Conf]\\nHint: used config file '/home/casper/.choosenim/toolchains/nim-1.6.10/config/config.nims' [Conf]\\n.......................................................................\\n/home/casper/projects/site2/scripts/nim_load/src/world.nim(3, 1) Hint: duplicate import of 'types'; previous import here: /home/casper/projects/site2/scripts/nim_load/src/world.nim(2, 6) [DuplicateModuleImport]\\n.\\n/home/casper/projects/site2/scripts/nim_load/src/world.nim(57, 6) Hint: 'diffuse' is declared but not used [XDeclaredButNotUsed]\\n/home/casper/projects/site2/scripts/nim_load/src/random.nim(1, 11) Warning: imported and not used: 'math' [UnusedImport]\\n/home/casper/projects/site2/scripts/nim_load/src/random.nim(3, 6) Warning: imported and not used: 'world' [UnusedImport]\\n/home/casper/projects/site2/scripts/nim_load/src/random.nim(2, 6) Warning: imported and not used: 'types' [UnusedImport]\\n/home/casper/projects/site2/scripts/nim_load/src/agents.nim(2, 1) Error: redefinition of 'random'; previous declaration here: /home/casper/projects/site2/scripts/nim_load/src/agents.nim(1, 11)\\n\\n    at ChildProcess.exithandler (node:child_process:402:12)\\n    at ChildProcess.emit (node:events:513:28)\\n    at maybeClose (node:internal/child_process:1100:16)\\n    at Process.ChildProcess._handle.onexit (node:internal/child_process:304:5)\");\n\n//# sourceURL=webpack://my-webpack-project/./src/main.nim?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
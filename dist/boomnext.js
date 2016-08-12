/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Gui = __webpack_require__(1);
	
	var _Gui2 = _interopRequireDefault(_Gui);
	
	var _Parser = __webpack_require__(23);
	
	var _Parser2 = _interopRequireDefault(_Parser);
	
	var _Parser3 = __webpack_require__(25);
	
	var _Parser4 = _interopRequireDefault(_Parser3);
	
	var _Parser5 = __webpack_require__(26);
	
	var _Parser6 = _interopRequireDefault(_Parser5);
	
	var _IndexDB = __webpack_require__(8);
	
	var _IndexDB2 = _interopRequireDefault(_IndexDB);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * 💣 Booooom ... next video
	 * ≡ ☰ menu
	 * ⛌ ☓ ✕ ✖ ✗ ✘
	 */
	
	__webpack_require__(9);
	
	var App = function () {
		function App() {
			var _this = this;
	
			_classCallCheck(this, App);
	
			this.isRunning = false;
			this.gui = new _Gui2.default();
			this.message('# Boom Next Video');
			try {
				// if indexDB is available
				this.db = new _IndexDB2.default();
			} catch (err) {
				this.gui.warn(err);
			}
			this.parsers = {
				imgur: new _Parser4.default(this.db),
				izismile: new _Parser2.default(this.db),
				ninegag: new _Parser6.default(this.db)
			};
	
			this.gui.controlEl.addEventListener('click', function () {
				return _this.toggleTV();
			});
			this.gui.prevEl.addEventListener('click', function () {
				return _this.prevVideo();
			});
			this.gui.nextEl.addEventListener('click', function () {
				return _this.nextVideo();
			});
			this.gui.nextSkipEl.addEventListener('click', function () {
				return _this.nextVideo(true);
			});
	
			this.videoEL = document.querySelector('video');
			this.videoEL.addEventListener('ended', function () {
				return _this.nextVideo();
			});
	
			this.initMessageInterface();
			this.initKeyboardShortcuts();
	
			// default station
			this.parser = this.parsers.imgur;
			this.currentParser = 'imgur';
			// choose station on click and start it
			var that = this;
			[].forEach.call(document.querySelectorAll('.tv-station'), function (button) {
				button.addEventListener('click', function (event) {
					console.log('change parser');
					that.parser = that.parsers[event.currentTarget.dataset.name];
					that.currentParser = event.currentTarget.dataset.name;
					that.toggleTV();
				});
			});
		}
	
		_createClass(App, [{
			key: 'initKeyboardShortcuts',
			value: function initKeyboardShortcuts() {
				var _this2 = this;
	
				/**
	    * ## Keyboard Shortcuts
	    * Bind keyboard shortcuts:
	    * - Space: pause video
	    * - ESC: exit tv
	    * - P: toggle tv on off
	    * - right/left: next previous video
	    * left does not work good since we might need to skip several items
	    * with images before we get to the previous video
	    */
				document.addEventListener('keydown', function (event) {
					console.log('key ', event.keyCode);
					if (event.keyCode === 32 /* Space*/) {
							if (_this2.video.youtube) _this2.youtubeMessage({ togglePlay: true });else if (_this2.video.mp4) _this2.videoEL.paused ? _this2.videoEL.play() : _this2.videoEL.pause();
							event.preventDefault();
						}
					if (event.keyCode === 27 && _this2.isRunning /* Esc*/) {
							event.preventDefault();
							event.stopPropagation();
							_this2.exitTV();
						}
					if (event.keyCode === 66 /* B*/) {
							_this2.toggleTV();
						}
					if (_this2.isRunning && event.keyCode === 37 /* left*/) {
						_this2.prevVideo();
					}
					if (_this2.isRunning && event.keyCode === 39 /* right*/) {
						_this2.nextVideo(event.ctrlKey); // with ctrl key skip to next unknow
					}
					if (_this2.isRunning && event.keyCode === 78 /* N*/) {
						_this2.nextVideo(true); // skip to next unknow
					}
				}, false);
			}
		}, {
			key: 'initMessageInterface',
			value: function initMessageInterface() {
				var _this3 = this;
	
				this.message('init webview message interface');
				this.youtubeWebview = document.querySelector('webview');
	
				// listen
				window.addEventListener('message', function (event) {
					if (event.data.handshake) {
						_this3.message('recieved webview handshake');
					}
					if (event.data.ended || event.data.error) {
						_this3.message('youtube ' + (event.data.ended ? 'ended' : 'error'));
						_this3.nextVideo();
					}
				});
	
				// handshake
				this.youtubeWebview.addEventListener('loadstop', function () {
					if (!_this3.hasSendHanshake) {
						_this3.message('send webview handshake');
						_this3.hasSendHanshake = true;
						_this3.youtubeMessage({ handshake: true });
					}
				});
			}
		}, {
			key: 'youtubeMessage',
			value: function youtubeMessage(data) {
				this.youtubeWebview.contentWindow.postMessage(data, '*');
			}
	
			/**
	   * ##exit
	   * Stop pr0-tv and exit the fullscreen mode, move the video back into its old parent
	   */
	
		}, {
			key: 'exitTV',
			value: function exitTV() {
				this.gui.exitFullscreen();
				this.youtubeMessage({ pause: true });
				this.videoEL.pause();
				this.isRunning = false;
			}
	
			/**
	   * ##toggle
	   * Start or stop pr0-tv depending on its previous state
	   */
	
		}, {
			key: 'toggleTV',
			value: function toggleTV() {
				if (!this.isRunning) {
					this.gui.launchFullscreen(document.documentElement);
					this.youtubeMessage({ init: this.gui.getViewportSize() });
					this.isRunning = true;
					this.nextVideo();
				} else {
					this.exitTV();
				}
			}
		}, {
			key: 'startVideo',
			value: function startVideo(video) {
				this.video = video;
				if (video.youtube) {
					this.videoEL.pause();
					this.videoEL.style.display = 'none';
					this.youtubeWebview.style.display = 'block';
					this.youtubeMessage({ play: video.youtube });
				} else if (video.mp4) {
					this.youtubeMessage({ pause: true });
					this.videoEL.style.display = 'block';
					this.youtubeWebview.style.display = 'none';
					this.videoEL.src = video.mp4;
					this.videoEL.play();
				}
			}
		}, {
			key: 'message',
			value: function message(data) {
				this.gui.message(data);
			}
		}, {
			key: 'nextVideo',
			value: function nextVideo(skip) {
				var _this4 = this;
	
				this.message('requesting next video from ' + this.currentParser);
	
				this.parser.getNext().then(function (video) {
					if (skip && _this4.db.exists(video)) {
						_this4.nextVideo(true);
					} else {
						_this4.message('got next video ' + JSON.stringify(video));
						_this4.db.set(video);
						_this4.startVideo(video);
					}
				}, function (error) {
					return _this4.gui.warn(error);
				});
			}
		}, {
			key: 'prevVideo',
			value: function prevVideo() {
				this.startVideo(this.parser.getPrev());
			}
		}]);
	
		return App;
	}();
	
	document.addEventListener('DOMContentLoaded', function () {
		new App();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _class = function () {
		function _class() {
			var _this = this;
	
			_classCallCheck(this, _class);
	
			console.log('## loading ui');
			// prepare HTML Elements
			this.bodyEl = document.querySelector('body');
			var bgurl = __webpack_require__(2);
			this.bodyEl.style.backgroundImage = 'url(\'' + bgurl + '\')';
	
			this.overlayEl = document.querySelector('.tv-overlay'); // overlay in which we place the videos
			this.overlayEl.style.display = 'none';
	
			this.prevEl = document.querySelector('.tv-prev');
			this.nextEl = document.querySelector('.tv-next');
			this.nextSkipEl = document.querySelector('.tv-next-skip');
			this.nextPrevEls = [this.prevEl, this.nextEl, this.nextSkipEl];
			this.nextPrevEls.forEach(function (el) {
				el.addEventListener('mousemove', function () {
					return _this.showPrevNext();
				});
			});
	
			this.youtubeWebview = document.querySelector('webview');
			this.videoEL = document.querySelector('video');
			this.controlEl = document.querySelector('.tv-control');
			this.warnEl = document.querySelector('.warn');
	
			this.styleEl = document.createElement('style');
			document.querySelector('head').appendChild(this.styleEl);
	
			this.statusEL = document.querySelector('.status');
	
			[].forEach.call(document.querySelectorAll('.menu'), function (el) {
				el.addEventListener('click', function () {
					document.querySelector('nav').classList.toggle('extended');
				});
			});
	
			var overlayManualEl = document.querySelector('.overlay-manual');
			overlayManualEl.style.display = 'none';
			overlayManualEl.addEventListener('click', function (event) {
				overlayManualEl.style.display = 'none';
			});
			document.querySelector('.show-overlay-manual').addEventListener('click', function (event) {
				overlayManualEl.style.display = '';
			});
	
			var overlayAboutEl = document.querySelector('.overlay-about');
			overlayAboutEl.style.display = 'none';
			overlayAboutEl.addEventListener('click', function (event) {
				overlayAboutEl.style.display = 'none';
			});
			document.querySelector('.show-overlay-about').addEventListener('click', function (event) {
				overlayAboutEl.style.display = '';
			});
	
			// set the CSS for the modal overlay in which we will move each video
			this.setCSS();
			// set the CSS again if the window resizes (going to fullscree, debugger, ...)
			window.onresize = function () {
				return _this.setCSS();
			};
			// hide the mouse when not moved
			this.overlayEl.addEventListener('mousemove', function () {
				return _this.hideMouseWhenIdle();
			});
	
			this.mouseTimer = null;
			this.cursorVisible = true;
			this.setWelcomMessage();
			setInterval(this.setWelcomMessage, 1000 * 60 * 60); // every hour change the welcome message
		}
	
		_createClass(_class, [{
			key: 'setWelcomMessage',
			value: function setWelcomMessage() {
				var d = new Date();
				var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				document.querySelector('.day').innerHTML = weekday[d.getDay()];
				var data = [[0, 4, 'night'], [5, 11, 'morning'], [12, 17, 'afternoon'], [18, 24, 'night']];
				var hr = d.getHours();
				document.querySelector('.timeofday').innerHTML = data.find(function (item) {
					return hr >= item[0] && hr <= item[1];
				})[2];
			}
	
			/**
	   * ###message
	   * Show a status message at the bottom right corner.
	   * @param {String} data message string
	   */
	
		}, {
			key: 'message',
			value: function message(data) {
				this.statusEL.innerHTML = data;
			}
	
			/**
	   * ###warn
	   * Show a warning message; red top center.
	   * Hide each message after 10s.
	   * @param {String} data message string
	   */
	
		}, {
			key: 'warn',
			value: function warn(data) {
				var el = document.createElement('div');
				el.innerHTML = data + ' <div class="close">✕</div>';
				this.warnEl.appendChild(el);
				el.querySelector('.close').addEventListener('click', function () {
					el.hidden = true;
				});
				setTimeout(function () {
					el.hidden = true;
				}, 10000);
			}
	
			/**
	   * ##setCSS
	   * Calculate values needed for and set the CSS for pr0-tv.
	   * The size of the overlay modal has to be calculated.
	   */
	
		}, {
			key: 'setCSS',
			value: function setCSS() {
				var viewportSize = this.getViewportSize();
				this.styleEl.innerHTML = '\n\t\t.tv-overlay {\n\t\t\twidth: ' + viewportSize.x + 'px;\n\t\t\theight: ' + viewportSize.y + 'px;\n\t\t}\n\t\t.tv-overlay video {\n\t\t\twidth: ' + viewportSize.x + 'px;\n\t\t\theight: ' + (viewportSize.y - 3) + 'px; /*so we can still see the progress bar*/\n\t\t}\n\t\t';
			}
	
			/**
	   * ##getViewportSize
	   * Get the size of the current visible area.
	   * Code from https://stackoverflow.com/a/11744120/1436151
	   * @return {Object} viewport dimensions `{x: Number, y: Number}`
	   */
	
		}, {
			key: 'getViewportSize',
			value: function getViewportSize() {
				var w = window;
				var d = document;
				var e = d.documentElement;
				var g = d.getElementsByTagName('body')[0];
				var x = w.innerWidth || e.clientWidth || g.clientWidth;
				var y = w.innerHeight || e.clientHeight || g.clientHeight;
				return { x: x, y: y };
			}
	
			/**
	   * ##launchFullscreen
	   * Code from https://davidwalsh.name/fullscreen
	   */
	
		}, {
			key: 'launchFullscreen',
			value: function launchFullscreen() {
				this.overlayEl.style.display = '';
	
				var element = document.documentElement;
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
	
				var size = this.getViewportSize();
				this.youtubeWebview.style.width = size.x + 'px';
				this.youtubeWebview.style.height = size.y + 'px';
				this.videoEL.style.width = size.x + 'px';
				this.videoEL.style.height = size.y + 'px';
			}
	
			/**
	   * ##exitFullscreen
	   * Code from https://davidwalsh.name/fullscreen
	   */
	
		}, {
			key: 'exitFullscreen',
			value: function exitFullscreen() {
				this.overlayEl.style.display = 'none';
				document.body.style.cursor = 'default';
	
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}
		}, {
			key: 'showPrevNext',
			value: function showPrevNext() {
				var _this2 = this;
	
				window.clearTimeout(this.prevNextTimer);
				this.nextPrevEls.forEach(function (el) {
					el.style.opacity = 1;
				});
				this.prevNextTimer = window.setTimeout(function () {
					_this2.nextPrevEls.forEach(function (el) {
						el.style.opacity = 0;
					});
				}, 5000);
			}
	
			// https://stackoverflow.com/a/4483383/1436151
	
		}, {
			key: 'disappearCursor',
			value: function disappearCursor() {
				this.mouseTimer = null;
				this.overlayEl.style.cursor = 'none';
				this.cursorVisible = false;
			}
		}, {
			key: 'hideMouseWhenIdle',
			value: function hideMouseWhenIdle() {
				var _this3 = this;
	
				if (this.mouseTimer) {
					window.clearTimeout(this.mouseTimer);
				}
				if (!this.cursorVisible) {
					this.overlayEl.style.cursor = 'default';
					this.cursorVisible = true;
				}
				this.mouseTimer = window.setTimeout(function () {
					return _this3.disappearCursor();
				}, 5000);
			}
		}]);

		return _class;
	}();

	exports.default = _class;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "488f7e2d9e707b885c74a76ec6668e9b.jpeg";

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _class = function () {
		function _class() {
			var _this = this;
	
			_classCallCheck(this, _class);
	
			this.isReady = false;
			this.collectionName = 'videos';
			this.db;
	
			//No support? Go in the corner and pout.
			if (!this.indexedDBOk) throw 'Error: indexDB missing.';
	
			var openRequest = indexedDB.open('boomnext_v001a', 1);
	
			openRequest.onupgradeneeded = function (event) {
				var thisDB = event.target.result;
	
				if (!thisDB.objectStoreNames.contains(_this.collectionName)) {
					// const objectStore =
					thisDB.createObjectStore(_this.collectionName, {
						keyPath: 'id'
					});
					// objectStore.createIndex('id', 'id', {
					// 	unique: true,
					// });
				}
			};
	
			openRequest.onsuccess = function (event) {
				_this.isReady = true;
				_this.db = event.target.result;
				//Listen for add clicks
				// document.querySelector('#addButton').addEventListener('click', addPerson, false);
			};
	
			openRequest.onerror = function (event) {
				throw 'Error: could not connect to indexDB.';
			};
		}
	
		_createClass(_class, [{
			key: 'indexedDBOk',
			value: function indexedDBOk() {
				return 'indexedDB' in window;
			}
		}, {
			key: 'exists',
			value: function exists(data) {
				var _this2 = this;
	
				return this.get(data.id).then(function (result) {
					if (result) return 'exists';else return _this2.set(data);
				}).then(function (res) {
					return res === 'exists';
				});
			}
		}, {
			key: 'set',
			value: function set(data) {
				var _this3 = this;
	
				var promise = new Promise(function (resolve, reject) {
					var request = _this3.db.transaction([_this3.collectionName], 'readwrite').objectStore(_this3.collectionName).add(data, 1);
					request.onerror = function (event) {
						reject('Error ' + event.target.error.name);
					};
	
					request.onsuccess = function () {
						resolve();
					};
				});
				return promise;
			}
		}, {
			key: 'get',
			value: function get(id) {
				var _this4 = this;
	
				var promise = new Promise(function (resolve, reject) {
					var request = _this4.db.transaction([_this4.collectionName], 'readwrite').objectStore(_this4.collectionName)
					// .index('id')
					.get(id);
					request.onerror = function (event) {
						reject('Error ' + event.target.error.name);
					};
	
					request.onsuccess = function (event) {
						resolve(event.target.result);
					};
				});
				return promise;
			}
		}]);

		return _class;
	}();

	exports.default = _class;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(22)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./app.sass", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./app.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports
	
	
	// module
	exports.push([module.id, "@font-face {\n  font-family: 'Open Sans';\n  font-style: normal;\n  font-weight: 300;\n  src: local(\"Open Sans Light\"), local(\"OpenSans-Light\"), url(" + __webpack_require__(12) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: normal;\n  font-weight: 400;\n  src: local(\"Open Sans\"), local(\"OpenSans\"), url(" + __webpack_require__(13) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: normal;\n  font-weight: 600;\n  src: local(\"Open Sans Semibold\"), local(\"OpenSans-Semibold\"), url(" + __webpack_require__(14) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: normal;\n  font-weight: 700;\n  src: local(\"Open Sans Bold\"), local(\"OpenSans-Bold\"), url(" + __webpack_require__(15) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: normal;\n  font-weight: 800;\n  src: local(\"Open Sans Extrabold\"), local(\"OpenSans-Extrabold\"), url(" + __webpack_require__(16) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: italic;\n  font-weight: 300;\n  src: local(\"Open Sans Light Italic\"), local(\"OpenSansLight-Italic\"), url(" + __webpack_require__(17) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: italic;\n  font-weight: 400;\n  src: local(\"Open Sans Italic\"), local(\"OpenSans-Italic\"), url(" + __webpack_require__(18) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: italic;\n  font-weight: 600;\n  src: local(\"Open Sans Semibold Italic\"), local(\"OpenSans-SemiboldItalic\"), url(" + __webpack_require__(19) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: italic;\n  font-weight: 700;\n  src: local(\"Open Sans Bold Italic\"), local(\"OpenSans-BoldItalic\"), url(" + __webpack_require__(20) + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Open Sans';\n  font-style: italic;\n  font-weight: 800;\n  src: local(\"Open Sans Extrabold Italic\"), local(\"OpenSans-ExtraboldItalic\"), url(" + __webpack_require__(21) + ") format(\"truetype\"); }\n\nbody {\n  position: relative;\n  background-size: cover;\n  margin: 0;\n  font-family: 'Open Sans', sans-serif;\n  color: #fff;\n  font-weight: 300;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\nheader {\n  background: rgba(255, 255, 255, 0.4);\n  height: 56px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  width: 100%;\n  position: relative; }\n  header h1 {\n    font-weight: normal; }\n\n.menu {\n  position: absolute;\n  top: 0;\n  left: 0;\n  cursor: pointer;\n  text-align: center;\n  line-height: 56px;\n  height: 56px;\n  width: 56px;\n  font-size: 2.5em; }\n\n.overlay {\n  display: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: rgba(0, 0, 0, 0.8);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  color: #fff;\n  width: 100%;\n  height: 100%;\n  z-index: 3; }\n  .overlay a {\n    color: #fff; }\n    .overlay a:hover, .overlay a:visited {\n      color: #fff; }\n  .overlay .close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    width: 50px;\n    height: 50px;\n    line-height: 50px;\n    font-size: 3em; }\n  .overlay .body {\n    font-size: 2em;\n    max-width: 600px; }\n  .overlay table {\n    font-size: 2em; }\n    .overlay table thead td {\n      font-weight: bold;\n      padding-bottom: 14px; }\n    .overlay table td {\n      min-width: 200px; }\n\nnav {\n  position: absolute;\n  background: rgba(0, 0, 0, 0.5);\n  width: 300px;\n  margin-left: -300px;\n  height: 100%;\n  top: 0;\n  left: 0;\n  padding-top: 84px;\n  -webkit-transition: all 250ms;\n  transition: all 250ms; }\n  nav ul {\n    padding: 0;\n    list-style: none;\n    width: 100%; }\n    nav ul li {\n      height: 56px;\n      width: 100%;\n      font-size: 2.5em;\n      padding-left: 56px;\n      cursor: pointer;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center; }\n  nav.extended {\n    margin-left: 0; }\n\n.icon-info {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  border: 2px solid #fff;\n  font-style: italic;\n  font-size: 16px;\n  text-align: center;\n  line-height: 20px;\n  font-weight: 700;\n  margin-left: 2px;\n  margin-right: 12px; }\n\n.docu td {\n  min-width: 100px; }\n\n.docu .larger {\n  font-size: 1.4em; }\n\n.boom {\n  display: inline-block;\n  -webkit-transform: scaleX(-1) rotate(12deg);\n          transform: scaleX(-1) rotate(12deg); }\n\n.greeting {\n  font-size: 72px;\n  margin: 28px;\n  text-align: center; }\n\n.sub-greeting {\n  font-size: 2.5em;\n  text-align: center; }\n\n.stations {\n  margin-top: 28px;\n  max-width: 681px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center; }\n  .stations div {\n    width: 220px;\n    height: 130px;\n    margin: 3.5px;\n    border-radius: 3px;\n    background: rgba(0, 0, 0, 0.5);\n    color: #fff;\n    box-sizing: border-box;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    cursor: pointer;\n    -webkit-transition: all 250ms;\n    transition: all 250ms; }\n    .stations div:hover {\n      background: rgba(0, 0, 0, 0.9); }\n\n.tv-overlay {\n  position: fixed;\n  background-color: rgba(0, 0, 0, 0.9);\n  z-index: 2;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  top: 0;\n  left: 0; }\n  .tv-overlay .loading {\n    position: absolute;\n    left: 50%;\n    right: 50%;\n    top: 50%;\n    bottom: 50%;\n    font-size: 22px;\n    color: #d23c22;\n    white-space: nowrap; }\n  .tv-overlay webview {\n    display: none; }\n  .tv-overlay video {\n    display: none; }\n\n.status {\n  position: absolute;\n  z-index: 3;\n  right: 0;\n  bottom: 0;\n  color: #eee; }\n\n.warn {\n  position: absolute;\n  z-index: 3;\n  width: 100%;\n  top: 14px;\n  left: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column; }\n  .warn > div {\n    position: relative;\n    width: 340px;\n    padding: 14px;\n    font-size: 1.2em;\n    font-weight: 400;\n    background: #d0021b;\n    color: #fff;\n    border-radius: 3px;\n    margin-bottom: 7px;\n    padding-right: 14px; }\n    .warn > div .close {\n      position: absolute;\n      width: 30px;\n      height: 30px;\n      line-height: 30px;\n      cursor: pointer;\n      top: 0;\n      right: 0;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-pack: center;\n          -ms-flex-pack: center;\n              justify-content: center;\n      -ms-flex-line-pack: center;\n          align-content: center;\n      font-size: 1.6em; }\n\n.tv-next,\n.tv-next-skip,\n.tv-prev {\n  font-size: 120px;\n  color: #eee;\n  position: absolute;\n  top: 0;\n  width: 75px;\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  cursor: pointer; }\n  .tv-next:hover,\n  .tv-next-skip:hover,\n  .tv-prev:hover {\n    color: #d23c22; }\n\n.tv-next {\n  right: 78;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n.tv-next-skip {\n  right: 0;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n.tv-prev {\n  left: 0;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start; }\n\n.tv-control {\n  position: fixed;\n  z-index: 3;\n  top: 5px;\n  right: 5px;\n  color: #CA4343;\n  border-radius: 5px;\n  width: 70px;\n  height: 40px;\n  background: rgba(0, 0, 0, 0.3);\n  padding: 3px 5px;\n  cursor: pointer;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n", ""]);
	
	// exports


/***/ },
/* 11 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "1bf71be111189e76987a4bb9b3115cb7.ttf";

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "629a55a7e793da068dc580d184cc0e31.ttf";

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "33f225b8f5f7d6b34a0926f58f96c1e9.ttf";

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "50145685042b4df07a1fd19957275b81.ttf";

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "8bac22ed4fd7c8a30536be18e2984f84.ttf";

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "6943fb6fd4200f3d073469325c6acdc9.ttf";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c7dcce084c445260a266f92db56f5517.ttf";

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "73f7301a9cd7a086295401eefe0c998f.ttf";

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "78b08a68d05d5fabb0b8effd51bf6ade.ttf";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "73d6bb0d4f596a91992e6be32e82e3bc.ttf";

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseParser2 = __webpack_require__(24);
	
	var _BaseParser3 = _interopRequireDefault(_BaseParser2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _class = function (_BaseParser) {
		_inherits(_class, _BaseParser);
	
		function _class() {
			_classCallCheck(this, _class);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));
	
			_this.baseURL = 'http://izismile.com/videos/';
			_this.videos = [];
			_this.currentVideoIndex = -1;
			_this.parserName = 'Izismile';
			return _this;
		}
	
		_createClass(_class, [{
			key: 'findVideo',
			value: function findVideo(html) {
				var node = document.createElement('div');
				node.innerHTML = html;
				var ytNode = node.querySelector('iframe[allowfullscreen]');
				var mp4Node = node.querySelector('a[href$=".mp4"]');
				return {
					id: ytNode ? ytNode.src : mp4Node.src,
					youtube: { url: ytNode ? ytNode.src : null },
					mp4: mp4Node ? mp4Node.src : null
				};
			}
		}, {
			key: 'getVideosFromIndex',
			value: function getVideosFromIndex(index) {
				var _this2 = this;
	
				// http://izismile.com/videos/page/2/
				var url = index > 1 ? this.baseURL + 'page/' + index + '/' : this.baseURL;
				return this.ajax(url).then(function (htmlIndex) {
					var node = document.createElement('div');
					node.innerHTML = htmlIndex;
					var links = Array.prototype.slice.call(node.querySelectorAll('.mb20 a'));
	
					return Promise.all(links.map(function (el) {
						var promiseSub = new Promise(function (resolve) {
							_this2.ajax(el.href).then(function (htmlPage) {
								_this2.videos.push(_this2.findVideo(htmlPage));
								resolve();
							}, function () {
								console.warn('IzismileParser failed getting page', el.href);
								resolve(); // we could not get the page but let's try all other pages
							});
						});
						return promiseSub;
					}));
				});
			}
		}]);

		return _class;
	}(_BaseParser3.default);

	exports.default = _class;

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _class = function () {
		function _class() {
			_classCallCheck(this, _class);
	
			this.videos = [];
			this.currentVideoIndex = -1;
			this.currentPageIndex = 1;
		}
	
		_createClass(_class, [{
			key: 'ajax',
			value: function ajax(url) {
				var _this = this;
	
				var promise = new Promise(function (resolve, reject) {
					var xhr = new XMLHttpRequest();
					xhr.open('GET', url, true);
					xhr.onload = function () {
						if (this.status >= 200 && this.status < 300) resolve(this.responseText);else reject('ajax failed for ' + url + ', because ' + this.statusText);
					};
					if (_this.requestHeader) {
						xhr.setRequestHeader.apply(xhr, _toConsumableArray(_this.requestHeader));
					}
					xhr.onerror = function (event) {
						reject('Error requesting ' + _this.parserName);
					};
					xhr.send();
				});
				return promise;
			}
		}, {
			key: 'getVideosFromIndex',
			value: function getVideosFromIndex(index) {
				// Return promise if resolved we got the index page a
				// whole bunch of new videos.
			}
		}, {
			key: 'getNext',
			value: function getNext() {
				var _this2 = this;
	
				var promise = new Promise(function (resolve, reject) {
	
					// only increment if we are not at the last video
					if (_this2.currentVideoIndex < _this2.videos.length) {
						_this2.currentVideoIndex++;
					}
	
					// no videos left, we must wait before we can return a new video
					if (_this2.currentVideoIndex >= _this2.videos.length - 1) {
						_this2.getVideosFromIndex(++_this2.currentPageIndex).then(function () {
							resolve(_this2.videos[_this2.currentVideoIndex]);
						}, function (err) {
							return reject(err);
						});
					} else {
						// 3 before last, request next index page to get more videos
						if (_this2.currentVideoIndex >= _this2.videos.length - 4) {
							_this2.getVideosFromIndex(++_this2.currentPageIndex).catch(function (err) {
								return reject(err);
							});
						}
						resolve(_this2.videos[_this2.currentVideoIndex]);
					}
				});
				return promise;
			}
		}, {
			key: 'getPrev',
			value: function getPrev() {
				if (this.currentVideoIndex > 0) {
					this.currentVideoIndex--;
				}
				return this.videos[this.currentVideoIndex];
			}
		}]);

		return _class;
	}();

	exports.default = _class;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseParser2 = __webpack_require__(24);
	
	var _BaseParser3 = _interopRequireDefault(_BaseParser2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _class = function (_BaseParser) {
		_inherits(_class, _BaseParser);
	
		function _class() {
			_classCallCheck(this, _class);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));
	
			_this.baseURL = 'https://api.imgur.com/3/gallery/hot/viral/';
			_this.requestHeader = ['Authorization', 'Client-ID <client-id>'];
			// this.videos = []; // provided in base
			_this.parserName = 'imgur API';
			return _this;
		}
	
		_createClass(_class, [{
			key: 'getVideosFromIndex',
			value: function getVideosFromIndex(index) {
				var _this2 = this;
	
				var url = index ? '' + this.baseURL + index + '.json' : this.baseURL + '0.json';
				return this.ajax(url).then(function (rawJsonIndex) {
					_this2.videos = [].concat(_toConsumableArray(_this2.videos), _toConsumableArray(JSON.parse(rawJsonIndex).data.filter(function (item) {
						return item.mp4;
					}).map(function (item) {
						return {
							id: item.mp4,
							mp4: item.mp4
						};
					})));
				});
			}
		}]);

		return _class;
	}(_BaseParser3.default);

	exports.default = _class;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BaseParser2 = __webpack_require__(24);
	
	var _BaseParser3 = _interopRequireDefault(_BaseParser2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _class = function (_BaseParser) {
		_inherits(_class, _BaseParser);
	
		function _class() {
			_classCallCheck(this, _class);
	
			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this));
	
			_this.baseURL = 'http://9gag.com/tv/api/index/nJ1gX/shuffle?limit=12&ref=61';
			// this.baseURL = 'http://9gag.com/tv/api/index/nJ1gX?ref_key=&count=20&direction=1';
			// this.videos = []; // provided in base
			_this.lastKey = '';
			_this.parserName = '9gag API';
			return _this;
		}
	
		_createClass(_class, [{
			key: 'getVideosFromIndex',
			value: function getVideosFromIndex() {
				var _this2 = this;
	
				var url = !this.lastKey ? this.baseURL : 'http://9gag.com/tv/api/index/LJEGX?ref_key=' + this.lastKey + '&count=20&direction=1';
				return this.ajax(url).then(function (rawJsonIndex) {
					var posts = JSON.parse(rawJsonIndex).data.posts;
					_this2.videos = [].concat(_toConsumableArray(_this2.videos), _toConsumableArray(posts.map(function (post) {
						return {
							id: post.videoExternalId,
							youtube: {
								id: post.videoExternalId,
								startSeconds: post.videoStarttime,
								endSeconds: post.videoEndtime
							}
						};
					})));
					_this2.lastKey = posts[posts.length - 1].hashedId;
					// http://9gag.com/tv/api/index/LJEGX?ref_key=aoX3X1&count=20&direction=1
					// http://9gag.com/tv/api/index/LJEGX?ref_key=a2ajyY&count=20&direction=1
					console.log('got videos ', _this2.videos);
				});
			}
		}]);

		return _class;
	}(_BaseParser3.default);

	exports.default = _class;

/***/ }
/******/ ]);
//# sourceMappingURL=boomnext.js.map
/**
 * 💣 Booooom ... next video
 * ≡ ☰ menu
 * ⛌ ☓ ✕ ✖ ✗ ✘
 */

require('./sass/app.sass');

import Gui from './Gui';
import IzismileParser from './parser/izismile/Parser';
import ImgurParser from './parser/imgur/Parser';
import NineGagParser from './parser/ninegag/Parser';
import Pr0grammParser from './parser/pr0gramm/Parser';
import FlipsideJapan from './parser/flipsidejapan/Parser.js';
import ExtraFunnyVideos from './parser/extrafunnyvideos/Parser.js';
import HansWurst from './parser/hanswurst/Parser.js';
import Wimp from './parser/wimp/Parser.js';
import Dumpert from './parser/dumpert/Parser.js';
import IndexDB from './IndexDBVideos';
import Plugins from './Plugins';

class App {
	constructor() {
		this.isRunning = false;
		this.gui = new Gui();
		this.message('# Boom, next video!');
		try { // if indexDB is available
			this.db = new IndexDB(this.gui);
		} catch (err) {
			this.gui.warn(err);
		}
		this.parsers = {
			imgur: new ImgurParser(),
			izismile: new IzismileParser(),
			ninegag: new NineGagParser(),
			pr0gramm: new Pr0grammParser(),
			flipsidejapan: new FlipsideJapan(),
			extrafunnyvideos: new ExtraFunnyVideos(),
			hanswurst: new HansWurst(),
			dumpert: new Dumpert(),
			wimp: new Wimp(),
		};

		this.plugins = new Plugins(this.gui);

		this.gui.controlEl.addEventListener('click', () => this.toggleTV());
		this.gui.prevEl.addEventListener('click', () => this.prevVideo());
		this.gui.nextEl.addEventListener('click', () => this.nextVideo());
		this.gui.nextSkipEl.addEventListener('click', () => this.nextVideo(true));

		this.videoEL = document.querySelector('video');
		this.videoEL.addEventListener('ended', () => this.nextVideo());

		this.initMessageInterface();
		this.initKeyboardShortcuts();

		// default station
		this.currentParser = 'imgur';
		// choose station on click and start it
		const that = this;
		[].forEach.call(document.querySelectorAll('[data-name]'), button => {
			button.addEventListener('click', (event) => {
				that.currentPlugin = '';
				that.currentParser = event.currentTarget.dataset.name;
				that.toggleTV();
			});
		});
		document.querySelector('.stations').addEventListener('click', (event) => {
			if (event.target.dataset.plugin) {
				that.currentPlugin = event.target.dataset.plugin;
				this.plugins.sandboxMessage({ setParser: that.currentPlugin });
				that.currentParser = '';
				that.toggleTV();
			}
		});
	}

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
	initKeyboardShortcuts() {
		document.addEventListener('keydown', (event) => {
			// console.log('key ', event.keyCode);
			if (event.keyCode === 32 /* Space*/) {
				if (this.video.youtube) this.youtubeMessage({ togglePlay: true });
				else if (this.video.mp4) this.videoEL.paused ? this.videoEL.play() : this.videoEL.pause();
				event.preventDefault();
			}
			if (event.keyCode === 27 && this.isRunning /* Esc*/) {
				event.preventDefault();
				event.stopPropagation();
				this.exitTV();
			}
			if (event.keyCode === 66 /* B*/) {
				this.toggleTV();
			}
			if (this.isRunning && (event.keyCode === 37 /* left*/)) {
				this.prevVideo();
			}
			if (this.isRunning && (event.keyCode === 39 /* right*/)) {
				this.nextVideo(event.ctrlKey); // with ctrl key skip to next unknow
			}
			if (this.isRunning && (event.keyCode === 78 /* N*/)) {
				this.nextVideo(true); // skip to next unknow
			}
		}, false);
	}

	initMessageInterface() {
		this.message('init webview message interface');
		this.youtubeWebview = document.querySelector('webview');

		// listen
		window.addEventListener('message', (event) => {
			if (event.data.handshake) {
				console.log('recieved webview handshake');
			}
			if (event.data.ended || event.data.error) {
				this.message(`youtube ${event.data.ended ? 'ended' : 'error'}`);
				this.nextVideo();
			}
		});

		// handshake
		this.youtubeWebview.addEventListener('loadstop', () => {
			if (!this.hasSendHanshake) {
				console.log('send webview handshake');
				this.hasSendHanshake = true;
				this.youtubeMessage({ handshake: true });
			}
		});
	}

	youtubeMessage(data) {
		this.youtubeWebview.contentWindow.postMessage(data, '*');
	}

	/**
	 * ##exit
	 * Stop pr0-tv and exit the fullscreen mode, move the video back into its old parent
	 */
	exitTV() {
		this.gui.exitFullscreen();
		this.youtubeMessage({ pause: true });
		this.videoEL.pause();
		this.isRunning = false;
	}

	/**
	 * ##toggle
	 * Start or stop pr0-tv depending on its previous state
	 */
	toggleTV() {
		if (!this.isRunning) {
			this.gui.launchFullscreen(document.documentElement);
			this.youtubeMessage({ init: this.gui.getViewportSize() });
			this.isRunning = true;
			this.nextVideo();
		} else {
			this.exitTV();
		}
	}

	startVideo(video) {
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

	message(data) {
		this.gui.message(data);
	}
	pluginsMessage(data) {
		const messageId = this.uid();
		const promise = new Promise(resolve => {
			window.addEventListener('message', function(event) {
				if (event.data.messageId) {
					window.removeEventListener('message', this);
					resolve(event.data.video);
				}
			});
			this.plugins.sandboxMessage(Object.assign({ messageId }, data));
		});
		return promise;
	}
	uid() {
		const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		return s4() + s4();
	}

	nextVideo(skip) {

		const nextFunction = this.currentPlugin ? this.pluginsMessage({ getNext: true }) : this.parsers[this.currentParser].getNext();

		if (skip) {
			nextFunction
				.then(video => {
					this.video = video;
					return this.db.exists(video);
				})
				.then(exists => {
					if (exists) {
						this.nextVideo(true);
					} else {
						this.startVideo(this.video);
					}
				}, error => this.gui.warn(error));
		} else {
			nextFunction.then(video => {
				this.db.exists(video);
				this.startVideo(video);
			});
		}
	}

	prevVideo() {
		this.startVideo(this.parsers[this.currentParser].getPrev());
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new App();
});

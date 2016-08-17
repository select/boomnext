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
import IndexDB from './IndexDBVideos';

class App {
	constructor() {
		this.isRunning = false;
		this.gui = new Gui();
		this.message('# Boom Next Video');
		try { // if indexDB is available
			this.db = new IndexDB();
		} catch (err) {
			this.gui.warn(err);
		}
		this.parsers = {
			imgur: new ImgurParser(this.db),
			izismile: new IzismileParser(this.db),
			ninegag: new NineGagParser(this.db),
		};

		this.gui.controlEl.addEventListener('click', () => this.toggleTV());
		this.gui.prevEl.addEventListener('click', () => this.prevVideo());
		this.gui.nextEl.addEventListener('click', () => this.nextVideo());
		this.gui.nextSkipEl.addEventListener('click', () => this.nextVideo(true));

		this.videoEL = document.querySelector('video');
		this.videoEL.addEventListener('ended', () => this.nextVideo());

		this.initMessageInterface();
		this.initKeyboardShortcuts();

		// default station
		this.parser = this.parsers.imgur;
		this.currentParser = 'imgur';
		// choose station on click and start it
		const that = this;
		[].forEach.call(document.querySelectorAll('.tv-station'), button => {
			button.addEventListener('click', (event) => {
				console.log('change parser');
				that.parser = that.parsers[event.currentTarget.dataset.name];
				that.currentParser = event.currentTarget.dataset.name;
				that.toggleTV();
			});
		});
	}

	initKeyboardShortcuts() {
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
		document.addEventListener('keydown', (event) => {
			console.log('key ', event.keyCode);
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
				this.message('recieved webview handshake');
			}
			if (event.data.ended || event.data.error) {
				this.message(`youtube ${event.data.ended ? 'ended' : 'error'}`);
				this.nextVideo();
			}
		});

		// handshake
		this.youtubeWebview.addEventListener('loadstop', () => {
			if (!this.hasSendHanshake) {
				this.message('send webview handshake');
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

	nextVideo(skip) {
		this.message(`requesting next video from ${this.currentParser}`);

		this.parser.getNext().then(video => {
			if (skip && this.db.exists(video)) {
				this.nextVideo(true);
			} else {
				this.message(`got next video ${JSON.stringify(video)}`);
				this.db.exists(video);
				this.startVideo(video);
			}
		}, (error) => this.gui.warn(error));
	}

	prevVideo() {
		this.startVideo(this.parser.getPrev());
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new App();
});

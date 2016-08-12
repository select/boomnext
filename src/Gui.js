export
default class {
	constructor() {
		console.log('## loading ui');
		// prepare HTML Elements
		this.bodyEl = document.querySelector('body');
		const bgurl = require('./img/bg-evening.jpeg');
		this.bodyEl.style.backgroundImage = `url('${bgurl}')`;

		this.overlayEl = document.querySelector('.tv-overlay'); // overlay in which we place the videos
		this.overlayEl.style.display = 'none';

		this.prevEl = document.querySelector('.tv-prev');
		this.nextEl = document.querySelector('.tv-next');
		this.nextSkipEl = document.querySelector('.tv-next-skip');
		this.nextPrevEls = [
			this.prevEl,
			this.nextEl,
			this.nextSkipEl,
		];
		this.nextPrevEls.forEach(el => {
			el.addEventListener('mousemove', () => this.showPrevNext());
		});

		this.youtubeWebview = document.querySelector('webview');
		this.videoEL = document.querySelector('video');
		this.controlEl = document.querySelector('.tv-control');
		this.warnEl = document.querySelector('.warn');

		this.styleEl = document.createElement('style');
		document.querySelector('head').appendChild(this.styleEl);

		this.statusEL = document.querySelector('.status');

		[].forEach.call(document.querySelectorAll('.menu'), (el) => {
			el.addEventListener('click', () => {
				document.querySelector('nav').classList.toggle('extended');
			});
		});

		const overlayManualEl = document.querySelector('.overlay-manual');
		overlayManualEl.style.display = 'none';
		overlayManualEl.addEventListener('click', event => {overlayManualEl.style.display = 'none';});
		document.querySelector('.show-overlay-manual').addEventListener('click', event => {
			overlayManualEl.style.display = '';
		});

		const overlayAboutEl = document.querySelector('.overlay-about');
		overlayAboutEl.style.display = 'none';
		overlayAboutEl.addEventListener('click', event => {overlayAboutEl.style.display = 'none';});
		document.querySelector('.show-overlay-about').addEventListener('click', event => {
			overlayAboutEl.style.display = '';
		});


		// set the CSS for the modal overlay in which we will move each video
		this.setCSS();
		// set the CSS again if the window resizes (going to fullscree, debugger, ...)
		window.onresize = () => this.setCSS();
		// hide the mouse when not moved
		this.overlayEl.addEventListener('mousemove', () => this.hideMouseWhenIdle());

		this.mouseTimer = null;
		this.cursorVisible = true;
		this.setWelcomMessage();
		setInterval(this.setWelcomMessage, (1000 * 60 * 60)); // every hour change the welcome message
	}

	setWelcomMessage() {
		const d = new Date();
		const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		document.querySelector('.day').innerHTML = weekday[d.getDay()];
		const data = [
			[0, 4, 'night'],
			[5, 11, 'morning'],
			[12, 17, 'afternoon'],
			[18, 24, 'night'],
		];
		const hr = d.getHours();
		document.querySelector('.timeofday').innerHTML = data.find(item => hr >= item[0] && hr <= item[1])[2];
	}

	/**
	 * ###message
	 * Show a status message at the bottom right corner.
	 * @param {String} data message string
	 */
	message(data) {
		this.statusEL.innerHTML = data;
	}

	/**
	 * ###warn
	 * Show a warning message; red top center.
	 * Hide each message after 10s.
	 * @param {String} data message string
	 */
	warn(data) {
		const el = document.createElement('div');
		el.innerHTML = `${data} <div class="close">✕</div>`;
		this.warnEl.appendChild(el);
		el.querySelector('.close').addEventListener('click', () => {
			el.hidden = true;
		});
		setTimeout(() => {
			el.hidden = true;
		}, 10000);
	}

	/**
	 * ##setCSS
	 * Calculate values needed for and set the CSS for pr0-tv.
	 * The size of the overlay modal has to be calculated.
	 */
	setCSS() {
		const viewportSize = this.getViewportSize();
		this.styleEl.innerHTML = `
		.tv-overlay {
			width: ${viewportSize.x}px;
			height: ${viewportSize.y}px;
		}
		.tv-overlay video {
			width: ${viewportSize.x}px;
			height: ${viewportSize.y - 3}px; /*so we can still see the progress bar*/
		}
		`;
	}

	/**
	 * ##getViewportSize
	 * Get the size of the current visible area.
	 * Code from https://stackoverflow.com/a/11744120/1436151
	 * @return {Object} viewport dimensions `{x: Number, y: Number}`
	 */
	getViewportSize() {
		const w = window;
		const d = document;
		const e = d.documentElement;
		const g = d.getElementsByTagName('body')[0];
		const x = w.innerWidth || e.clientWidth || g.clientWidth;
		const y = w.innerHeight || e.clientHeight || g.clientHeight;
		return { x, y };
	}

	/**
	 * ##launchFullscreen
	 * Code from https://davidwalsh.name/fullscreen
	 */
	launchFullscreen() {
		this.overlayEl.style.display = '';

		const element = document.documentElement;
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}

		const size = this.getViewportSize();
		this.youtubeWebview.style.width = `${size.x}px`;
		this.youtubeWebview.style.height = `${size.y}px`;
		this.videoEL.style.width = `${size.x}px`;
		this.videoEL.style.height = `${size.y}px`;
	}

	/**
	 * ##exitFullscreen
	 * Code from https://davidwalsh.name/fullscreen
	 */
	exitFullscreen() {
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

	showPrevNext() {
		window.clearTimeout(this.prevNextTimer);
		this.nextPrevEls.forEach(el => {
			el.style.opacity = 1;
		});
		this.prevNextTimer = window.setTimeout(() => {
			this.nextPrevEls.forEach(el => {
				el.style.opacity = 0;
			});
		}, 5000);
	}

	// https://stackoverflow.com/a/4483383/1436151
	disappearCursor() {
		this.mouseTimer = null;
		this.overlayEl.style.cursor = 'none';
		this.cursorVisible = false;
	}

	hideMouseWhenIdle() {
		if (this.mouseTimer) {
			window.clearTimeout(this.mouseTimer);
		}
		if (!this.cursorVisible) {
			this.overlayEl.style.cursor = 'default';
			this.cursorVisible = true;
		}
		this.mouseTimer = window.setTimeout(() => this.disappearCursor(), 5000);
	}
}

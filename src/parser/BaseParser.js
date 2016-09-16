export default class {
	constructor() {
		this.videos = [];
		this.currentVideoIndex = -1;
	}

	ajax(url) {
		const promise = new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onload = function() {
				if (this.status >= 200 && this.status < 300) resolve(this.responseText);
				else reject(`ajax failed for ${url}, because ${this.statusText}`);
			};
			if (this.requestHeader) {
				xhr.setRequestHeader(...this.requestHeader);
			}
			xhr.onerror = (event) => {
				reject(`Error requesting ${this.parserName}`);
			};
			xhr.send();
		});
		return promise;
	}

	findVideo(html) {
		const node = document.createElement('div');
		node.innerHTML = html;
		const ytNode = node.querySelector('iframe[allowfullscreen], iframe.youtube-player');
		const mp4Node = node.querySelector('a[href$=".mp4"]');
		const ytURL = ytNode ? ytNode.src.replace(/\?.*$/, '') : null;
		return {
			id: ytURL || mp4Node.href,
			youtube: { url: ytURL },
			mp4: mp4Node ? mp4Node.href : null,
		};
	}

	getVideosFromIndex(index) {
		// Return promise if resolved we got the index page a
		// whole bunch of new videos.
	}

	getNext() {
		const promise = new Promise((resolve, reject) => {

			// only increment if we are not at the last video
			if (this.currentVideoIndex < this.videos.length) {
				this.currentVideoIndex++;
			}

			// no videos left, we must wait before we can return a new video
			if (this.currentVideoIndex >= this.videos.length - 1) {
				this.getVideosFromIndex().then(() => {
					resolve(this.videos[this.currentVideoIndex]);
				}, err => {
					reject(err);
				});
			} else {
				// 3 before last, request next index page to get more videos
				if (this.currentVideoIndex >= this.videos.length - 4) {
					this.getVideosFromIndex();
				}
				resolve(this.videos[this.currentVideoIndex]);
			}
		});
		return promise;
	}

	getPrev() {
		if (this.currentVideoIndex > 0) {
			this.currentVideoIndex--;
		}
		return this.videos[this.currentVideoIndex];
	}
}

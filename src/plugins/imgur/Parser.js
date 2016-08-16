class Imgur2 {
	constructor() {
		this.videos = [];
		this.currentVideoIndex = -1;
		this.currentPageIndex = 0;

		this.baseURL = 'https://api.imgur.com/3/gallery/hot/viral/';
		this.requestHeader = ['Authorization', 'Client-ID <client-id>'];
		// this.videos = []; // provided in base
		this.parserName = 'imgur API';
		this.currentPageIndex = -1;
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

	getVideosFromIndex(index) {
		const url = index ? `${this.baseURL}${index}.json` : `${this.baseURL}0.json`;
		return this.ajax(url).then(rawJsonIndex => {
			this.videos = [
				...this.videos,
				...JSON.parse(rawJsonIndex).data
					.filter(item => item.mp4)
					.map(item => ({
						id: item.mp4,
						mp4: item.mp4,
					})),
			];
		});
	}

	getNext() {
		const promise = new Promise((resolve, reject) => {

			// only increment if we are not at the last video
			if (this.currentVideoIndex < this.videos.length) {
				this.currentVideoIndex++;
			}

			// no videos left, we must wait before we can return a new video
			if (this.currentVideoIndex >= this.videos.length - 1) {
				this.getVideosFromIndex(++this.currentPageIndex).then(() => {
					resolve(this.videos[this.currentVideoIndex]);
				}, err => {
					--this.currentPageIndex;
					reject(err);
				});
			} else {
				// 3 before last, request next index page to get more videos
				if (this.currentVideoIndex >= this.videos.length - 4) {
					this.getVideosFromIndex(++this.currentPageIndex).catch(err => {
						--this.currentPageIndex;
						reject(err);
					});
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
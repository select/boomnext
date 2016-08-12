import BaseParser from './../BaseParser';

export default class extends BaseParser {
	constructor() {
		super();
		this.baseURL = 'http://izismile.com/videos/';
		this.videos = [];
		this.currentVideoIndex = -1;
		this.parserName = 'Izismile';
	}

	findVideo(html) {
		const node = document.createElement('div');
		node.innerHTML = html;
		const ytNode = node.querySelector('iframe[allowfullscreen]');
		const mp4Node = node.querySelector('a[href$=".mp4"]');
		return {
			id: ytNode ? ytNode.src : mp4Node.href,
			youtube: { url: ytNode ? ytNode.src : null },
			mp4: mp4Node ? mp4Node.href : null,
		};
	}

	getVideosFromIndex(index) { // http://izismile.com/videos/page/2/
		const url = index > 1 ? `${this.baseURL}page/${index}/` : this.baseURL;
		return this.ajax(url).then(htmlIndex => {
			const node = document.createElement('div');
			node.innerHTML = htmlIndex;
			const links = Array.prototype.slice.call(node.querySelectorAll('.mb20 a'));

			return Promise.all(links.map((el) => {
				const promiseSub = new Promise(resolve => {
					this.ajax(el.href)
						.then((htmlPage) => {
							this.videos.push(this.findVideo(htmlPage));
							resolve();
						}, () => {
							console.warn('IzismileParser failed getting page', el.href);
							resolve(); // we could not get the page but let's try all other pages
						});
				});
				return promiseSub;
			}));
		});
	}
}

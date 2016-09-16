import BaseParser from './../BaseParser';

export default class extends BaseParser {
	constructor() {
		super();
		this.baseURL = 'http://izismile.com/videos/';
		this.videos = [];
		this.currentPageIndex = 0;
		this.parserName = 'Izismile';
	}

	getVideosFromIndex() { // http://izismile.com/videos/page/2/
		const url = this.currentPageIndex > 1 ? `${this.baseURL}page/${this.currentPageIndex}/` : this.baseURL;
		return this.ajax(url).then(htmlIndex => {
			const node = document.createElement('div');
			node.innerHTML = htmlIndex;
			const links = Array.prototype.slice.call(node.querySelectorAll('.mb20 a'));
			++this.currentPageIndex;
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

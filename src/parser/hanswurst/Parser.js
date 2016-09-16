import BaseParser from './../BaseParser';
// ---
export default class extends BaseParser {
	constructor() {
		super();
		this.pageIndex = 1;
		this.parserName = 'Hans-Wurst';
		this.startURL = 'http://www.hans-wurst.net/video/';
	}

	getVideosFromIndex() {
		const urlIndex = this.pageIndex <= 1 ? this.startURL : `http://www.hans-wurst.net/video/seite/${this.pageIndex}/`;
		return this.ajax(urlIndex)
			.then(rawHTML => {
				const node = document.createElement('div');
				node.innerHTML = rawHTML;
				const urlHashTable = {};
				Array.from(node.querySelectorAll('[rel=bookmark]')).forEach(el => {
					urlHashTable[el.href] = 1;
				});
				this.pageIndex++;
				return Promise.all(Object.keys(urlHashTable).map((url) => {
					const promiseSub = new Promise(resolve => {
						this.ajax(url)
							.then((htmlPage) => {
								this.videos.push(this.findVideo(htmlPage));
								console.log('this.videos hw: ', this.videos);
								resolve();
							}, () => {
								console.warn('Hans-Wurst failed getting page', url);
								resolve(); // we could not get the page but let's try all other pages
							});
					});
					return promiseSub;
				}));
			});
	}
}


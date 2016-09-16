import BaseParser from './../BaseParser';
// ---
export default class extends BaseParser {
	constructor() {
		super();
		this.pageIndex = 1;
		this.parserName = 'Wimp';
		this.startURL = 'http://www.wimp.com/';
	}

	findVideo(html) {
		const node = document.createElement('div');
		node.innerHTML = html;
		const ytId = node.querySelector('[data-id]').dataset.id;
		return {
			id: ytId,
			youtube: { id: ytId },
		};
	}

	getVideosFromIndex() {
		const urlIndex = this.pageIndex <= 1 ? this.startURL : `http://www.wimp.com/${this.pageIndex}/`;
		return this.ajax(urlIndex)
			.then(rawHTML => {
				const node = document.createElement('div');
				node.innerHTML = rawHTML;
				const urlHashTable = {};
				Array.from(node.querySelectorAll('.item')).forEach(el => {
					urlHashTable[el.getAttribute('href')] = 1;
				});
				this.pageIndex++;
				return Promise.all(Object.keys(urlHashTable).map((url) => {
					const promiseSub = new Promise(resolve => {
						this.ajax(`http://www.wimp.com${url}`)
							.then((htmlPage) => {
								this.videos.push(this.findVideo(htmlPage));
								resolve();
							}, () => {
								console.warn('Wimp failed getting page', url);
								resolve(); // we could not get the page but let's try all other pages
							});
					});
					return promiseSub;
				}));
			});
	}
}


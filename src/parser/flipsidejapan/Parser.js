import BaseParser from './../BaseParser';
// ---
export default class extends BaseParser {
	constructor() {
		super();
		this.nextURL = 'http://www.flipsidejapan.com/';
		this.pageIndex = 1;
		this.parserName = 'Flipside Japan';
		this.stepSize = 5;
	}

	getVideosFromIndex() {
		const that = this;
		const url = `http://www.flipsidejapan.com/feeds/posts/summary?start-index=${this.pageIndex}&max-results=1&alt=json`;
		return this.ajax(url)
			.then(rawJSON => {
				const data = JSON.parse(rawJSON);
				const datetime = data.feed.entry[0].published['$t'];
				this.pageIndex += this.stepSize;
				return this.ajax(`http://www.flipsidejapan.com/search?updated-max=${encodeURIComponent(datetime.replace(/\.\d{3}-/, '-'))}&max-results=${this.stepSize}`);
			})
			.then(rawHTML => {
				const node = document.createElement('div');
				node.innerHTML = rawHTML;
				Array.from(node.querySelectorAll('iframe[allowfullscreen]'))
					.forEach(el => {
						that.videos.push({
							id: el.src,
							youtube: { url: el.src },
						});
					});
			});
	}
}



// (function() {
// 	window.parsers.Imgur2 = new Imgur2();
// 	console.log('added parser Imgur2');
// })();

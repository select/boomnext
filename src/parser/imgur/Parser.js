import BaseParser from './../BaseParser';

export default class extends BaseParser {
	constructor() {
		super();
		this.baseURL = 'https://api.imgur.com/3/gallery/hot/viral/';
		this.requestHeader = ['Authorization', 'Client-ID c35fbc04fe9ccda'];
		// this.videos = []; // provided in base
		this.parserName = 'imgur API';
		this.currentPageIndex = 0;
		this.parserRunning = false;
	}

	getVideosFromIndex() {
		const url = `${this.baseURL}${this.currentPageIndex}.json`;
		if (!this.parserRunning) {
			this.parserRunning = true;
			return this.ajax(url).then(rawJsonIndex => {
				this.parserRunning = false;
				++this.currentPageIndex;
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
		} else {
			console.warn('imgur index is already running!!!');
			debugger;
		}
	}
}

import BaseParser from './../BaseParser';

export default class extends BaseParser {
	constructor() {
		super();
		this.baseURL = 'https://api.imgur.com/3/gallery/hot/viral/';
		this.requestHeader = ['Authorization', 'Client-ID c35fbc04fe9ccda'];
		// this.videos = []; // provided in base
		this.parserName = 'imgur API';
		this.currentPageIndex = -1;
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
}

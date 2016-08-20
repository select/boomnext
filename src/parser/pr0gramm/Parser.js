

import BaseParser from './../BaseParser';

export default class extends BaseParser {
	constructor() {
		super();
		this.baseURL = 'https://pr0gramm.com/api/items/get?flags=1&promoted=1';
		this.lastKey = '';
		this.parserName = 'pr0gramm API';
		this.isRunning = false;
	}

	getVideosFromIndex() {
		const url = !this.lastKey ? this.baseURL : `https://pr0gramm.com/api/items/get?older=${this.lastKey}&flags=1&promoted=1`;
		if (this.isRunning) return;
		this.isRunning = true;
		return this.ajax(url).then(rawJsonIndex => {
			this.isRunning = false;
			const stream = JSON.parse(rawJsonIndex);
			this.videos = [
				...this.videos,
				...stream.items
					.filter(item  => /\.mp4$/.test(item.image))
					.map(item => ({
						id: `https://vid.pr0gramm.com/${item.image}`,
						mp4: `https://vid.pr0gramm.com/${item.image}`,
					})),
			];
			this.lastKey = !this.lastKey ? stream.items[stream.items.length - 1].promoted : stream.cache.replace('stream:top:1:o', '');
		});
	}
}

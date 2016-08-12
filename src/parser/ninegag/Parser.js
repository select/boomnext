import BaseParser from './../BaseParser';

export default class extends BaseParser {
	constructor() {
		super();
		this.baseURL = 'http://9gag.com/tv/api/index/nJ1gX/shuffle?limit=12&ref=61';
		// this.baseURL = 'http://9gag.com/tv/api/index/nJ1gX?ref_key=&count=20&direction=1';
		// this.videos = []; // provided in base
		this.lastKey = '';
		this.parserName = '9gag API';
	}

	getVideosFromIndex() {
		const url = !this.lastKey ? this.baseURL : `http://9gag.com/tv/api/index/LJEGX?ref_key=${this.lastKey}&count=20&direction=1`;
		return this.ajax(url).then(rawJsonIndex => {
			const posts = JSON.parse(rawJsonIndex).data.posts;
			this.videos = [
				...this.videos,
				...posts
					.map(post => ({
						id: post.videoExternalId,
						youtube: {
							id: post.videoExternalId,
							startSeconds: post.videoStarttime,
							endSeconds: post.videoEndtime,
						},
					})),
			];
			this.lastKey = posts[posts.length - 1].hashedId;
			// http://9gag.com/tv/api/index/LJEGX?ref_key=aoX3X1&count=20&direction=1
			// http://9gag.com/tv/api/index/LJEGX?ref_key=a2ajyY&count=20&direction=1
			console.log('got videos ', this.videos);
		});
	}
}

# Boom, next video!

<a href="https://chrome.google.com/webstore/detail/boom-next-video/ipgdkkkobholfegfnnapdkiddfijnogn">
<img alt="Try it now" src="https://camo.githubusercontent.com/334b4f665751356b1f4afb758f8ddde55b9c71b8/68747470733a2f2f7261772e6769746875622e636f6d2f476f6f676c654368726f6d652f6368726f6d652d6170702d73616d706c65732f6d61737465722f74727969746e6f77627574746f6e5f736d616c6c2e706e67" title="Click here to install this app from the Chrome Web Store" data-canonical-src="https://raw.github.com/GoogleChrome/chrome-app-samples/master/tryitnowbutton_small.png" style="max-width:100%;">
</a>


Stream videos! Click on a channel and enjoy.

Current plugins:
- Imgur
- 9gag
- Izismile
- pr0gramm

<img src="https://raw.githubusercontent.com/select/boomnext/1bcb55caaa63b86addac641471adeab44e53bac0/src/img/screenshots/Screenshot%20Boom%20next%20video.png" alt="Screenshot Boom, next vide!" style="float: right;" width="600px">

BoomNext streams videos from popular websites. So far HMLT5 `<video>` and youtube are supported. Video links are collected from my favorite websites. Writing a plugin for a website is as simple as

```
class Imgur extends BaseParser {
	constructor() {
		super();
		this.requestHeader = ['Authorization', 'Client-ID XXXXXXX'];
		this.parserName = 'imgur API';
		this.currentPageIndex = 0;
	}

	getVideosFromIndex() {
		const url = 'https://api.imgur.com/3/gallery/hot/viral/${this.currentPageIndex}.json';
		return this.ajax(url).then(rawJsonIndex => {
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
	}
}
``` 

## Installation

On the Chrome web store or 
- clone this repo `git checkout git@github.com:select/boomnext.git`
- Install dependencies with `npm install` 
- Build with `npm run sync` and `npm start`
- `chrome://extensions/` click on "Load unpacked extension"
- reload on extension page with <kbd>ctrl</kbd><kbd>r</kbd>

## Plugins

Read the [documentation for plugins here](https://github.com/select/boomnext/tree/master/src/plugins/imgur).

## Usage

<table>
	<thead>
		<tr>
			<td>
				Button
			</td>
			<td>
				Keyboard
			</td>
			<td></td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><div class="boom">💣</div></td>
			<td><kbd>B</kbd></td>
			<td>Start / stop TV</td>
		</tr>
		<tr>
			<td class="larger">‹</td>
			<td><kbd>◀</kbd></td>
			<td>Previous video</td>
		</tr>
		<tr>
			<td class="larger">›</td>
			<td><kbd>▶</kbd></td>
			<td>Next video</td>
		</tr>
		<tr>
			<td class="larger">»</td>
			<td><kbd>N</kbd></td>
			<td>Next video (skip watched)</td>
		</tr>
		<tr>
			<td></td>
			<td><kbd>Space</kbd></td>
			<td>Pause / play video</td>
		</tr>
	</tbody>
</table>
</div>

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

v 0.0.1
- Added a plugin system
- 4 channels working
- Skip watched videos with <kbd>N</kbd> or click `»`


## Credits

https://stuk.github.io/jszip/ <br>
https://github.com/webpack/webpack


## License

MIT



Boom, next video - plugin

The Plugin must provide the following files
```
plugin.json
Parser.js
```

The `plugin.json` must contain the following keys
- `className` - Name of the class that is provided in Parser.js
- `logoImg` - An image for the channel this plugin provides; the image must be contained in the zip
- `width` or `height` - the width or the height of the image in the tile
```

The `Parser.js` must fulfill the following API
It must contain a function called `getNext()` that returns a `Promise` which retruns an video object of the following structure
```
{
	mp4: 'url string', // (or youtube) if a mp4 video is provided
	youtube: { // (or mp4)
		url: 'url string', // (or id)
		id: 'youtube id string', //(or url)
		startSeconds: 123, // Number
		endSeconds: 123, // Number
	}
}
```

the `getPrev()` 

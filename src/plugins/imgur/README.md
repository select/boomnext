#Boom, next video - plugin

The plugin is a zipfile that must contain the following files
```
plugin.zip
├─o plugin.json
├─o Parser.js
└─o some-image-file.[any web format]
```

The `plugin.json` must contain the following keys
```
{

	"className": '...', // String - Name of the JS class that is provided 
	by Parser.js
	"logoImg": '...', // String - An image for the channel this plugin
	 provides; the image must be contained in the zip
	"width" or "height": 123, // Number - image dimensions in the tile
}
```

The class in `Parser.js` must fulfill the following API:
It must contain a function called `getNext()` that returns a `Promise` which returns a object of the following structure
```
{
	mp4: 'url', // String (or youtube) if a mp4 video is provided
	youtube: { // Object (or mp4)
		url: 'youtube url', // String (or id)
		id: 'youtube id', //String (or url)
		startSeconds: 123, // Number optional)
		endSeconds: 123, // Number optional)
	}
}
```

rejeted promises should return a String with the error message.
The `getPrev()` function should return the object above directly.

Currently only mp4 and youtube videos are supported, more support can be added, create an issue at github, or a pull request!

class PluginSandbox {
	constructor() {
		this.initMessageInterface();
		this.parsers = {};
		this.currentParser = '';
	}

	initMessageInterface() {
		window.addEventListener('message', (event) => {
			console.log('## sb event recieved', event.data);
			if (!this.messageSource) {
				if (event.data.handshakeSandbox) {
					console.log('## sb handshake complete');
					this.messageSource = event.source;
					this.messageOrigin = event.origin;
					this.message({ handshakeSandbox: true });

				}
			} else {
				if (event.data.togglePlay) this.togglePlay();
				else if (event.data.loadScripts) this.loadScripts(event.data.loadScripts);
				else if (event.data.getNext) this.getNext(event.data.messageId);
				else if (event.data.getPrev) this.getPrev(event.data.messageId);
			}
		});
	}
	message(data) {
		this.messageSource.postMessage(data, this.messageOrigin);
	}

	loadScripts(items) {
		// inject scripts
		const script = document.createElement('script');
		script.appendChild(
			document.createTextNode(
				items.reduce((source, item) => `${source}${item.parser}`, '')
			)
		);
		(document.body || document.head || document.documentElement).appendChild(script);
	}
	setParser(className) {
		this.currentParser = className;
	}

	getNext(messageId) {
		this.parsers[this.currentParser].getNext().then(video => {
			this.message({ messageId, video });
		});
	}

	getPrev(messageId) {
		this.message({ messageId, video: this.parsers[this.currentParser].getPrev() });
	}
}

console.log('# Plugin sandbox');
const pluginsSandbox = new PluginSandbox();


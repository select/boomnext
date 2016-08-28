class PluginSandbox {
	constructor() {
		this.initMessageInterface();
		this.currentParser = '';
	}

	initMessageInterface() {
		var that = this;
		window.addEventListener('message', event => {
			console.log('## sb event recieved', event.data);
			if (!this.messageSource) {
				if (event.data.handshakeSandbox) {
					console.log('## sb handshake complete');
					this.messageSource = event.source;
					this.messageOrigin = event.origin;
					this.message({ handshakeSandbox: true });
				}
			} else {
				if (event.data.setParser) that.currentParser = event.data.setParser;
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
		document.head.appendChild(script);
		console.log('## loadScripts!!');
	}
	setParser(className) {
		this.currentParser = className;
	}

	getNext(messageId) {
		console.log('try to get next')
		window.parsers[this.currentParser].getNext().then(video => {
			console.log('get next ')
			this.message({ messageId, video });
		});
	}

	getPrev(messageId) {
		this.message({ messageId, video: window.parsers[this.currentParser].getPrev() });
	}
}

console.log('# Plugin sandbox');
window.parsers = {};
window.pluginsSandbox = new PluginSandbox();


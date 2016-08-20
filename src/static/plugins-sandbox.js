class PluginSandbox {
	constructor() {
		this.initMessageInterface();
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
				else if (event.data.play) this.play(event.data.play);
				else if (event.data.pause) this.pause();
				else if (event.data.init) this.initYoutube(event.data.init);
			}
		});
	}

	message(data) {
		this.messageSource.postMessage(data, this.messageOrigin);
	}
}

console.log('# Plugin sandbox');
new PluginSandbox();



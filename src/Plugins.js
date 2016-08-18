import JSZip from 'jszip';

export default class {
	constructor(gui) {
		this.gui = gui;
		if (!window.FileReader || !window.ArrayBuffer) throw 'plugin upload not possible, FileReader or ArrayBuffer not available';
		document.querySelector('.upload-plugin')
			.addEventListener(
				'change',
				event => [].forEach.call(event.target.files, f => this.handleFile(f))
		);
	}

	handleFile(file) {
		JSZip.loadAsync(file)
			.then(zip => {
				zip
					.file('plugin.json')
					.async('string')
						.then(content => {
							console.log('content: ', content);
							const manifest = JSON.parse(content);
							console.log('manifest: ', manifest);
						}, error => {
							console.warn('error reading file ', error);
						});
				zip.forEach((relativePath, zipEntry) => {
					console.log('read zip: ', relativePath, ' == ', zipEntry.name);
				});
			}, error => {
				this.gui.warn('Error reading ' + file.name + ' : ' + error.message);
			});
	}
}

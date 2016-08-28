import JSZip from 'jszip';

export default class {
	constructor(gui) {
		this.gui = gui;
		// needed by jszip, look at their docu
		if (!window.FileReader || !window.ArrayBuffer) throw 'plugin upload not possible, FileReader or ArrayBuffer not available';
		document.querySelector('.upload-plugin')
			.addEventListener(
				'change',
				event => {
					[].forEach.call(event.target.files, f => this.handleFile(f));
					event.target.value = ''; // clear input for reupload of the same file
				}
		);
		this.initMessageInterface(() => {
			this.initDB(() => {
				this.loadPlugins();
			});
		});
	}

	initMessageInterface(callback) {
		this.sandbox = document.querySelector('iframe');

		// listen
		window.addEventListener('message', (event) => {
			if (event.data.handshakeSandbox) {
				callback();
			}
		});

		// handshake
		this.sandbox.onload = () => {
			if (!this.hasSendHanshake) {
				this.hasSendHanshake = true;
				this.sandboxMessage({ handshakeSandbox: true });
			}
		};
	}
	sandboxMessage(data) {
		this.sandbox.contentWindow.postMessage(data, '*');
	}

	loadPlugins() {
		const stationTemplate = `<div data-plugin="{{className}}">
				<img src="data:{{imageMime}};base64,{{image}}" width="{{width}}" height="{{height}}">
			</div>`;
		const pluginsTemplate = '<li>{{className}} <div class="delete-plugin" data-class-name="{{className}}">✕</div></li>';

		return this.getAll().then(items => {
			this.sandboxMessage({ loadScripts: items });

			document.querySelector('.stations').innerHTML = items.reduce((html, item) => `${html}${this.template(stationTemplate, item)}`, '');

			document.querySelector('.plugins-loaded').innerHTML = items.reduce((html, item) => `${html}${this.template(pluginsTemplate, item)}`, '');
			[].forEach.call(document.querySelectorAll('.delete-plugin'), el => {
				el.addEventListener('click', () => this.delete(el.dataset.className));
			});

			this.plugins = items;
		});
	}

	initDB(callback) {
		this.collectionName = 'plugins';

		//No support? Go in the corner and pout.
		if (!('indexedDB' in window)) throw ('Error: indexDB missing.');

		const openRequest = indexedDB.open('boomnextPlugins_v001a', 1);

		openRequest.onupgradeneeded = (event) => {
			const thisDB = event.target.result;
			if (!thisDB.objectStoreNames.contains(this.collectionName)) {
				thisDB.createObjectStore(this.collectionName, {
					keyPath: 'className',
				});
			}
		};
		openRequest.onsuccess = (event) => {
			this.db = event.target.result;
			callback();
		};
		openRequest.onerror = (event) => {
			throw ('Error: could not connect to indexDB.');
		};
	}

	/**
	 * ### template
	 * minimal templating framework
	 * ```
	 * this.template('<div>{{foo}}</div>', {foo: 'bar'})
	 * ```
	 * @param {String} html
	 * @param {Object} options
	 * @return {String}
	 */
	template(html, options) {
		let out = html;
		Object.keys(options).forEach(key => {
			out = out.replace(new RegExp(`\{\{${key}\}\}`, 'g'), options[key]);
		});
		return out;
	}

	// --
	// On file upload

	handleFile(file) {
		const mimes = {
			svg: 'image/svg+xml',
			png: 'image/png',
			jpg: 'image/jpeg',
			jpeg: 'image/jpeg',
			gif: 'image/gif',
		};
		let zip;
		let manifest;
		JSZip.loadAsync(file)
			.then(z => {
				zip = z;
				return zip.file('plugin.json').async('string');
			})
			.then(content => {
				manifest = JSON.parse(content);
				return this.get(manifest.className);
			})
			.then(exists => {
				if (exists) throw(`Plugin ${manifest.className} already exists. Delete first to replace.`);
				return Promise.all([
					/* 0 */ zip.file('Parser.js').async('string'),
					/* 1 */ zip.file(manifest.logoImg).async('base64'),
				]);
			})
			.then(values => {
				return this.set(Object.assign(manifest, {
					parser: values[0],
					image: values[1],
					imageMime: mimes[manifest.logoImg.match(/\.([^\.]+)$/)[1]],
				}));
			})
			.then(() => {
				this.gui.warn('Plugin uploaded successfully.', 'success');
				this.loadPlugins();
			})
			.catch(error => {
				this.gui.warn(error);
			});
	}

	// --
	// ## Database operations

	set(data) {
		const promise = new Promise((resolve, reject) => {
			// const request = this.db
			const ta = this.db.transaction([this.collectionName], 'readwrite');
			ta.onerror = (event) => reject(`Error ${event.target.error.name}`);
			const os = ta.objectStore(this.collectionName);
			os.onerror = (event) => reject(`Error ${event.target.error.name}`);
			const request = os.add(data);
			request.onerror = (event) => reject(`Error ${event.target.error.name}`);
			request.onsuccess = (event) => resolve(event);
		});
		return promise;
	}

	delete(id) {
		const request = this.db
			.transaction([this.collectionName], 'readwrite')
			.objectStore(this.collectionName)
			.delete(id);
		request.onerror = (event) => {
			this.gui.warn(`Error deleting ${id}: ${event.target.error.name}`);
		};
		request.onsuccess = (event) => {
			this.loadPlugins();
			this.gui.warn(`Deleted plugin ${id}`, 'success');
		};
	}

	getAll() {
		const promise = new Promise((resolve, reject) => {
			const request = this.db
				.transaction(this.collectionName, 'readonly')
				.objectStore(this.collectionName)
				.openCursor();
			request.onerror = event => reject(`Error ${event.target.error.name}`);
			request.onsuccess = event => {
				const items = [];
				const cursor = event.target.result;
				if (cursor) {
					items.push(cursor.value);
					cursor.continue();
				}
				resolve(items);
			};
		});
		return promise;
	}

	get(id) {
		const promise = new Promise((resolve, reject) => {
			const request = this.db
				.transaction(this.collectionName, 'readonly')
				.objectStore(this.collectionName)
				.get(id);
			request.onerror = event => reject(`Error ${event.target.error.name}`);
			request.onsuccess = event => resolve(event.target.result);
		});
		return promise;
	}
}

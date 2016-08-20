import JSZip from 'jszip';

export default class {
	constructor(gui, readyCallback) {
		this.gui = gui;
		if (!window.FileReader || !window.ArrayBuffer) throw 'plugin upload not possible, FileReader or ArrayBuffer not available';
		document.querySelector('.upload-plugin')
			.addEventListener(
				'change',
				event => [].forEach.call(event.target.files, f => this.handleFile(f))
		);

		this.initDB(() => {
			this.loadPlugins();
			readyCallback();
		});
	}

	loadPlugins() {
		const stationsEl = document.querySelector('.stations');
		const stationTemplate = `<div class="tv-station" data-name="{{className}}">
				<img src="data:{{imageMime}};base64,{{image}}" width="{{width}}" height="{{height}}">
			</div>`;
		const pluginsEL = document.querySelector('.plugins-loaded');
		const pluginsTemplate = '<li>{{className}} <div class="delete-plugin" data-class-name="{{className}}">✕</div></li>';
		this.getAll().then(items => {
			stationsEl.innerHTML = items.reduce((html, item) => `${html}${this.template(stationTemplate, item)}`, stationsEl.innerHTML);
			pluginsEL.innerHTML = items.reduce((html, item) => `${html}${this.template(pluginsTemplate, item)}`, '');
			[].forEach.call(document.querySelectorAll('.delete-plugin'), el => {
				el.addEventListener('click', () => this.delete(el.dataset.className, el.parentNode));
			});
		});
	}

	initDB(callback) {
		this.isReady = false;
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
			this.isReady = true;
			this.db = event.target.result;
			callback();
		};

		openRequest.onerror = (event) => {
			throw ('Error: could not connect to indexDB.');
		};
	}

	/**
	 * ###template
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
				this.set(Object.assign(manifest, {
					parser: values[0],
					image: values[1],
					imageMime: mimes[manifest.logoImg.match(/\.([^\.]+)$/)[1]],
				}), values[1]/* use put if key exists */);
			})
			.then(() => {
				this.gui.warn('Plugin uploaded successfully.', 'success');
			})
			.catch(error => {
				this.gui.warn(error);
			});
	}

	set(data, put = false) {
		const promise = new Promise((resolve, reject) => {
			const store = this.db
				.transaction([this.collectionName], 'readwrite')
				.objectStore(this.collectionName);

			const request = put ? store.put(data) : store.add(data);

			request.onerror = (event) => {
				reject(`Error ${event.target.error.name}`);
			};

			request.onsuccess = () => {
				resolve();
			};
		});
		return promise;
	}

	delete(id, el) {
		const request = this.db
			.transaction([this.collectionName], 'readwrite')
			.objectStore(this.collectionName)
			.delete(id);

		request.onerror = (event) => {
			this.gui.warn(`Error deleting ${id}: ${event.target.error.name}`);
		};
		request.onsuccess = (event) => {
			el.parentNode.removeChild(el);
			this.gui.warn(`Deleted plugin ${id}`, 'success');
		};
	}

	getAll() {
		const promise = new Promise((resolve, reject) => {
			const request = this.db
				.transaction(this.collectionName, 'readonly')
				.objectStore(this.collectionName)
				.openCursor();
			request.onerror = (event) => {
				reject(`Error ${event.target.error.name}`);
			};

			request.onsuccess = (event) => {
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
			request.onerror = (event) => {
				reject(`Error ${event.target.error.name}`);
			};

			request.onsuccess = (event) => {
				resolve(event.target.result);
			};
		});
		return promise;
	}
}

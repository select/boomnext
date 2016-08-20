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
		this.initDB();
	}

	initDB() {
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
		};

		openRequest.onerror = (event) => {
			throw ('Error: could not connect to indexDB.');
		};
	}

	template(html, options) {
		let re = /\{\{(.+?)\}\}/g,
			reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
			code = 'with(obj) { var r=[];\n',
			cursor = 0,
			result;
		var add = function(line, js) {
			js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
				(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
			return add;
		}
		while (match = re.exec(html)) {
			add(html.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}
		add(html.substr(cursor, html.length - cursor));
		code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
		try {
			result = new Function('obj', code).apply(options, [options]);
		} catch (err) {
			console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
		}
		return result;
	}

	handleFile(file) {
		console.log('handleFile!!!')
		debugger;
		let zip;
		JSZip.loadAsync(file)
			.then(z => {
				zip = z;
				return zip.file('plugin.json').async('string');
			})
			.then(content => JSON.parse(content))
			.then(manifest => Promise.all([
				/* 0 */ manifest,
				/* 1 */ this.get(manifest.className),
				/* 2 */ zip.file(manifest.logoImg).async('base64'),
				/* 3 */ zip.file('Parser.js').async('string'),
			]))
			.then(values => {
				debugger;
				if (values[1]) throw('plugin clasName already exists');
				this.set(Object.assign(values[0], { image: values[2], parser: values[3] }));
			})
			.then(() => {
				document.querySelector('.upload-success').display = 'block';
			})
			.catch(error => {
				console.warn('Error: ', error);
				this.gui.warn(`Error ${error}`);
			});
	}

	set(data) {
		const promise = new Promise((resolve, reject) => {
			const request = this.db
				.transaction([this.collectionName], 'readwrite')
				.objectStore(this.collectionName)
				.add(data);
			request.onerror = (event) => {
				reject(`Error ${event.target.error.name}`);
			};

			request.onsuccess = () => {
				resolve();
			};
		});
		return promise;
	}

	get(id) {
		const promise = new Promise((resolve, reject) => {
			const request = this.db
				.transaction([this.collectionName], 'readonly')
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

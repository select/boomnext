export default class {
	constructor(gui) {
		this.isReady = false;
		this.collectionName = 'videos';

		// // -----------------------
		// // Request storage usage and capacity left
		// navigator.webkitTemporaryStorage.queryUsageAndQuota(
		// 	(used, granted) => {
		// 		console.log('granted: ',granted);
		// 		const percent = 100 * used / granted;
		// 		if (percent === 100) gui.warn('IndexDB full!');
		// 		console.log(`## ${percent.toPrecision(2)}% storage used`);
		// 	},
		// 	error => {
		// 		console.log('Error', error);
		// 	}
		// );


		// -----------------------

		//No support? Go in the corner and pout.
		if (!('indexedDB' in window)) throw ('Error: indexDB missing.');

		const openRequest = indexedDB.open('boomnext_v001c', 1);

		openRequest.onupgradeneeded = (event) => {
			const thisDB = event.target.result;

			if (!thisDB.objectStoreNames.contains(this.collectionName)) {
				// const objectStore =
				thisDB.createObjectStore(this.collectionName, {
					keyPath: 'id',
				});
				// objectStore.createIndex('id', 'id', {
				// 	unique: true,
				// });
			}
		};

		openRequest.onsuccess = (event) => {
			this.isReady = true;
			this.db = event.target.result;
			// this.getAll();
		};

		openRequest.onerror = (event) => {
			throw ('Error: could not connect to indexDB.');
		};
	}

	exists(data = { id: undefined }) {
		return this.get(data.id)
			.then((result) => {
				if (result) return 'exists';
				else return this.set(data);
			})
			.then(res => res === 'exists');
	}

	set(data) {
		const promise = new Promise((resolve, reject) => {
			const request = this.db
				.transaction([this.collectionName], 'readwrite')
				.objectStore(this.collectionName)
				.add(data);
			request.onerror = event => reject(`Error ${event.target.error.name}`);
			request.onsuccess = () => resolve();
		});
		return promise;
	}

	get(id) {
		const promise = new Promise((resolve, reject) => {
			const request = this.db
				.transaction([this.collectionName], 'readonly')
				.objectStore(this.collectionName)
				.get(id);
			request.onerror = event => reject(`Error ${event.target.error.name}`);
			request.onsuccess = event => resolve(event.target.result);
		});
		return promise;
	}

	// getAll() {
	// 	const request = this.db
	// 		.transaction(this.collectionName, 'readonly')
	// 		.objectStore(this.collectionName)
	// 		.openCursor();
	// 	request.onerror = event => console.warn('error reading db');
	// 	let sum = 0;
	// 	request.onsuccess = event => {
	// 		const cursor = event.target.result;
	// 		if (cursor) {
	// 			const json = JSON.stringify(cursor.value);
	// 			console.log(json.length);
	// 			sum += json.length;
	// 			cursor.continue();
	// 		}else {
	// 			console.log('sum: ',sum);
	// 		}
	// 	};
	// }
}

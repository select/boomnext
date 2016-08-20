export default class {
	constructor() {
		this.isReady = false;
		this.collectionName = 'videos';

		// -----------------------
		// Request storage usage and capacity left
		navigator.webkitTemporaryStorage.queryUsageAndQuota(
			(used, granted) => {
				const percent = 100 * used / granted;
				console.log(`## ${percent.toPrecision(2)}% storage used`);
			},
			error => {
				console.log('Error', error);
			}
		);
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

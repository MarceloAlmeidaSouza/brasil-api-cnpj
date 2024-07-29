/*export const dbName = 'CNPJDatabase';
export const dbVersion = 1;
let db;

export function initIndexedDB() {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('cnpjData', { keyPath: 'cnpj' });
        objectStore.createIndex('cnpj', 'cnpj', { unique: true });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
    };

    request.onerror = function(event) {
        console.error('Erro ao abrir IndexedDB:', event.target.errorCode);
    };
}

export function saveToIndexedDB(data) {
    const transaction = db.transaction(['cnpjData'], 'readwrite');
    const objectStore = transaction.objectStore('cnpjData');
    const request = objectStore.put(data);

    request.onsuccess = function() {
        console.log('Dados salvos no IndexedDB.');
    };

    request.onerror = function(event) {
        console.error('Erro ao salvar dados no IndexedDB:', event.target.errorCode);
    };
}

export function getFromIndexedDB(cnpj, callback) {
    const transaction = db.transaction(['cnpjData'], 'readonly');
    const objectStore = transaction.objectStore('cnpjData');
    const request = objectStore.get(cnpj);

    request.onsuccess = function(event) {
        callback(event.target.result);
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar dados do IndexedDB:', event.target.errorCode);
    };
}

export function getAllFromIndexedDB(callback) {
    const transaction = db.transaction(['cnpjData'], 'readonly');
    const objectStore = transaction.objectStore('cnpjData');
    const request = objectStore.openCursor();
    const data = [];

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            data.push(cursor.value);
            cursor.continue();
        } else {
            callback(data);
        }
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar todos os dados do IndexedDB:', event.target.errorCode);
    };
}
*/

export const dbName = 'CNPJDatabase';
export const dbVersion = 1;
let db;

export function initIndexedDB() {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function(event) {
        db = event.target.result;

        if (!db.objectStoreNames.contains('cnpjData')) {
            const objectStore = db.createObjectStore('cnpjData', { keyPath: 'cnpj' });
            objectStore.createIndex('cnpj', 'cnpj', { unique: true });
        }

        if (!db.objectStoreNames.contains('cnpjDataEdited')) {
            const editedObjectStore = db.createObjectStore('cnpjDataEdited', { keyPath: 'cnpj' });
            editedObjectStore.createIndex('cnpj', 'cnpj', { unique: true });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
    };

    request.onerror = function(event) {
        console.error('Erro ao abrir IndexedDB:', event.target.errorCode);
    };
}

// Funções para cnpjData
export function saveToIndexedDB(data) {
    const transaction = db.transaction(['cnpjData'], 'readwrite');
    const objectStore = transaction.objectStore('cnpjData');
    const request = objectStore.put(data);

    request.onsuccess = function() {
        console.log('Dados salvos no IndexedDB.');
    };

    request.onerror = function(event) {
        console.error('Erro ao salvar dados no IndexedDB:', event.target.errorCode);
    };
}

export function getFromIndexedDB(cnpj, callback) {
    const transaction = db.transaction(['cnpjData'], 'readonly');
    const objectStore = transaction.objectStore('cnpjData');
    const request = objectStore.get(cnpj);

    request.onsuccess = function(event) {
        callback(event.target.result);
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar dados do IndexedDB:', event.target.errorCode);
    };
}

export function getAllFromIndexedDB(callback) {
    const transaction = db.transaction(['cnpjData'], 'readonly');
    const objectStore = transaction.objectStore('cnpjData');
    const request = objectStore.openCursor();
    const data = [];

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            data.push(cursor.value);
            cursor.continue();
        } else {
            callback(data);
        }
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar todos os dados do IndexedDB:', event.target.errorCode);
    };
}

// Funções para cnpjDataEdited
export function saveToEditedIndexedDB(data) {
    const transaction = db.transaction(['cnpjDataEdited'], 'readwrite');
    const objectStore = transaction.objectStore('cnpjDataEdited');
    const request = objectStore.put(data);  // put() insere ou atualiza

    request.onsuccess = function() {
        console.log('Dados salvos no IndexedDB (editados).');
    };

    request.onerror = function(event) {
        console.error('Erro ao salvar dados no IndexedDB (editados):', event.target.errorCode);
    };
}

export function getFromEditedIndexedDB(cnpj, callback) {
    const transaction = db.transaction(['cnpjDataEdited'], 'readonly');
    const objectStore = transaction.objectStore('cnpjDataEdited');
    const request = objectStore.get(cnpj);

    request.onsuccess = function(event) {
        callback(event.target.result);
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar dados do IndexedDB (editados):', event.target.errorCode);
    };
}

export function getAllFromEditedIndexedDB(callback) {
    const transaction = db.transaction(['cnpjDataEdited'], 'readonly');
    const objectStore = transaction.objectStore('cnpjDataEdited');
    const request = objectStore.openCursor();
    const data = [];

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            data.push(cursor.value);
            cursor.continue();
        } else {
            callback(data);
        }
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar todos os dados do IndexedDB (editados):', event.target.errorCode);
    };
}

export function getPaginatedEditedDataFromIndexedDB(pageIndex, pageSize, callback) {
    const transaction = db.transaction(['cnpjDataEdited'], 'readonly');
    const objectStore = transaction.objectStore('cnpjDataEdited');
    const request = objectStore.openCursor();
    const data = [];
    let counter = 0;

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            if (counter >= pageIndex * pageSize && counter < (pageIndex + 1) * pageSize) {
                data.push(cursor.value);
            }
            counter++;
            cursor.continue();
        } else {
            callback(data);
        }
    };

    request.onerror = function(event) {
        console.error('Erro ao recuperar dados paginados do IndexedDB (editados):', event.target.errorCode);
    };
}

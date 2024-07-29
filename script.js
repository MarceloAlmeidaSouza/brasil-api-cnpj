import Main from './components/Main.js';
import { initIndexedDB } from './services/indexedDBService.js';

document.addEventListener('DOMContentLoaded', () => {
    initIndexedDB();
    Main.main(document.getElementById('app'));
});

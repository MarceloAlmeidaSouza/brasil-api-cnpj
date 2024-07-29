import Dom from "../utilities/Dom.js";

export default class Loader{
    static get #loader(){
        return document.getElementById("loader");
    }

    static main(parent){
        const main = Dom.castToElement(`
            <div id="loader" style="display:contents">
                <div id="loader" class="loader-container d-flex">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <style>
                    .loader-container {
                        display: none; /* Hide the loader by default */
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(255, 255, 255, 0.8);
                        z-index: 1050; /* Bootstrap modal z-index is 1040 */
                        justify-content: center;
                        align-items: center;
                    }
                </style>
            </div>
        `);
        parent?.appendChild(main);    
        return main;
    }

    static unload(){
        Loader.#loader.remove();
    }
}
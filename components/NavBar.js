import Dom from '../utilities/Dom.js';

export default class NavBar{
    static get #navActionsElement(){
        return document.getElementById("navbar-actions");
    }

    static get #navTitleElement(){
        return document.getElementById("navbar-title");
    }

    static main(title){
        const main = Dom.castToElement(`
            <nav class="navbar navbar-light bg-light">
                <span id="navbar-title" class="navbar-brand mb-0 h1">${title ?? ""}</span>
                <div id="navbar-actions"></div>
            </nav>
        `)
        return main;
    }

    static setTitle(title){
        this.#navTitleElement.textContent = title;
    }

    static actions(actions){
        NavBar.#navActionsElement.replaceChildren(actions ? Dom.castToElement(actions) : []);
    }
}

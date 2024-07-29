import ConsultaCNPJ from './ConsultaCNPJ.js';
import NavBar from './NavBar.js';
import Breadcrumb from './Breadcrumb.js';

import Dom from '../utilities/Dom.js';
import Mapa from './Mapa.js';


export default class Main {
    static get #content(){
        return document.getElementById("main-content");
    }

    static main(app) {
        
        app.appendChild(NavBar.main());
        app.appendChild(Breadcrumb.main());

        app.appendChild(Dom.castToElement(`<div id="main-content" class="mt-3"></div>`))
        .appendChild(ConsultaCNPJ.main());

        document.body.append(Mapa.main());
    }

    static playComponent(component){
        Main.#content.innerHTML = '';
        Main.#content.replaceChildren(component);
    }

}

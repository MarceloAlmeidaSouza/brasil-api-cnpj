import Dom from "../utilities/Dom.js";

export default class Breadcrumb{
    static #breadcrumbs = [];
    static get #breadcrumbElement(){
        return document.getElementById("breadcrumb-itens");
    }

    static main(){
        const main = Dom.castToElement(`
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb" id="breadcrumb-itens"></ol>
            </nav>
        `);
        
        main.addEventListener('click', ({target}) => {
            if(target instanceof HTMLAnchorElement){
                const idx = this.#breadcrumbs.findIndex(([el])=>el.firstChild == target);
                if(idx > -1){
                    this.#breadcrumbs = this.#breadcrumbs.slice(0, idx + 1);
                    const node = this.#breadcrumbs[idx][0];
                    node.innerHTML = node.textContent;
                    node.classList.add("active");
                    this.#breadcrumbElement.replaceChildren(...this.#breadcrumbs.map(e=>e[0]));
                    this.#breadcrumbs[idx][1]?.();
                }
            }
        });
        return main;
    }

    static add(title, callback){
        const node = Dom.castToElement(`<li class="breadcrumb-item">${title}</li>`);
        
        Breadcrumb.#breadcrumbs.push([node, callback]);

        if(Breadcrumb.#breadcrumbs.length > 1){
            const previousNode = Breadcrumb.#breadcrumbs[Breadcrumb.#breadcrumbs.length - 2][0];
            previousNode.classList.remove("active");
            previousNode.removeAttribute('aria-current');
            previousNode.replaceChildren(Dom.castToElement(`<a href="#">${previousNode.textContent}</a>`))

            node.classList.add("active");
            node.setAttribute('aria-current', 'page');
        }

        Breadcrumb.#breadcrumbElement.appendChild(node);
    }

}
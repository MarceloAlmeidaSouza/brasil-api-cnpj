import Dom from "../utilities/Dom.js";
import Breadcrumb from "./Breadcrumb.js";
import NavBar from "./NavBar.js";
import Main from "./Main.js";
import { getAllFromIndexedDB, getAllFromEditedIndexedDB } from '../services/indexedDBService.js';
import CNPJForm from "./CNPJForm.js";
import CNPJPDF from "../services/cnpjPDF.js";
import Mapa from "./Mapa.js";

export default class CNPJList{
    static get #cnpjList(){
        return document.getElementById("cnpj-list");
    }
    static #lastSnapshotContent;

    static getLastSnapshotContent() {
        return CNPJList.#lastSnapshotContent ?? CNPJList.main();
    }

    static main({isViewOnly=true, title="Historico de consultas"}={}){
        Breadcrumb.add(title, ()=>{
            NavBar.setTitle(title);
            Main.playComponent(isViewOnly ? CNPJList.getLastSnapshotContent() : main());
        });

        const main = ()=>{
            NavBar.actions();

            NavBar.setTitle(title);
            const main = Dom.castToElement(`
                <div id="cnpj-list" style="display:contents;">
                    <div class="container">
                        <div id="data-list" class="list-group"></div>
                        <nav id="pagination" class="pagination"></nav>
                    </div>
                    <style>
                        .btn-icon {
                            background: none;
                            border: none;
                            color: #007bff;
                            cursor: pointer;
                            font-size: 24px; /* Tamanho do ícone */
                            width: 40px; /* Largura do botão */
                            height: 40px; /* Altura do botão */
                            border-radius: 50%; /* Tornar o botão circular */
                            margin-right: 8px;
                            padding: 0; /* Remove padding para manter o formato circular */
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: background-color 0.3s, color 0.3s;
                        }
    
                        .btn-icon:hover {
                            background-color: rgba(0, 0, 0, 0.1); /* Efeito de hover */
                            color: #0056b3; /* Cor do ícone ao passar o mouse */
                        }
    
                        .btn-icon:focus {
                            outline: none; /* Remove o contorno de foco */
                        }
    
                        .icon-buttons {
                            display: flex;
                            align-items: center;
                        }
    
                        .list-group-item {
                            position: relative;
                            padding-bottom: 70px; /* Espaço suficiente para o rodapé */
                            margin-bottom: 20px; /* Espaço entre os itens da lista */
                            background-color: #fff; /* Fundo branco para destacar o item */
                            border: 1px solid #ddd; /* Bordas para destacar o item */
                            border-radius: 5px; /* Cantos arredondados */
                        }
    
                        .item-footer {
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            width: calc(100% - 20px); /* Ajuste de largura para caber no contêiner */
                            padding-top: 10px;
                            border-top: 1px solid #ddd;
                            background-color: white; /* Fundo branco para evitar sobreposição de conteúdo */
                        }
    
                        .card-body .btn-info {
                            margin-left: auto;
                        }
                    </style>
                </div>
            `);
    
            Dom.onInserted(main, ()=>{
                isViewOnly
                ? getAllFromIndexedDB((data)=>{
                    CNPJList.#setupPagination(data, 10, isViewOnly);
                })
    
                : getAllFromEditedIndexedDB((data)=>{
                    CNPJList.#setupPagination(data, 10, isViewOnly);
                });
            });
    
            CNPJList.#lastSnapshotContent = main;

            return main;
        }

        return main();
    }

    static #setupPagination(data, itemsPerPage, isViewOnly) {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const paginationElement = document.getElementById('pagination');
        const listElement = document.getElementById('data-list');

        function renderPage(page) {
            listElement.innerHTML = '';
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedData = data.slice(start, end);

            paginatedData.forEach(item => {
                const listItem = document.createElement('div');
                listItem.classList.add('list-group-item');
                listItem.appendChild(Dom.castToElement(`
                    <div>
                        <h5>${item.razao_social}</h5>
                        <p>${item.logradouro}, ${item.numero}, ${item.bairro}, ${item.municipio}, ${item.uf}</p>
                        <p><strong>CNPJ:</strong> ${item.cnpj}</p>
                    </div>
                `));

                listItem.appendChild(Dom.castToElement(`
                    <div class="item-footer">
                        <div class="icon-buttons">
                            <button id="exportar-cnpj-${item.cnpj}" type="button" class="btn-icon" data-toggle="tooltip" title="Exportar para PDF">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button id="share-cnpj-${item.cnpj}" type="button" class="btn-icon" data-toggle="tooltip" title="Compartilhar">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button id="map-cnpj-${item.cnpj}" type="button" class="btn-icon" data-toggle="modal" data-target="#mapModal" title="Ver no mapa">
                                <i class="fas fa-map-marker-alt"></i>
                            </button>
                        </div>
                        <div>
                            <button id="edit-cnpj-${item.cnpj}" type="button" class="btn btn-primary">
                                ${isViewOnly ? '<i class="fas fa-eye"></i> Visualizar' : '<i class="fas fa-edit"></i> Editar'}
                            </button>
                        </div>
                    </div>
                `));
                
                listElement.appendChild(listItem);

                document.getElementById(`edit-cnpj-${item.cnpj}`).addEventListener('click', () => {
                    // Função para editar ou visualizar o item
                    CNPJList.editOrViewItem(item, isViewOnly);  // false para edição
                });

                document.getElementById(`exportar-cnpj-${item.cnpj}`).addEventListener('click', () => {
                    // Função para exportar o item para PDF
                    CNPJPDF.export(item);
                });

                document.getElementById(`share-cnpj-${item.cnpj}`).addEventListener('click', () => {
                    // Função para compartilhar o item
                    CNPJPDF.share(item);
                });

                document.getElementById(`map-cnpj-${item.cnpj}`).addEventListener('click', () => {
                    // Função para ver o item no mapa
                    Mapa.locate(item);
                });
            });

            renderPaginationControls(page, totalPages);
        }

        function renderPaginationControls(currentPage, totalPages) {
            paginationElement.innerHTML = '';
            const ul = document.createElement('ul');
            ul.classList.add('pagination');

            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.classList.add('page-item');
                if (i === currentPage) {
                    li.classList.add('active');
                }
                const a = document.createElement('a');
                a.classList.add('page-link');
                a.textContent = i;
                a.href = '#';
                a.addEventListener('click', (event) => {
                    event.preventDefault();
                    renderPage(i);
                });
                li.appendChild(a);
                ul.appendChild(li);
            }

            paginationElement.appendChild(ul);
            
        }

        renderPage(1); // Render the first page initially
    }

    static editOrViewItem(item, isViewOnly) {
        CNPJList.#lastSnapshotContent = CNPJList.#cnpjList;
        // Função para abrir o item em modo de edição ou visualização
        if (isViewOnly) {
            // Abrir o item em modo de visualização
            Main.playComponent(CNPJForm.main());
            CNPJForm.setData(item);
        } else {
            // Abrir o item em modo de edição
            Main.playComponent(CNPJForm.main({isViewOnly:false}));
            CNPJForm.setData(item);
        }
    }
}

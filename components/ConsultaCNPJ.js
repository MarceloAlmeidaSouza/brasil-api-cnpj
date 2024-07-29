import Dom from "../utilities/Dom.js";
import apiService from '../services/apiService.js';
import { getFromIndexedDB, saveToIndexedDB } from '../services/indexedDBService.js';
import DetalhesModal from './DetalhesModal.js';
import CNPJPDF from "../services/cnpjPDF.js";
import Mapa from "./Mapa.js";
import Loader from "./Loader.js";
import CNPJForm from "./CNPJForm.js";
import NavBar from './NavBar.js';
import Breadcrumb from './Breadcrumb.js';
import Main from "./Main.js";

import CNPJList from './CNPJList.js';

export default class ConsultaCNPJ {
    static get #consultaCNPJ(){
        return document.getElementById("consulta-cnpj");
    }
    static #resultadoElement;
    static #lastSnapshotContent;

    static getLastSnapshotContent() {
        return ConsultaCNPJ.#lastSnapshotContent ?? ConsultaCNPJ.main();
    }

    static get #actions() {
        const actions = Dom.castToElement(`
            <div style="display:contents">

                <button id="listaEditadosButton" class="btn btn-outline-secondary" data-toggle="tooltip" title="Lista de Itens Editados">
                    <i class="fas fa-edit"></i>
                </button>

                <button id="historicoButton" class="btn btn-outline-secondary" data-toggle="tooltip" title="Histórico de Consultas">
                    <i class="fas fa-history"></i>
                </button>
            </div>
        `);

        actions.querySelector("#historicoButton").addEventListener("click", ()=>{
            Main.playComponent(CNPJList.main());
        });

        actions.querySelector("#listaEditadosButton").addEventListener("click", ()=>{
            Main.playComponent(CNPJList.main({isViewOnly:false, title:"CNPJs Editados"}));
        });

        return actions;
    }

    static main() {

        const main = Dom.castToElement(`
            <div style="display=contents" id="consulta-cnpj">
                <div class="form-group d-flex align-items-center">
                    <input type="text" id="cnpj" class="form-control mr-2" placeholder="Digite o CNPJ">
                    <button id="btn-consultar-cnpj" class="btn btn-primary">Consultar</button>
                </div>
                <div class="container d-flex justify-content-center">
                    <div class="row">
                        <div class="col" id="consulta-resultado">
                            
                        </div>
                    </div>
                </div>
            </div>
        `);


        NavBar.actions(ConsultaCNPJ.#actions);
        NavBar.setTitle("Consulta de CNPJ");

        Breadcrumb.add('Consulta de CNPJ', ()=>{
            NavBar.actions(ConsultaCNPJ.#actions);
            NavBar.setTitle("Consulta de CNPJ");
            Main.playComponent(ConsultaCNPJ.getLastSnapshotContent() ?? ConsultaCNPJ.main());
        });

        main.querySelector("#btn-consultar-cnpj").addEventListener('click', this.#consulta);
        this.#resultadoElement = main.querySelector("#consulta-resultado");
        main.appendChild(DetalhesModal.main());

        ConsultaCNPJ.#lastSnapshotContent = main;

        return main;
    }

    static async #consulta() {
        const cnpj = document.getElementById('cnpj').value.replace(/\D/g, '');
        if (cnpj.length !== 14) {
            alert('Por favor, insira um CNPJ válido.');
            return;
        }

        Loader.main(ConsultaCNPJ.#consultaCNPJ);

        getFromIndexedDB(cnpj, async (data) => {
            if (data) {
                ConsultaCNPJ.#mostrarDados(data);
            } else {
                const apiData = await apiService.consultarCNPJ(cnpj);
                ConsultaCNPJ.#mostrarDados(apiData);
                saveToIndexedDB(apiData);
            }
            Loader.unload();
        });
    }

    static #mostrarDados(data) {
        ConsultaCNPJ.#resultadoElement.innerHTML = `
            <div class="card">
                <h5 class="card-header">${data.razao_social || 'Nome não disponível'}</h5>
                <div class="card-body">
                    <h5 class="card-title">CNPJ: ${data.cnpj}</h5>
                    <p><strong>Razão Social:</strong> ${data.razao_social || 'Não disponível'}</p>
                    <p><strong>Data de Abertura:</strong> ${data.data_inicio_atividade || 'Não disponível'}</p>
                    <p><strong>Situação:</strong> ${data.descricao_situacao_cadastral || 'Não disponível'}</p>
                    <p><strong>Atividade Principal:</strong> ${data.cnae_fiscal_descricao || 'Não disponível'}</p>
                    <p><strong>Endereço:</strong> ${data.logradouro || 'Não disponível'}, ${data.numero || 'Não disponível'} - ${data.bairro || 'Não disponível'}, ${data.municipio || 'Não disponível'} - ${data.uf || 'Não disponível'}, ${data.cep || 'Não disponível'}</p>
                    <p><strong>Telefone:</strong> ${data.ddd_telefone_1 || 'Não disponível'}</p>
                    <p><strong>E-mail:</strong> ${data.email || 'Não disponível'}</p>
                    <div class="d-flex justify-content-between align-items-center" style="flex-wrap: wrap;">
                        <div class="icon-buttons">
                            <button id="exportar-cnpj" type="button" class="btn-icon" data-toggle="tooltip" title="Exportar para PDF">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button id="share-cnpj" type="button" class="btn-icon" data-toggle="tooltip" title="Compartilhar">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button id="map-cnpj" type="button" class="btn-icon" data-toggle="modal" data-target="#mapModal" title="Ver no mapa">
                                <i class="fas fa-map-marker-alt"></i>
                            </button>
                        </div>
                        <div>
                            <button 
                                type="button" 
                                class="btn btn-outline-secondary"
                                id="cnpj-detalhes" 
                                data-toggle="modal" 
                                data-target="#detalhesModal"
                            >
                                Detalhes
                            </button>
                            <button id="edit-cnpj" type="button" class="btn btn-primary">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                        </div>
                    </div>
                </div>
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

                .card-body .btn-info {
                    margin-left: auto;
                }
            </style>

        `;

        ConsultaCNPJ.#resultadoElement.querySelector("#cnpj-detalhes")
            .addEventListener('click', () => {
                DetalhesModal.populateModal(data);
            });

        ConsultaCNPJ.#resultadoElement.querySelector("#exportar-cnpj")
            .addEventListener('click', () => {
                CNPJPDF.export(data);
            });

            ConsultaCNPJ.#resultadoElement.querySelector("#map-cnpj")
            .addEventListener('click', () => {
                Mapa.locate(data);
            });

            ConsultaCNPJ.#resultadoElement.querySelector("#share-cnpj")
            .addEventListener('click', () => {
                CNPJPDF.share(data);
            });

            ConsultaCNPJ.#resultadoElement.querySelector("#edit-cnpj")
            .addEventListener('click', () => {
                ConsultaCNPJ.#lastSnapshotContent = document.getElementById("consulta-cnpj");
                Main.playComponent(CNPJForm.main({isViewOnly:false}));
                CNPJForm.setData(data);
            });

        ConsultaCNPJ.#lastSnapshotContent = document.getElementById("consulta-cnpj");
    }
}
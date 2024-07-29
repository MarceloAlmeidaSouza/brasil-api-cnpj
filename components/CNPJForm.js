import Dom from "../utilities/Dom.js";
import NavBar from "./NavBar.js";
import Breadcrumb from './Breadcrumb.js';
import { saveToEditedIndexedDB } from '../services/indexedDBService.js';

export default class CNPJForm {
    static #isViewOnly;
    static main({isViewOnly=true}={}) {
        CNPJForm.#isViewOnly = isViewOnly;
        const main = Dom.castToElement(`
            <div class="container mt-2">
                <h1>Dados da Empresa</h1>
                <form id="companyForm">
                    <div >

                        <!-- Informações Gerais -->
                        <div class="card" id="accordion1">
                            <div class="card-header" id="headingOne">
                                <h5 class="mb-0">
                                    <button type="button" class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Informações Gerais
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion1">
                                <div class="card-body">
                                    <div class="form-group">
                                        <label for="razao_social">Razão Social</label>
                                        <input type="text" class="form-control" id="razao_social" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="cnpj">CNPJ</label>
                                        <input type="text" class="form-control" id="cnpj" disabled>
                                    </div>
                                    <div class="form-group">
                                        <label for="data_inicio_atividade">Data de Início</label>
                                        <input type="text" class="form-control" id="data_inicio_atividade" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="descricao_situacao_cadastral">Situação Cadastral</label>
                                        <input type="text" class="form-control" id="descricao_situacao_cadastral" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="cnae_fiscal_descricao">CNAE Fiscal</label>
                                        <input type="text" class="form-control" id="cnae_fiscal_descricao" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="opcao_pelo_mei">Opção pelo MEI</label>
                                        <input type="text" class="form-control" id="opcao_pelo_mei" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Endereço -->
                        <div class="card" id="accordion2">
                            <div class="card-header" id="headingTwo">
                                <h5 class="mb-0">
                                    <button type="button" class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        Endereço
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion2">
                                <div class="card-body">
                                    <div class="form-group">
                                        <label for="logradouro">Logradouro</label>
                                        <input type="text" class="form-control" id="logradouro" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="numero">Número</label>
                                        <input type="text" class="form-control" id="numero" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="bairro">Bairro</label>
                                        <input type="text" class="form-control" id="bairro" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="municipio">Município</label>
                                        <input type="text" class="form-control" id="municipio" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="uf">Estado (UF)</label>
                                        <input type="text" class="form-control" id="uf" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="cep">CEP</label>
                                        <input type="text" class="form-control" id="cep" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="complemento">Complemento</label>
                                        <input type="text" class="form-control" id="complemento" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Informações de Contato -->
                        <div class="card" id="accordion3">
                            <div class="card-header" id="headingThree">
                                <h5 class="mb-0">
                                    <button type="button" class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Informações de Contato
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion3">
                                <div class="card-body">
                                    <div class="form-group">
                                        <label for="ddd_telefone_1">Telefone 1</label>
                                        <input type="text" class="form-control" id="ddd_telefone_1" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input type="text" class="form-control" id="email" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CNAEs Secundários -->
                        <div class="card" id="accordion4">
                            <div class="card-header" id="headingFour">
                                <h5 class="mb-0">
                                    <button type="button" class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                        CNAEs Secundários
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion4">
                                <div class="card-body" id="cnaesSecundariosContainer">
                                    <!-- CNAEs Secundários serão populados dinamicamente -->
                                </div>
                            </div>
                        </div>

                        <!-- Sócios -->
                        <div class="card" id="accordion5">
                            <div class="card-header" id="headingFive">
                                <h5 class="mb-0">
                                    <button type="button" class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                        Sócios
                                    </button>
                                </h5>
                            </div>
                            <div id="collapseFive" class="collapse" aria-labelledby="headingFive" data-parent="#accordion5">
                                <div class="card-body" id="partnersContainer">
                                    <!-- Detalhes dos sócios serão populados dinamicamente -->
                                </div>
                            </div>
                        </div>

                    </div>
                    ${
                        CNPJForm.#isViewOnly 
                        ? ''
                        : '<button type="button" id="editButton" class="btn btn-primary">Editar</button>'
                    }
                    <button type="submit" id="saveButton" class="btn btn-success" style="display: none;">Salvar</button>
                    <button type="button" id="cancelButton" class="btn btn-secondary" style="display: none;">Cancelar</button>
                   
                </form>
                 
            </div>
        `);

        NavBar.actions();
        NavBar.setTitle("Formulário CNPJ");
        return main;
    }

    static setData(data) {
        Breadcrumb.add(`${CNPJForm.#isViewOnly ? 'Visualizar' : 'Editar'} - ${data.cnpj ?? ''}`);
        const form = document.getElementById('companyForm');
        const editButton = document.getElementById('editButton');
        const saveButton = document.getElementById('saveButton');
        const cancelButton = document.getElementById('cancelButton');

        // Função para definir campos do formulário como somente leitura ou editáveis
        const setFormEditable = (editable) => {
            const fields = form.querySelectorAll('input:not(#cnpj)');
            fields.forEach(field => {
                field.readOnly = !editable;
            });
        };

        // Populando os campos do formulário com os dados
        document.getElementById('uf').value = data.uf;
        document.getElementById('cep').value = data.cep;
        document.getElementById('cnpj').value = data.cnpj;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('numero').value = data.numero;
        document.getElementById('logradouro').value = data.logradouro;
        document.getElementById('complemento').value = data.complemento;
        document.getElementById('razao_social').value = data.razao_social;
        document.getElementById('data_inicio_atividade').value = data.data_inicio_atividade;
        document.getElementById('descricao_situacao_cadastral').value = data.descricao_situacao_cadastral;
        document.getElementById('cnae_fiscal_descricao').value = data.cnae_fiscal_descricao;
        document.getElementById('ddd_telefone_1').value = data.ddd_telefone_1;
        document.getElementById('email').value = data.email;
        document.getElementById('municipio').value = data.municipio;

        // Definindo campo booleano
        document.getElementById('opcao_pelo_mei').value = data.opcao_pelo_mei ? 'Sim' : 'Não';

        // Populando CNAEs Secundários
        const cnaesSecundariosContainer = document.getElementById('cnaesSecundariosContainer');
        cnaesSecundariosContainer.innerHTML = '';
        data.cnaes_secundarios?.forEach(cnae => {
            const cnaeElement = document.createElement('div');
            cnaeElement.classList.add('form-group');
            cnaeElement.innerHTML = `
                <label>Código CNAE</label>
                <input type="text" class="form-control" value="${cnae.codigo}" readonly>
                <label>Descrição</label>
                <input type="text" class="form-control" value="${cnae.descricao}" readonly>
            `;
            cnaesSecundariosContainer.appendChild(cnaeElement);
        });

        // Populando sócios
        const partnersContainer = document.getElementById('partnersContainer');
        partnersContainer.innerHTML = '';
        data.qsa?.forEach(partner => {
            const partnerCard = document.createElement('div');
            partnerCard.classList.add('card', 'mb-3');
            partnerCard.innerHTML = `
                <div class="card-header">
                    <h5 class="mb-0">${partner.nome_socio}</h5>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label>Qualificação do Sócio</label>
                        <input type="text" class="form-control" value="${partner.qualificacao_socio}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Faixa Etária</label>
                        <input type="text" class="form-control" value="${partner.faixa_etaria}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Nome Representante Legal</label>
                        <input type="text" class="form-control" value="${partner.nome_representante_legal}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Qualificação Representante Legal</label>
                        <input type="text" class="form-control" value="${partner.qualificacao_representante_legal}" readonly>
                    </div>
                </div>
            `;
            partnersContainer.appendChild(partnerCard);
        });

        // Definindo o estado inicial do formulário como somente leitura
        setFormEditable(false);

        // Listener para botão de editar
        editButton?.addEventListener('click', () => {
            setFormEditable(true);
            editButton.style.display = 'none';
            saveButton.style.display = 'inline-block';
            cancelButton.style.display = 'inline-block';
        });

        // Listener para botão de cancelar
        cancelButton.addEventListener('click', () => {
            setFormEditable(false);
            editButton.style.display = 'inline-block';
            saveButton.style.display = 'none';
            cancelButton.style.display = 'none';
        });

        // Listener para botão de salvar
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            // Coletando os dados atualizados
            const updatedData = {
                uf: document.getElementById('uf').value,
                cep: document.getElementById('cep').value,
                cnpj: document.getElementById('cnpj').value,
                bairro: document.getElementById('bairro').value,
                numero: document.getElementById('numero').value,
                logradouro: document.getElementById('logradouro').value,
                complemento: document.getElementById('complemento').value,
                razao_social: document.getElementById('razao_social').value,
                data_inicio_atividade: document.getElementById('data_inicio_atividade').value,
                descricao_situacao_cadastral: document.getElementById('descricao_situacao_cadastral').value,
                cnae_fiscal_descricao: document.getElementById('cnae_fiscal_descricao').value,
                ddd_telefone_1: document.getElementById('ddd_telefone_1').value,
                email: document.getElementById('email').value,
                municipio: document.getElementById('municipio').value,
                opcao_pelo_mei: document.getElementById('opcao_pelo_mei').value === 'Sim'
            };

            saveToEditedIndexedDB(updatedData);
            // Opcionalmente, envie os dados atualizados para o servidor ou processe-os conforme necessário

            setFormEditable(false);
            if(editButton)
                editButton.style.display = 'inline-block';
            saveButton.style.display = 'none';
            cancelButton.style.display = 'none';
        });
    }
}

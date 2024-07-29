import Dom from "../utilities/Dom.js";

export default class DetalhesModal {
    static main() {
        const main = Dom.castToElement(`
        <div class="modal fade" id="detalhesModal" tabindex="-1" role="dialog" aria-labelledby="detalhesModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="detalhesModalLabel">Detalhes</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <!-- Detalhes preenchidos pelo JavaScript -->
                        <p><strong>Natureza Jurídica:</strong> <span id="natureza-juridica"></span></p>
                        <p><strong>Capital Social:</strong> R$ <span id="capital-social"></span></p>
                        <p><strong>Data de Início de Atividade:</strong> <span id="data-inicio-atividade"></span></p>
                        <p><strong>CNAE Fiscal:</strong> <span id="cnae-fiscal"></span></p>
                        <p><strong>Endereço:</strong> <span id="endereco"></span></p>
                        <p><strong>Complemento:</strong> <span id="complemento"></span></p>
                        <p><strong>CNAEs Secundários:</strong></p>
                        <ul id="cnaes-secundarios"></ul>
                        <p><strong>Sociedades:</strong></p>
                        <ul id="sociedades"></ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `);

        return main;
    }

    static populateModal(data) {
        document.getElementById('natureza-juridica').textContent = data.natureza_juridica || 'Não disponível';
        document.getElementById('capital-social').textContent = data.capital_social ? data.capital_social.toLocaleString('pt-BR') : 'Não disponível';
        document.getElementById('data-inicio-atividade').textContent = data.data_inicio_atividade || 'Não disponível';
        document.getElementById('cnae-fiscal').textContent = data.cnae_fiscal_descricao || 'Não disponível';
        document.getElementById('endereco').textContent = `${data.logradouro || 'Não disponível'}, ${data.numero || 'Não disponível'}, ${data.bairro || 'Não disponível'}, ${data.municipio || 'Não disponível'} - ${data.uf || 'Não disponível'}, ${data.cep || 'Não disponível'}`;
        document.getElementById('complemento').textContent = data.complemento || 'Não disponível';

        const cnaesSecundariosList = document.getElementById('cnaes-secundarios');
        cnaesSecundariosList.innerHTML = data.cnaes_secundarios && data.cnaes_secundarios.length > 0 ?
            data.cnaes_secundarios.map(cnae => `<li>${cnae.descricao}</li>`).join('') :
            '<li>Não disponível</li>';

        const sociedadesList = document.getElementById('sociedades');
        sociedadesList.innerHTML = data.qsa && data.qsa.length > 0 ?
            data.qsa.map(socio => `
            <li>
                ${socio.nome_socio || 'Nome não disponível'} (${socio.qualificacao_socio || 'Qualificação não disponível'}) - ${socio.pais || 'Não informado'}
                <ul>
                    <li><strong>Data de Entrada:</strong> ${socio.data_entrada_sociedade || 'Não disponível'}</li>
                    <li><strong>Representante Legal:</strong> ${socio.nome_representante_legal || 'Não informado'} (${socio.qualificacao_representante_legal || 'Não informado'})</li>
                </ul>
            </li>
        `).join('') :
            '<li>Não disponível</li>';
    }
}
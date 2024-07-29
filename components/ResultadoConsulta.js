export function renderResultadoConsulta() {
    return `
        <div id="resultado" class="mt-4"></div>
    `;
}

export function mostrarDados(data) {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
        <div class="card">
            <h3>${data.razao_social || 'Nome não disponível'}</h3>
            <p><strong>Razão Social:</strong> ${data.razao_social || 'Não disponível'}</p>
            <p><strong>Data de Abertura:</strong> ${data.data_inicio_atividade || 'Não disponível'}</p>
            <p><strong>Situação:</strong> ${data.descricao_situacao_cadastral || 'Não disponível'}</p>
            <p><strong>Atividade Principal:</strong> ${data.cnae_fiscal_descricao || 'Não disponível'}</p>
            <p><strong>Endereço:</strong> ${data.logradouro || 'Não disponível'}, ${data.numero || 'Não disponível'} - ${data.bairro || 'Não disponível'}, ${data.municipio || 'Não disponível'} - ${data.uf || 'Não disponível'}, ${data.cep || 'Não disponível'}</p>
            <p><strong>Telefone:</strong> ${data.ddd_telefone_1 || 'Não disponível'}</p>
            <p><strong>E-mail:</strong> ${data.email || 'Não disponível'}</p>
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#detalhesModal">Ver Detalhes</button>
        </div>
    `;

    // Popula o modal com detalhes adicionais
    const modalBody = document.querySelector('#detalhesModal .modal-body');
    modalBody.innerHTML = `
        <p><strong>Natureza Jurídica:</strong> ${data.natureza_juridica || 'Não disponível'}</p>
        <p><strong>Capital Social:</strong> R$ ${data.capital_social ? data.capital_social.toLocaleString('pt-BR') : 'Não disponível'}</p>
        <p><strong>Data de Início de Atividade:</strong> ${data.data_inicio_atividade || 'Não disponível'}</p>
        <p><strong>CNAE Fiscal:</strong> ${data.cnae_fiscal_descricao || 'Não disponível'}</p>
        <p><strong>Endereço:</strong> ${data.logradouro || 'Não disponível'}, ${data.numero || 'Não disponível'} - ${data.bairro || 'Não disponível'}, ${data.municipio || 'Não disponível'} - ${data.uf || 'Não disponível'}, ${data.cep || 'Não disponível'}</p>
    `;
}

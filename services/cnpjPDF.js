export default class CNPJPDF {
    static #buildPDF(data) {
        try {
            if (window.jspdf && window.jspdf.jsPDF) {
                const { jsPDF } = window.jspdf;

                const doc = new jsPDF();

                doc.setFontSize(18);
                doc.text('Consulta de CNPJ', 14, 22);
                doc.setFontSize(12);
                doc.text(`CNPJ: ${data.cnpj}`, 14, 32);

                // Adicionando Razão Social e outros detalhes básicos com campos destacados
                doc.setFontSize(14);
                doc.text('Dados da Empresa', 14, 42);
                doc.setFontSize(12);

                // Função para desenhar campos destacados
                function drawField(label, value, yPosition) {
                    const labelOffset = 3;
                    const fieldHeight = 10;
                    const padding = 5;

                    doc.setFontSize(12);
                    doc.text(label, 14, yPosition - labelOffset);
                    doc.setDrawColor(0, 0, 0);
                    doc.rect(14, yPosition, 182, fieldHeight); // Desenha o retângulo
                    doc.text(value, 16, yPosition + fieldHeight - 3);

                    // Adicionar padding para o próximo campo
                    return yPosition + fieldHeight + padding + 3;
                }

                let startY = 52;
                startY = drawField('Razão Social:', data.razao_social || 'Não disponível', startY);
                startY = drawField('Nome Fantasia:', data.nome_fantasia || 'Não disponível', startY);
                startY = drawField('Data de Abertura:', data.data_inicio_atividade || 'Não disponível', startY);
                startY = drawField('Situação Cadastral:', data.descricao_situacao_cadastral || 'Não disponível', startY);
                startY = drawField('Natureza Jurídica:', data.natureza_juridica || 'Não disponível', startY);
                startY = drawField('Porte:', data.porte || 'Não disponível', startY);
                startY = drawField('Endereço:', `${data.logradouro || ''}, ${data.numero || ''}, ${data.bairro || ''}, ${data.municipio || ''}, ${data.uf || ''}, CEP: ${data.cep || ''}`, startY);
                startY = drawField('Telefone:', data.ddd_telefone_1 || 'Não disponível', startY);
                startY = drawField('E-mail:', data.email || 'Não disponível', startY);

                // Adicionando Atividade Principal
                doc.setFontSize(14);
                doc.text('Atividade Principal', 14, startY + 10);
                doc.setFontSize(12);
                const atividadePrincipal = [
                    ['CNAE:', data.cnae_fiscal],
                    ['Descrição:', data.cnae_fiscal_descricao]
                ];
                doc.autoTable({
                    startY: startY + 14,
                    body: atividadePrincipal,
                    theme: 'plain',
                    styles: { fontSize: 12, cellPadding: 2 }
                });

                // Adicionando Atividades Secundárias
                if (data.cnaes_secundarios && data.cnaes_secundarios.length > 0) {
                    doc.setFontSize(14);
                    doc.text('Atividades Secundárias', 14, doc.lastAutoTable.finalY + 10);
                    doc.setFontSize(12);
                    const atividadesSecundarias = data.cnaes_secundarios.map(cnae => [cnae.codigo, cnae.descricao]);
                    doc.autoTable({
                        startY: doc.lastAutoTable.finalY + 14,
                        head: [['Código', 'Descrição']],
                        body: atividadesSecundarias,
                        theme: 'striped',
                        styles: { fontSize: 12, cellPadding: 2 }
                    });
                }

                // Adicionando Quadro de Sócios e Administradores
                if (data.qsa && data.qsa.length > 0) {
                    doc.setFontSize(14);
                    doc.text('Quadro de Sócios e Administradores', 14, doc.lastAutoTable.finalY + 10);
                    doc.setFontSize(12);
                    const qsaData = data.qsa.map(socio => [
                        socio.nome_socio,
                        socio.qualificacao_socio,
                        socio.pais || 'Não disponível',
                        socio.cnpj_cpf_do_socio,
                        socio.data_entrada_sociedade,
                        socio.nome_representante_legal || 'Não disponível',
                        socio.qualificacao_representante_legal || 'Não disponível'
                    ]);
                    doc.autoTable({
                        startY: doc.lastAutoTable.finalY + 14,
                        head: [['Nome', 'Qualificação', 'País', 'CNPJ/CPF', 'Data Entrada', 'Representante Legal', 'Qualificação Representante']],
                        body: qsaData,
                        theme: 'striped',
                        styles: { fontSize: 12, cellPadding: 2 }
                    });
                }

                return doc;
            } else {
                throw new Error('jsPDF não está disponível.');
            }
        } catch (error) {
            console.error('Erro ao consultar e criar PDF:', error);
        }


    }

    static export(data) {
        const doc = CNPJPDF.#buildPDF(data);
        doc.save(`consulta_cnpj_${data.cnpj}.pdf`);
    }

    static async share(data) {
        const doc = CNPJPDF.#buildPDF(data);
        const pdfBlob = doc.output('blob');

        // Create a File object from the Blob
        const file = new File([pdfBlob], `consulta_cnpj_${data.cnpj}.pdf`, { type: "application/pdf" });

        // Check if the Web Share API is supported and can share files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            
            try {
                await navigator.share({
                    title: 'CNPJ - PDF',
                    text: `Confira o PDF do cnpj ${data.cnpj}!`,
                    files: [file]
                });
                console.log('Share was successful.');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            alert('Web Share API is not supported in your browser.');
        }
    }
}
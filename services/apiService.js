/**
 * Serviço para consumir a API da BrasilAPI para consulta de CNPJ.
 */
const apiService = {
    /**
     * Consulta o CNPJ na BrasilAPI.
     * @param {string} cnpj - O CNPJ a ser consultado.
     * @returns {Promise<object>} - Dados da empresa.
     */
    async consultarCNPJ(cnpj) {
        const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro na consulta. Verifique o CNPJ.');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao consultar o CNPJ:', error);
            throw error;
        }
    }
};

export default apiService;

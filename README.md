## **README.md**

### **Projeto: Consulta de CNPJ com BrasilAPI**

**Objetivo:** Desenvolvido como teste para vaga de Desenvolvedor Front-end, este projeto tem como objetivo consumir a API da BrasilAPI para realizar consultas de CNPJ e exibir as informações da empresa de forma clara, organizada e intuitiva.

**Tecnologias Utilizadas:**

* **HTML:** Estrutura da página.
* **CSS:** Estilização da página.
* **JavaScript:** Lógica de consumo da API e manipulação do DOM.
* **(Opcional):** Frameworks CSS como Bootstrap ou Materialize para agilizar o desenvolvimento.

**Instruções de Execução:**

#### **1. Clonar o Repositório:**

```bash
git clone https://github.com/MarceloAlmeidaSouza/brasil-api-cnpj.git
```

#### **2. Instalar Dependências (se houver):**

Caso tenha utilizado algum framework CSS ou outras bibliotecas, siga as instruções específicas de instalação.

#### **3. Executar o Servidor:**

**Opção 1: Utilizando o http-server (Windows e Linux):**

1. **Instalar o http-server globalmente:**

   ```bash
   npm install -g http-server
   ```

2. **Executar o servidor na pasta do projeto:**

   ```bash
   cd consulta-cnpj
   http-server
   ```

   Acesse a aplicação no seu navegador: `http://localhost:8080`

**Opção 2: Utilizando a imagem Docker:**

1. **Puxar a imagem do Docker Hub:**

   ```bash
   docker pull marceloalmeidadesouza/brasil-api-cnpj:latest
   ```

2. **Executar um container:**

   ```bash
   docker run -p 8080:80 marceloalmeidadesouza/brasil-api-cnpj:latest
   ```

   Acesse a aplicação no seu navegador: `http://localhost:8080`

**Opção 3: Testar no Play with Docker:**

1. Acesse o site: [Play with docker](https://labs.play-with-docker.com/)
2. Crie um novo workspace.
3. Puxe a imagem: `docker pull marceloalmeidadesouza/brasil-api-cnpj:latest`
4. Execute o container: `docker run -p 8080:80 marceloalmeidadesouza/brasil-api-cnpj:latest`
5. Clique no container para acessar o terminal e verificar o endereço IP e porta.
6. Acesse a aplicação no seu navegador utilizando o endereço e porta fornecidos.

**Como Utilizar a Aplicação:**

1. Digite o CNPJ no campo de input.
2. Clique no botão de consulta.
3. As informações da empresa serão exibidas na tela, organizadas em cards e campos editáveis.

**Observações:**

* **Responsividade:** A aplicação foi desenvolvida para se adaptar a diferentes tamanhos de tela, proporcionando uma boa experiência ao usuário.
* **Edição de Dados:** Os dados exibidos podem ser editados diretamente na interface. Ao finalizar as edições, clique no botão de salvar.
* **Código:** O código fonte está organizado em arquivos separados para facilitar a manutenção e a leitura.
* **README:** Este arquivo contém informações detalhadas sobre o projeto e as instruções de execução.

**Contribuições:**

Sinta-se à vontade para contribuir com este projeto, reportar bugs ou sugerir melhorias.

**Autor:**

Marcelo Almeida
tinitsapp@gmail.com

**Data:**

29/07/2024

**Agradecimentos:**

Agradeço à BrasilAPI pela disponibilização da API para consulta de CNPJ.

---

**Observações Adicionais:**

* **Docker:** A imagem Docker fornecida contém o projeto pré-configurado, facilitando a execução em diferentes ambientes.
* **Play with Docker:** Uma ótima opção para testar a aplicação rapidamente sem a necessidade de instalar o Docker localmente.
* **README Detalhado:** Este README fornece instruções claras e concisas, facilitando a utilização do projeto por outros desenvolvedores.

**Lembre-se de adaptar este README de acordo com as especificações do seu projeto e as tecnologias utilizadas.**

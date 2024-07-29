# Use a imagem base do Alpine Linux
FROM alpine:3.18

# Instale o servidor busybox-httpd e remova o cache do apk para reduzir a imagem final
RUN apk --no-cache add busybox-extras

# Crie o diretório onde o busybox-httpd espera os arquivos
RUN mkdir -p /var/www/localhost/htdocs

# Copie todos os arquivos da aplicação para o diretório padrão do servidor web
COPY . /var/www/localhost/htdocs/

# Exponha a porta em que o busybox-httpd será executado
EXPOSE 80

# Comando para iniciar o busybox-httpd
CMD ["httpd", "-f", "-p", "80", "-h", "/var/www/localhost/htdocs"]

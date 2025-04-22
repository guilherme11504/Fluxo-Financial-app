# Usar uma imagem base do Python
FROM python:3.11-slim

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependências (requirements.txt) para o container
COPY requirements.txt /app/

# Instalar as dependências do projeto
RUN pip install --no-cache-dir -r requirements.txt

# Copia o script para dentro do container
COPY /wait-for-it.sh /wait-for-it.sh

# Dá permissão de execução
RUN chmod +x /wait-for-it.sh

# Copiar o código do projeto para dentro do container
COPY . /app/

# Expor a porta em que o Django vai rodar
EXPOSE 8000

# Comando para rodar a aplicação Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

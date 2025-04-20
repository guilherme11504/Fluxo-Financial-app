# 💸 Finance App – Controle de Gastos e Organização Financeira

Este é um projeto pessoal e de portfólio que tem como objetivo principal auxiliar no controle financeiro pessoal, permitindo registrar receitas, despesas, metas e acompanhar a saúde financeira com gráficos e relatórios analíticos.

Além da utilidade prática, este projeto serve como um estudo aprofundado em desenvolvimento web com **Django**, aplicação de **boas práticas de arquitetura**, e **conteinerização com Docker**, visando também deploy escalável e profissional.

---

## 🧠 Objetivos do Projeto

- Organizar finanças pessoais de forma intuitiva e visual.
- Aplicar conhecimentos em **Django**, **MySQL**, **HTML/CSS/JS** e boas práticas de desenvolvimento web.
- Aprender a utilizar **Docker** para ambientes de desenvolvimento e produção.
- Criar um projeto realista para portfólio, aplicando **engenharia de software** e **planejamento ágil com GitHub Projects**.

---

## 📦 Funcionalidades (Em desenvolvimento)

- Autenticação (login, registro, logout)
- Dashboard com saldo atual, receitas e despesas
- Lançamento de gastos e ganhos com categorias
- Metas financeiras e alertas
- Relatórios e gráficos analíticos
- Exportação de dados
- Tela de configurações do usuário

---

## 🛠️ Tecnologias Utilizadas

| Categoria     | Tecnologias                          |
|---------------|--------------------------------------|
| Backend       | Django, Python, Django ORM           |
| Frontend      | HTML5, CSS3, JavaScript              |
| Banco de Dados| MySQL                                |
| DevOps        | Docker, Docker Compose, .env         |
| Outros        | Git, GitHub Projects (Kanban + Issues) |

---

## 🧱 Estrutura do Projeto (em reorganização)

finance_app/
├── apps/
│   ├── autenticacao/       - App de autenticação de usuários
│   └── ...                 - Próximos apps como finanças, dashboard etc.
├── templates/
│   └── shared/             - base.html e templates reutilizáveis
├── static/
│   ├── css/
│   └── js/
├── core/                   - Configurações globais
├── manage.py
├── Dockerfile
├── docker-compose.yml
├── .env
├── requirements.txt
└── README.md

##📈 Planejamento e Organização
Este projeto segue uma organização baseada em Issues e Kanban no GitHub Projects, com as colunas:

- Backlog

- Ready

- In Progress

- In Review

- Done

Você pode acompanhar o progresso diretamente aqui no GitHub Projects.

##🚀 Como executar localmente

# Clonar o repositório
git clone https://github.com/seu-usuario/finance-app.git
cd finance-app

# Subir o projeto com Docker
docker-compose up --build

# Acessar no navegador
http://localhost:8000
📌 Autor
Desenvolvido por Guilherme Duarte
Formado em Análise e Desenvolvimento de sistemas pela Estácio
Especialista em E-commerce e apaixonado por tecnologia 👨‍💻

# Sistema de Controle de Escritório de Advocacia - Tavares & Nunes Advocacia

Projeto acadêmico da disciplina de Sistemas de Informação - UNIFACISA. O sistema permite consultar clientes, cadastrar clientes, cadastrar um processo vinculado a um cliente e registrar o prazo inicial relacionado ao processo.

## Tecnologias

- Java 25
- Spring Boot 3
- Spring Web e Spring Data JPA
- H2 em memória para desenvolvimento e demonstração
- Maven
- HTML, CSS e JavaScript
- Bootstrap 5 e Font Awesome

## Fluxo principal demonstrável (Semana 2)

1. Entrar no sistema com um usuário de demonstração.
2. Abrir **Novo Processo**.
3. Pesquisar um cliente pelo CPF/CNPJ.
4. Se o cliente não existir, cadastrá-lo e vinculá-lo ao processo.
5. Preencher os dados do processo e o prazo inicial.
6. Salvar e conferir no Dashboard os dados consultados da API.

## Como executar

### 1. Iniciar o back-end

É necessário ter Java 17 ou superior e Maven instalados. No terminal, entre na pasta `backend` e execute:

```bash
mvn spring-boot:run
```

A API ficará disponível em `http://localhost:8080/api`.

### 2. Abrir o front-end

Abra `frontend/index.html` no navegador. Se houver restrições do navegador ao abrir arquivos locais, utilize a extensão Live Server do VS Code.

### 3. Usuário de demonstração

- E-mail: `heitor@tavaresnunes.com`
- Senha: `123456`

Também há o usuário `amanda@tavaresnunes.com`, com a mesma senha.

## Endpoints principais

- `POST /api/login` — autenticação de demonstração
- `GET /api/clientes` — listar clientes
- `GET /api/clientes/buscar?cpfCnpj=...` — buscar cliente
- `POST /api/clientes` — cadastrar cliente
- `GET /api/processos` — listar processos, com filtro opcional por unidade
- `POST /api/processos` — cadastrar processo
- `GET /api/prazos` — listar prazos, com filtro opcional por unidade
- `POST /api/prazos` — cadastrar prazo

## Observações

- O banco H2 está configurado em memória: os dados de demonstração são recriados quando o back-end é reiniciado.
- Os dados iniciais servem apenas para demonstração acadêmica, não representam clientes ou processos reais.
- A autenticação é simplificada para o MVP acadêmico e ainda não substitui uma solução de segurança pronta para produção.

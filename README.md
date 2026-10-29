# Sistema de Controle de Escritório de Advocacia - Tavares & Nunes Advocacia (Fase 2)

Projeto desenvolvido para a disciplina de Sistemas de Informação - UNIFACISA.
Centralização e gerenciamento de processos, clientes, prazos e documentos das unidades de Campina Grande e João Pessoa.

## 🚀 Tecnologias Utilizadas

### Back-end
- Java 25
- Spring Boot 3
- Spring Data JPA
- Banco de Dados H2 (Memória / Dev)
- Lombok
- Maven Wrapper (`.mvn`)

### Front-end
- HTML5 / CSS3 (CSS Grid & Flexbox)
- JavaScript ES6+ (Fetch API, SPA Router simples)
- Bootstrap 5 / FontAwesome Icons
- Design responsivo baseado no protótipo [Figma](https://funky-marvel-71657370.figma.site)

---

## 📂 Estrutura da Aplicação

```
escritorio-advocacia-fase2/
├── backend/
│   ├── src/main/java/com/tavaresnunes/escritorio/
│   │   ├── config/          # CORS, Seed de Dados
│   │   ├── controller/      # Endpoints REST (Advogado, Cliente, Processo, Prazo)
│   │   ├── model/           # Entidades JPA & Enums
│   │   ├── repository/      # Spring Data JPA Interfaces
│   │   └── service/         # Regras de Negócio
│   └── src/main/resources/
│       └── application.properties
└── frontend/                # SPA Front-end (HTML/CSS/JS)
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

---

## 🏃‍♂️ Como Executar o Projeto

### 1. Executando o Back-end (Spring Boot)
Navegue até a pasta `backend` e execute:
```bash
./mvnw spring-boot:run
```
A API estará acessível em: `http://localhost:8080/api`
Console do Banco H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:escritoriodb`, usuário: `sa`, senha: *em branco*)

### 2. Executando o Front-end
Abra o arquivo `frontend/index.html` diretamente no navegador ou utilize a extensão **Live Server** no VS Code.

# 🧪 Cypress Masterclass - Swag Labs

Projeto completo de **automação de testes E2E (End-to-End)** utilizando **Cypress** sobre a aplicação [Swag Labs](https://www.saucedemo.com/).  
O objetivo deste repositório é demonstrar práticas profissionais de QA Engineer, cobrindo testes funcionais, de regressão, usabilidade e acessibilidade de forma estruturada, organizada e escalável.

---

## 📌 Objetivos do Projeto

- Demonstrar **habilidade prática em automação de testes** com Cypress.  
- Criar uma suíte de testes robusta que cobre as principais funcionalidades da aplicação **Swag Labs**.  
- Aplicar **boas práticas de QA** como:
  - Organização de código em **helpers** e **page objects**.
  - Escrita de testes limpos, legíveis e reutilizáveis.
  - Uso de **assertivas claras** e verificações de comportamento.
- Fornecer um **portfólio sólido** para demonstrar experiência profissional em QA Automation.

---

## 🛠️ Tecnologias Utilizadas

- [Cypress](https://www.cypress.io/) - Framework principal de testes E2E.  
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Linguagem base dos testes.  
- [Node.js](https://nodejs.org/) - Ambiente de execução.  
- [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/) - Estrutura de testes e assertions (nativos no Cypress).  

---

## 📂 Estrutura do Projeto
```bash
/
cypress/
├── e2e/
│ ├── login.spec.js # Testes de login
│ ├── inventory.spec.js # Testes da página de produtos (Lab Swag)
│ ├── cart.spec.js # Testes do carrinho de compras
│ ├── menu.spec.js # Testes do menu lateral (Sanduíche)
│ └── checkout.spec.js # Testes de fluxo de checkout
│
├── fixtures/ # Massa de dados (usuários, mocks, etc.)
├── support/
│ ├── commands.js # Comandos customizados
│ ├── e2e.js # Configuração global
│ └── helpers.js # Funções auxiliares reutilizáveis
└── screenshots/ # Evidências geradas automaticamente

## ✅ Funcionalidades Testadas

- **Login**:
  - Sucesso com credenciais válidas.
  - Erros com credenciais inválidas ou bloqueadas.
- **Inventory (Lab Swag)**:
  - Listagem correta de produtos.
  - Validação de nome, descrição, preço e imagem.
  - Ordenação de produtos.
- **Carrinho de Compras**:
  - Adição e remoção de itens.
  - Atualização do badge de contagem.
  - Navegação para detalhes do produto.
- **Menu Lateral (Sanduíche)**:
  - Navegação entre páginas.
  - Reset de estado da aplicação.
  - Logout seguro.
- **Checkout**:
  - Preenchimento de formulário.
  - Fluxo completo de compra.
  - Mensagem de sucesso ao finalizar.

---

## ▶️ Como Executar os Testes

### 1. Pré-requisitos
- Node.js (>= 16.x)  
- npm ou yarn instalado

### 2. Clonar o repositório
```bash
git clone git@github.com:SEU_USUARIO/cypress-masterclass-swaglabs.git
cd cypress-masterclass-swaglabs

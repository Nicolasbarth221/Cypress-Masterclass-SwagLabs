describe('Página de Login - Swag Labs', () => {
  const URL = 'https://www.saucedemo.com/';
  const password = 'secret_sauce';

  const users = {
    standard: 'standard_user',
    locked: 'locked_out_user',
    problem: 'problem_user',
    glitch: 'performance_glitch_user',
    visual: 'visual_user',
    error: 'error_user',
    invalid: 'usuario_invalido',
  };

  beforeEach(() => {
    cy.visit(URL);
  });

  it('Login com usuário padrão', () => {
    cy.get('[data-test="username"]').type(users.standard);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });

  const validUsers = [users.standard, users.problem, users.glitch, users.visual, users.error];

  validUsers.forEach((user) => {
    it(`Login com usuário válido: ${user}`, () => {
      cy.get('[data-test="username"]').type(user);
      cy.get('[data-test="password"]').type(password);
      cy.get('[data-test="login-button"]').click();
      cy.url().should('include', '/inventory.html');
      cy.visit(URL);
    });
  });

  it('Login com usuário bloqueado (locked_out_user)', () => {
    cy.get('[data-test="username"]').type(users.locked);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('contain', 'locked out');
  });

  it('Login com usuário inválido', () => {
    cy.get('[data-test="username"]').type(users.invalid);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Login com senha inválida', () => {
    cy.get('[data-test="username"]').type(users.standard);
    cy.get('[data-test="password"]').type('wrong_password');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Login com campos vazios', () => {
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Somente usuário preenchido', () => {
    cy.get('[data-test="username"]').type(users.standard);
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Somente senha preenchida', () => {
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Login com espaços em branco não deve funcionar', () => {
    cy.get('[data-test="username"]').type(` ${users.standard} `);
    cy.get('[data-test="password"]').type(` ${password} `);
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Login usando tecla Enter', () => {
    cy.get('[data-test="username"]').type(users.standard);
    cy.get('[data-test="password"]').type(`${password}{enter}`);
    cy.url().should('include', '/inventory.html');
  });

  it('Verifica placeholders corretos', () => {
    cy.get('[data-test="username"]').should('have.attr', 'placeholder', 'Username');
    cy.get('[data-test="password"]').should('have.attr', 'placeholder', 'Password');
  });

  it('Botão de login visível e habilitado', () => {
    cy.get('[data-test="login-button"]').should('be.visible').and('be.enabled');
  });

  it('Campo de senha esconde os caracteres', () => {
    cy.get('[data-test="password"]').should('have.attr', 'type', 'password');
  });

  it('Campo de username aceita foco', () => {
    cy.get('[data-test="username"]').focus().should('have.focus');
  });

  it('Tab navega entre os campos corretamente', () => {
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-test', 'username');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-test', 'password');
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-test', 'login-button');
  });

  it('Mensagem de erro permanece após digitar novamente', () => {
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
    cy.get('[data-test="username"]').type('a');
    cy.get('[data-test="error"]').should('exist');
  });

  it('Acesso direto à página inventário sem login não deve ser possível', () => {
    cy.visit(URL + 'inventory.html', { failOnStatusCode: false });
    cy.url().should('eq', URL);
  });

  it('Simula múltiplas tentativas de login com falha', () => {
    for (let i = 0; i < 3; i++) {
      cy.get('[data-test="username"]').clear().type('usuario_errado');
      cy.get('[data-test="password"]').clear().type('senha_errada');
      cy.get('[data-test="login-button"]').click();
      cy.get('[data-test="error"]').should('exist');
    }
  });
});

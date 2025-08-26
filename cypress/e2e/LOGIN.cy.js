describe('Página de Login - Swag Labs', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
  });

  it('Login com usuário padrão', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });

  it('Login com usuário válido: standard_user', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    cy.visit('https://www.saucedemo.com/');
  });

  it('Login com usuário válido: problem_user', () => {
    cy.get('[data-test="username"]').type('problem_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    cy.visit('https://www.saucedemo.com/');
  });

  it('Login com usuário válido: performance_glitch_user', () => {
    cy.get('[data-test="username"]').type('performance_glitch_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    cy.visit('https://www.saucedemo.com/');
  });

  it('Login com usuário válido: visual_user', () => {
    cy.get('[data-test="username"]').type('visual_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    cy.visit('https://www.saucedemo.com/');
  });

  it('Login com usuário válido: error_user', () => {
    cy.get('[data-test="username"]').type('error_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
    cy.visit('https://www.saucedemo.com/');
  });

  it('Login com usuário bloqueado (locked_out_user)', () => {
    cy.get('[data-test="username"]').type('locked_out_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('contain', 'locked out');
  });

  it('Login com usuário inválido', () => {
    cy.get('[data-test="username"]').type('usuario_invalido');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Login com senha inválida', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('wrong_password');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Login com campos vazios', () => {
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Somente usuário preenchido', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Somente senha preenchida', () => {
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Login com espaços em branco não deve funcionar', () => {
    cy.get('[data-test="username"]').type(' standard_user ');
    cy.get('[data-test="password"]').type(' secret_sauce ');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });

  it('Login usando tecla Enter', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce{enter}');
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
    cy.get('[data-test="username"]').focus();
    cy.focused().should('have.attr', 'data-test', 'username');

    cy.get('[data-test="password"]').focus();
    cy.focused().should('have.attr', 'data-test', 'password');

    cy.get('[data-test="login-button"]').focus();
    cy.focused().should('have.attr', 'data-test', 'login-button');
  });

  it('Mensagem de erro permanece após digitar novamente', () => {
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
    cy.get('[data-test="username"]').type('a');
    cy.get('[data-test="error"]').should('exist');
  });

  it('Acesso direto à página inventário sem login não deve ser possível', () => {
    cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false });
    cy.url().should('not.include', '/inventory.html');
  });

  it('Simula múltiplas tentativas de login com falha', () => {
    cy.get('[data-test="username"]').clear().type('usuario_errado');
    cy.get('[data-test="password"]').clear().type('senha_errada');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');

    cy.get('[data-test="username"]').clear().type('usuario_errado');
    cy.get('[data-test="password"]').clear().type('senha_errada');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');

    cy.get('[data-test="username"]').clear().type('usuario_errado');
    cy.get('[data-test="password"]').clear().type('senha_errada');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('exist');
  });
});

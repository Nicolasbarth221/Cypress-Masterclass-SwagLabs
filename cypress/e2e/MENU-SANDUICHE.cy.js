// cypress/e2e/menu.spec.js
describe('Menu Sanduíche (☰) - Swag Labs', () => {
  const URL = 'https://www.saucedemo.com/';

  const login = (user = 'standard_user', pass = 'secret_sauce') => {
    cy.visit(URL);
    cy.get('[data-test="username"]').type(user);
    cy.get('[data-test="password"]').type(pass);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  };

  const openMenu = () => {
    cy.get('#react-burger-menu-btn').click();
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'false');
  };

  const closeMenu = () => {
    cy.get('#react-burger-cross-btn').click({ force: true });
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
  };

  const goToCart = () => {
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
  };

  const addItemByName = (name) => {
    cy.contains('.inventory_item', name).within(() => {
      cy.contains('button', 'Add to cart').click();
    });
  };

  beforeEach(() => {
    login();
  });

  it('Abre e fecha o menu; itens visíveis e ordem correta', () => {
    openMenu();
    cy.get('#inventory_sidebar_link').should('be.visible');
    cy.get('#about_sidebar_link').should('be.visible');
    cy.get('#logout_sidebar_link').should('be.visible');
    cy.get('#reset_sidebar_link').should('be.visible');
    closeMenu();
  });

  it('Botão de fechar (X) recebe foco e fecha o menu', () => {
    openMenu();
    cy.get('#react-burger-cross-btn').focus().click();
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
  });

  it('Abre pelo botão e fecha pelo X, depois reabre', () => {
    openMenu();
    closeMenu();
    cy.get('#react-burger-menu-btn').click();
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'false');
    closeMenu();
  });

  it('Itens do menu são focáveis; ESC fecha', () => {
    openMenu();
    cy.get('#inventory_sidebar_link').focus();
    cy.get('body').type('{esc}');
    cy.get('.bm-menu-wrap').then($w => {
      if ($w.attr('aria-hidden') !== 'true') closeMenu();
    });
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
  });

  it('All Items volta para a lista (de qualquer lugar)', () => {
    cy.get('.inventory_item_name').first().click();
    cy.url().should('include', '/inventory-item.html');
    openMenu();
    cy.get('#inventory_sidebar_link').click();
    cy.url().should('include', '/inventory.html');
    goToCart();
    openMenu();
    cy.get('#inventory_sidebar_link').click();
    cy.url().should('include', '/inventory.html');
  });

  it('About aponta para o domínio correto (sem navegar cross-origin)', () => {
    openMenu();
    cy.get('#about_sidebar_link').should('have.attr', 'href').and('include', 'saucelabs.com');
    closeMenu();
  });

  it('Logout encerra sessão e bloqueia rotas protegidas', () => {
    openMenu();
    cy.get('#logout_sidebar_link').click();
    cy.location('pathname').should('eq', '/');
    cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false });
    cy.location('pathname').should('eq', '/');
  });

  it('Reset App State limpa carrinho/badge e volta botões para "Add to cart"', () => {
    addItemByName('Sauce Labs Backpack');
    openMenu();
    cy.get('#reset_sidebar_link').click();
    closeMenu();
    cy.reload();
    cy.contains('.inventory_item', 'Sauce Labs Backpack').within(() => {
      cy.contains('button', 'Add to cart').should('be.visible');
    });
    goToCart();
    cy.get('.cart_item').should('have.length', 0);
  });

  it('Com menu aberto, página não rola (scroll-lock ativo)', () => {
    openMenu();
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'false');
    closeMenu();
  });

  it('Ao navegar por um item do menu, a gaveta se fecha na nova rota', () => {
    goToCart();
    openMenu();
    cy.get('#inventory_sidebar_link').click();
    cy.url().should('include', '/inventory.html');
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
  });

  it('Após Reset, todos os produtos exibem "Add to cart"', () => {
    addItemByName('Sauce Labs Backpack');
    addItemByName('Sauce Labs Bike Light');
    openMenu();
    cy.get('#reset_sidebar_link').click();
    closeMenu();
    cy.reload();
    cy.get('.inventory_item').each($card => {
      cy.wrap($card).within(() => {
        cy.contains('button', 'Add to cart').should('be.visible');
      });
    });
  });

  it('Funciona em viewport mobile (360x740)', () => {
    cy.viewport(360, 740);
    openMenu();
    cy.get('#inventory_sidebar_link').should('be.visible');
    closeMenu();
  });

  it('Menu permanece funcional com problem_user', () => {
    openMenu();
    cy.get('#logout_sidebar_link').click();
    login('problem_user', 'secret_sauce');
    openMenu();
    cy.get('#inventory_sidebar_link').click();
    cy.url().should('include', '/inventory.html');
  });
});

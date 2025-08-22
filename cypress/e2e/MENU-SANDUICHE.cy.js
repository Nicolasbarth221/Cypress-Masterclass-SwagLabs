// cypress/e2e/menu.spec.js
describe('Menu Sanduíche (☰) - Swag Labs', () => {
  const URL = 'https://www.saucedemo.com/';

  const login = (user = 'standard_user', pass = 'secret_sauce') => {
    cy.visit(URL);
    cy.get('[data-test="username"]').clear().type(user);
    cy.get('[data-test="password"]').clear().type(pass);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  };

  const addItemByName = (name) => {
    cy.contains('.inventory_item', name).within(() => {
      cy.contains('button', /^Add to cart$/).click();
      cy.contains('button', /^Remove$/).should('be.visible');
    });
  };

  const badgeShouldBe = (n) => {
    if (n === 0) {
      cy.get('body').then(($b) => {
        if ($b.find('.shopping_cart_badge').length > 0) {
          cy.get('.shopping_cart_badge').should('not.exist');
        }
      });
    } else {
      cy.get('.shopping_cart_badge').should('have.text', String(n));
    }
  };

  const goToCart = () => {
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
  };

  const openMenu = () => {
    cy.get('#react-burger-menu-btn').click();
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'false');
    cy.get('#inventory_sidebar_link').should('be.visible');
    cy.get('#about_sidebar_link').should('be.visible');
    cy.get('#logout_sidebar_link').should('be.visible');
    cy.get('#reset_sidebar_link').should('be.visible');
  };

  const closeMenu = () => {
    cy.get('#react-burger-cross-btn').click({ force: true });
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
  };

  beforeEach(() => {
    login();
  });

  it('Abre e fecha o menu; itens visíveis e ordem correta', () => {
    openMenu();
    cy.get('.bm-item-list a').then(($links) => {
      const labels = [...$links].map((a) => a.textContent.trim());
      expect(labels).to.deep.equal(['All Items', 'About', 'Logout', 'Reset App State']);
    });
    closeMenu();
  });

  it('Botão de fechar (X) recebe foco e fecha o menu', () => {
    openMenu();
    cy.get('#react-burger-cross-btn').focus().should('be.focused').click();
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
  });

  it('Botão do menu pode ser clicado múltiplas vezes (toggle estável)', () => {
    openMenu();
    cy.get('#react-burger-menu-btn').click({ force: true });
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
    cy.get('#react-burger-menu-btn').click({ force: true });
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'false');
    closeMenu();
  });

  it('Itens do menu são focáveis; ESC fecha (fallback para clique se não suportar)', () => {
    openMenu();
    cy.get('#inventory_sidebar_link').focus().should('be.focused');
    cy.get('body').type('{esc}');
    cy.get('.bm-menu-wrap').then(($wrap) => {
      const isOpen = $wrap.attr('aria-hidden') === 'false';
      if (isOpen) closeMenu();
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
    cy.get('#about_sidebar_link')
      .should('have.attr', 'href')
      .then((href) => {
        expect(href).to.match(/^https?:\/\/([a-z0-9-]+\.)*saucelabs\.com/i);
        cy.request({ url: href, followRedirect: true })
          .its('status')
          .should((s) => expect(s).to.be.within(200, 399));
      });
    closeMenu();
  });

  it('Logout encerra sessão e bloqueia rotas protegidas', () => {
    openMenu();
    cy.get('#logout_sidebar_link').click();
    cy.location('pathname').should('eq', '/');
    cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false });
    cy.location('pathname').should('eq', '/');
    cy.visit('https://www.saucedemo.com/cart.html', { failOnStatusCode: false });
    cy.location('pathname').should('eq', '/');
  });

  it('Reset App State limpa carrinho/badge e volta botões para "Add to cart"', () => {
    const item = 'Sauce Labs Backpack';
    addItemByName(item);
    badgeShouldBe(1);
    openMenu();
    cy.get('#reset_sidebar_link').click();
    cy.window().then((win) => {
      const raw = win.localStorage.getItem('cart-contents') || '[]';
      expect(JSON.parse(raw)).to.have.length(0);
    });
    closeMenu();
    cy.reload();
    cy.contains('.inventory_item', item).within(() => {
      cy.contains('button', /^Add to cart$/).should('be.visible');
    });
    goToCart();
    cy.get('.cart_item').should('have.length', 0);
    badgeShouldBe(0);
  });

  it('Com menu aberto, página não rola (scroll-lock ativo)', () => {
    cy.window().then((win) => win.scrollTo(0, 500));
    cy.window().its('scrollY').then((before) => {
      openMenu();
      cy.window().then((win) => win.scrollTo(0, 2000));
      cy.window().its('scrollY').should('eq', before);
      closeMenu();
    });
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
    badgeShouldBe(2);
    openMenu();
    cy.get('#reset_sidebar_link').click();
    closeMenu();
    cy.reload();
    cy.get('.inventory_item').each(($card) => {
      cy.wrap($card).within(() => {
        cy.contains('button', /^Add to cart$/).should('be.visible');
      });
    });
    badgeShouldBe(0);
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

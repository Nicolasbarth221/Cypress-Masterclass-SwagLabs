describe('Inventory - Swag Labs', () => {
  const URL = 'https://www.saucedemo.com/';

  const login = (user = 'standard_user', pass = 'secret_sauce') => {
    cy.visit(URL);
    cy.get('[data-test="username"]').clear().type(user);
    cy.get('[data-test="password"]').clear().type(pass);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  };

  const selectSort = (label) => {
    cy.get('[data-test="product-sort-container"]').select(label);
  };

  const parsePrice = (txt) => Number(txt.replace('$', '').trim());

  beforeEach(() => {
    login();
  });

  it('Carrega /inventory e exibe o título', () => {
    cy.get('.title').should('have.text', 'Products');
  });

  it('Renderiza 6 produtos no catálogo', () => {
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Cada card tem nome, descrição, preço, imagem e botão', () => {
    cy.get('.inventory_item').each(($card) => {
      cy.wrap($card).find('.inventory_item_name').should('be.visible');
      cy.wrap($card).find('.inventory_item_desc').should('be.visible');
      cy.wrap($card).find('.inventory_item_price').should('be.visible');
      cy.wrap($card).find('img').should('be.visible');
      cy.wrap($card).find('button').invoke('text')
        .should('match', /Add to cart|Remove/);
    });
  });

  it('Abre a página de detalhes ao clicar no nome', () => {
    cy.get('.inventory_item_name').first().click();
    cy.url().should('include', '/inventory-item.html');
    cy.get('.inventory_details_name').should('be.visible');
  });

  it('O botão alterna entre "Add to cart" e "Remove"', () => {
    cy.get('.inventory_item').first().within(() => {
      cy.get('button').should('contain.text', 'Add to cart');
      cy.get('button').click();
      cy.get('button').should('contain.text', 'Remove');
      cy.get('button').click();
      cy.get('button').should('contain.text', 'Add to cart');
    });
  });

  it('Nome e preço batem entre lista e detalhe', () => {
    let nome, preco;

    cy.get('.inventory_item').first().within(() => {
      cy.get('.inventory_item_name')
        .invoke('text')
        .then(t => { nome = t.trim(); });

      cy.get('.inventory_item_price')
        .invoke('text')
        .then(t => { preco = t.trim(); });

      cy.get('.inventory_item_name').click();
    });

    cy.then(() => {
      cy.get('.inventory_details_name')
        .invoke('text')
        .should('eq', nome);

      cy.get('.inventory_details_price')
        .invoke('text')
        .should('eq', preco);
    });
  });

  const filters = [
    {
      label: 'Name (A to Z)',
      validate: () => {
        cy.get('.inventory_item_name').then(($els) => {
          const names = [...$els].map((e) => e.innerText);
          const sorted = [...names].sort();
          expect(names).to.deep.equal(sorted);
        });
      },
    },
    {
      label: 'Name (Z to A)',
      validate: () => {
        cy.get('.inventory_item_name').then(($els) => {
          const names = [...$els].map((e) => e.innerText);
          const sorted = [...names].sort().reverse();
          expect(names).to.deep.equal(sorted);
        });
      },
    },
    {
      label: 'Price (low to high)',
      validate: () => {
        cy.get('.inventory_item_price').then(($els) => {
          const prices = [...$els].map((e) => parsePrice(e.innerText));
          const sorted = [...prices].sort((a, b) => a - b);
          expect(prices).to.deep.equal(sorted);
        });
      },
    },
    {
      label: 'Price (high to low)',
      validate: () => {
        cy.get('.inventory_item_price').then(($els) => {
          const prices = [...$els].map((e) => parsePrice(e.innerText));
          const sorted = [...prices].sort((a, b) => b - a);
          expect(prices).to.deep.equal(sorted);
        });
      },
    },
  ];

  filters.forEach((f) => {
    it(`Filtro "${f.label}" ordena corretamente`, () => {
      selectSort(f.label);
      f.validate();
    });
  });

  it('Todas as imagens têm atributo alt', () => {
    cy.get('.inventory_item img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('Layout básico visível em viewport mobile', () => {
    cy.viewport('iphone-6');
    cy.get('.inventory_item').should('have.length', 6);
    cy.get('.inventory_item_name').each(($el) => cy.wrap($el).should('be.visible'));
  });

  it('Usuário problem_user ainda carrega a lista (sanity)', () => {
    login('problem_user');
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Usuário visual_user carrega a lista (sanity)', () => {
    login('visual_user');
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Inventory entra em < 3s (estimativa cliente)', () => {
    const start = Date.now();
    login();
    cy.url().should('include', '/inventory.html').then(() => {
      const elapsed = Date.now() - start;
      cy.log(`⏱️ ~${elapsed} ms`);
      expect(elapsed).to.be.lessThan(3000);
    });
  });

  it('Permanece funcional após recarregar', () => {
    cy.reload();
    cy.get('.title').should('have.text', 'Products');
    cy.get('.inventory_item').should('have.length', 6);
  });
});

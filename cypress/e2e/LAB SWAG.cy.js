describe('Inventory - Swag Labs', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
  });

  it('Carrega /inventory e exibe o título', () => {
    cy.get('.title').should('have.text', 'Products');
  });

  it('Renderiza 6 produtos no catálogo', () => {
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Cada card tem nome, descrição, preço, imagem e botão', () => {
    cy.get('.inventory_item_name').should('have.length', 6);
    cy.get('.inventory_item_desc').should('have.length', 6);
    cy.get('.inventory_item_price').should('have.length', 6);
    cy.get('.inventory_item img').should('have.length', 6);
    cy.get('.inventory_item button').should('have.length', 6);
  });

  it('Abre a página de detalhes ao clicar no nome', () => {
    cy.get('.inventory_item_name').first().click();
    cy.url().should('include', '/inventory-item.html');
  });

  it('O botão alterna entre Add to cart e Remove', () => {
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.inventory_item').first().find('button').should('contain.text', 'Remove');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.inventory_item').first().find('button').should('contain.text', 'Add to cart');
  });

  it('Nome e preço batem entre lista e detalhe', () => {
    cy.get('.inventory_item').first().find('.inventory_item_name').then(($nome) => {
      const nome = $nome.text();
      cy.get('.inventory_item').first().find('.inventory_item_price').then(($preco) => {
        const preco = $preco.text();
        cy.get('.inventory_item_name').first().click();
        cy.get('.inventory_details_name').should('have.text', nome);
        cy.get('.inventory_details_price').should('have.text', preco);
      });
    });
  });

  it('Filtro "Name (A to Z)" ordena corretamente', () => {
    cy.get('[data-test="product-sort-container"]').select('Name (A to Z)');
  });

  it('Filtro "Name (Z to A)" ordena corretamente', () => {
    cy.get('[data-test="product-sort-container"]').select('Name (Z to A)');
  });

  it('Filtro "Price (low to high)" ordena corretamente', () => {
    cy.get('[data-test="product-sort-container"]').select('Price (low to high)');
  });

  it('Filtro "Price (high to low)" ordena corretamente', () => {
    cy.get('[data-test="product-sort-container"]').select('Price (high to low)');
  });

  it('Todas as imagens têm atributo alt', () => {
    cy.get('.inventory_item img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('Layout visível em viewport mobile', () => {
    cy.viewport('iphone-6');
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Usuário problem_user ainda carrega a lista', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('problem_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Usuário visual_user carrega a lista', () => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('visual_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Inventory entra em menos de 3s', () => {
    const start = Date.now();
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html').then(() => {
      const tempo = Date.now() - start;
      expect(tempo).to.be.lessThan(3000);
    });
  });

  it('Permanece funcional após recarregar', () => {
    cy.reload();
    cy.get('.title').should('have.text', 'Products');
    cy.get('.inventory_item').should('have.length', 6);
  });
});

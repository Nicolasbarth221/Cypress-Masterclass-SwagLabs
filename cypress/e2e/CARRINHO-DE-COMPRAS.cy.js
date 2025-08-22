describe('Carrinho de Compras - Swag Labs', () => {
  const URL = 'https://www.saucedemo.com/';

  const login = (user = 'standard_user', pass = 'secret_sauce') => {
    cy.visit(URL);
    cy.get('[data-test="username"]').clear().type(user);
    cy.get('[data-test="password"]').clear().type(pass);
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  };

  const goToCart = () => {
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
  };

  const addItemByName = (name) => {
    cy.contains('.inventory_item', name).within(() => {
      cy.contains('button', /^Add to cart$/).click();
      cy.contains('button', /^Remove$/).should('be.visible');
    });
  };

  const removeItemByNameFromInventory = (name) => {
    cy.contains('.inventory_item', name).within(() => {
      cy.contains('button', /^Remove$/).click();
      cy.contains('button', /^Add to cart$/).should('be.visible');
    });
  };

  const removeItemByNameFromCart = (name) => {
    cy.contains('.cart_item', name).within(() => {
      cy.contains('button', 'Remove').click();
    });
    cy.contains('.cart_item', name).should('not.exist');
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

  const continueShopping = () => {
    cy.get('[data-test="continue-shopping"]').click();
    cy.url().should('include', '/inventory.html');
  };

  const openMenu = () => {
    cy.get('body').then(($b) => {
      const isOpen = $b.find('.bm-menu-wrap[aria-hidden="false"]').length > 0;
      if (!isOpen) {
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'false');
      }
    });
  };

  const closeMenu = () => {
    cy.get('#react-burger-cross-btn').click({ force: true });
    cy.get('.bm-menu-wrap').should('have.attr', 'aria-hidden', 'true');
  };

  beforeEach(() => {
    login();
  });

  it('Carrinho inicia vazio e sem badge', () => {
    goToCart();
    cy.get('.cart_item').should('have.length', 0);
    badgeShouldBe(0);
  });

  it('Adicionar 1 item mostra QTY=1 no carrinho e badge=1', () => {
    const item = 'Sauce Labs Backpack';
    addItemByName(item);
    badgeShouldBe(1);

    goToCart();
    cy.get('.cart_item').should('have.length', 1);
    cy.contains('.cart_item', item).within(() => {
      cy.get('.cart_quantity').should('have.text', '1');
      cy.get('.inventory_item_name').should('have.text', item);
      cy.get('.inventory_item_price')
        .invoke('text')
        .should((txt) => {
          expect(txt.trim()).to.match(/^\$\d/);
        });
      cy.contains('button', 'Remove').should('be.visible');
    });
  });

  it('Remover item pelo carrinho zera o badge e esvazia a lista', () => {
    const item = 'Sauce Labs Bike Light';
    addItemByName(item);
    badgeShouldBe(1);

    goToCart();
    removeItemByNameFromCart(item);
    cy.get('.cart_item').should('have.length', 0);
    badgeShouldBe(0);

    continueShopping();
    cy.contains('.inventory_item', item)
      .contains('button', 'Add to cart')
      .should('be.visible');
  });

  it('Adicionar 2 itens diferentes e validar ambos no carrinho', () => {
    const a = 'Sauce Labs Bolt T-Shirt';
    const b = 'Sauce Labs Fleece Jacket';

    addItemByName(a);
    addItemByName(b);
    badgeShouldBe(2);

    goToCart();
    cy.get('.cart_item').should('have.length', 2);
    cy.contains('.cart_item', a).should('be.visible');
    cy.contains('.cart_item', b).should('be.visible');
  });

  it('Remover pelo inventário reflete no carrinho', () => {
    const item = 'Sauce Labs Onesie';
    addItemByName(item);
    badgeShouldBe(1);

    removeItemByNameFromInventory(item);
    badgeShouldBe(0);

    goToCart();
    cy.get('.cart_item').should('have.length', 0);
  });

  it('Mesmo item não duplica (toggle Add/Remove)', () => {
    const item = 'Sauce Labs Backpack';
    addItemByName(item);
    badgeShouldBe(1);

    removeItemByNameFromInventory(item);
    badgeShouldBe(0);
  });

  it('Botão "Continue Shopping" retorna para a lista', () => {
    goToCart();
    continueShopping();
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Link do nome no carrinho abre a página de detalhes', () => {
    const item = 'Sauce Labs Backpack';
    addItemByName(item);
    goToCart();

    cy.contains('.cart_item', item).find('.inventory_item_name').click();
    cy.url().should('include', '/inventory-item.html');
    cy.get('.inventory_details_name').should('have.text', item);
  });

  it('Remover no carrinho e usar Voltar não restaura item', () => {
    const item = 'Sauce Labs Bolt T-Shirt';
    addItemByName(item);
    goToCart();

    cy.contains('.cart_item', item).contains('button', 'Remove').click();
    cy.go('back');

    cy.contains('.inventory_item', item)
      .contains('button', 'Add to cart')
      .should('be.visible');
    badgeShouldBe(0);
  });

  it('Checkout navega para o passo 1 quando há itens', () => {
    addItemByName('Sauce Labs Bike Light');
    goToCart();

    cy.get('[data-test="checkout"]').click();
    cy.url().should('include', '/checkout-step-one.html');
    cy.get('.title').should('contain.text', 'Checkout: Your Information');
  });

  it('Checkout navega mesmo com carrinho vazio (comportamento atual)', () => {
    goToCart();
    cy.get('.cart_item').should('have.length', 0);
    cy.get('[data-test="checkout"]').click();
    cy.url().should('include', '/checkout-step-one.html');
  });

  it('Carrinho persiste após recarregar (inventory → cart)', () => {
    const item = 'Sauce Labs Fleece Jacket';
    addItemByName(item);
    badgeShouldBe(1);

    goToCart();
    cy.reload();
    cy.contains('.cart_item', item).should('be.visible');
    badgeShouldBe(1);
  });

  it('Persistência ao recarregar em inventory e cart', () => {
    const item = 'Sauce Labs Fleece Jacket';
    addItemByName(item);
    badgeShouldBe(1);

    cy.reload();
    badgeShouldBe(1);

    goToCart();
    cy.reload();
    cy.contains('.cart_item', item).should('be.visible');
  });

  it('Web Storage registra os itens do carrinho', () => {
    const items = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];
    items.forEach(addItemByName);
    badgeShouldBe(2);

    cy.window().then((win) => {
      const raw = win.localStorage.getItem('cart-contents') || '[]';
      const arr = JSON.parse(raw);
      expect(arr).to.have.length(2);
    });

    goToCart();
    cy.get('.cart_item').should('have.length', 2);
  });

  it('Após voltar do carrinho, a ordenação volta ao padrão (Name A→Z)', () => {
    const isAsc = (arr) => arr.every((v, i, a) => !i || a[i - 1] <= v);

    cy.get('[data-test="product-sort-container"]').should('be.visible').select('lohi');
    cy.get('.inventory_item_price').then(($els) => {
      const prices = [...$els].map(e => Number(e.innerText.replace('$','')));
      expect(isAsc(prices)).to.be.true;
    });

    goToCart();
    continueShopping();

    cy.get('[data-test="product-sort-container"]').should('have.value', 'az');

    cy.get('.inventory_item_name').then(($els) => {
      const names  = [...$els].map(e => e.innerText.trim());
      const sorted = [...names].slice().sort((a, b) => a.localeCompare(b));
      expect(names).to.deep.equal(sorted);
    });
  });

  it('Badge se mantém correto em adição/remoção alternada', () => {
    const seq = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
    ];

    seq.forEach(addItemByName);
    badgeShouldBe(3);

    removeItemByNameFromInventory('Sauce Labs Bike Light');
    badgeShouldBe(2);

    addItemByName('Sauce Labs Fleece Jacket');
    badgeShouldBe(3);

    removeItemByNameFromInventory('Sauce Labs Backpack');
    removeItemByNameFromInventory('Sauce Labs Fleece Jacket');
    removeItemByNameFromInventory('Sauce Labs Bolt T-Shirt');
    badgeShouldBe(0);

    goToCart();
    cy.get('.cart_item').should('have.length', 0);
  });

  it('Adicionar todos os 6 itens e depois remover todos pelo carrinho', () => {
    cy.get('.inventory_item').each(($card) => {
      cy.wrap($card).contains('button', 'Add to cart').click();
      cy.wrap($card).contains('button', 'Remove').should('be.visible');
    });

    badgeShouldBe(6);

    goToCart();
    cy.get('.cart_item').should('have.length', 6);

    cy.get('.cart_item').each(($row) => {
      cy.wrap($row).contains('button', 'Remove').click();
    });

    cy.get('.cart_item').should('have.length', 0);
    badgeShouldBe(0);
  });

  it('Botões do carrinho são focáveis e acionáveis (Enter com fallback para click)', () => {
    addItemByName('Sauce Labs Backpack');
    goToCart();

    cy.get('[data-test="continue-shopping"]')
      .focus()
      .should('be.focused')
      .type('{enter}');

    cy.location('pathname', { timeout: 500 }).then((path) => {
      if (!path.includes('/inventory.html')) {
        cy.get('[data-test="continue-shopping"]').click();
      }
    });

    cy.url().should('include', '/inventory.html');

    goToCart();
    cy.get('[data-test="checkout"]')
      .focus()
      .should('be.focused')
      .type('{enter}');

    cy.location('pathname', { timeout: 500 }).then((path) => {
      if (!path.includes('/checkout-step-one.html')) {
        cy.get('[data-test="checkout"]').click();
      }
    });

    cy.url().should('include', '/checkout-step-one.html');
  });

  it('Reset App State limpa carrinho e badge', () => {
    const item = 'Sauce Labs Backpack';

    addItemByName(item);
    badgeShouldBe(1);

    openMenu();
    cy.get('#reset_sidebar_link').click();

    cy.window().then((win) => {
      const raw = win.localStorage.getItem('cart-contents') || '[]';
      const arr = JSON.parse(raw);
      expect(arr).to.have.length(0);
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

  it('Bloqueia acesso direto ao carrinho sem login', () => {
    cy.clearCookies();
    cy.visit('https://www.saucedemo.com/cart.html', { failOnStatusCode: false });
    cy.location('pathname').should('eq', '/');
    cy.url().should('not.include', '/inventory.html');
  });

  it('Logout limpa o carrinho e bloqueia /cart.html', () => {
    addItemByName('Sauce Labs Backpack');
    badgeShouldBe(1);

    openMenu();
    cy.get('#logout_sidebar_link').click();
    cy.location('pathname').should('eq', '/');

    cy.visit('https://www.saucedemo.com/cart.html', { failOnStatusCode: false });
    cy.location('pathname').should('eq', '/');
  });

  it('Badge reflete exatamente o número de itens no carrinho', () => {
    const items = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt'
    ];
    items.forEach(addItemByName);
    badgeShouldBe(items.length);

    goToCart();
    cy.get('.cart_item').then($rows => {
      expect($rows.length).to.eq(items.length);
    });
  });

  it('Remover o último item remove o elemento do badge do DOM', () => {
    addItemByName('Sauce Labs Onesie');
    badgeShouldBe(1);

    goToCart();
    cy.get('.cart_item').should('have.length', 1);
    cy.get('.cart_item button').contains('Remove').click();

    cy.get('.cart_item').should('have.length', 0);
    cy.get('body').find('.shopping_cart_badge').should('have.length', 0);
  });

  it('Adicionar pelo detalhe do produto reflete no carrinho', () => {
    const item = 'Sauce Labs Fleece Jacket';
    cy.contains('.inventory_item', item).find('.inventory_item_name').click();
    cy.url().should('include', '/inventory-item.html');

    cy.contains('button', 'Add to cart').click();
    cy.contains('button', 'Remove').should('be.visible');

    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
    cy.contains('.cart_item', item).should('be.visible');
    badgeShouldBe(1);
  });

  it('No carrinho: se houver imagem clicável usa ela; senão clica no nome', () => {
    const item = 'Sauce Labs Backpack';
    addItemByName(item);
    goToCart();

    cy.contains('.cart_item', item).then(($row) => {
      const $img =
        $row.find('img, .inventory_item_img, .cart_item_img, .cart_item_img a');

      if ($img.length) {
        cy.wrap($img[0]).click({ force: true });
      } else {
        cy.wrap($row).find('.inventory_item_name').click();
      }
    });

    cy.url().should('include', '/inventory-item.html');
    cy.get('.inventory_details_name').should('have.text', item);
  });

  it('Botão Remove é acionável por teclado (Enter) com fallback para click', () => {
    const item = 'Sauce Labs Bike Light';
    addItemByName(item);
    goToCart();

    const row = () => cy.contains('.cart_item', item);

    row()
      .find('button')
      .contains('Remove')
      .focus()
      .should('be.focused')
      .trigger('keydown', { key: 'Enter' })
      .trigger('keyup',   { key: 'Enter' })
      .then(() => {
        row().then($r => {
          if ($r.length) {
            row().find('button').contains('Remove').click();
          }
        });
      });

    row().should('not.exist');
    badgeShouldBe(0);
  });

  it('Carrinho renderiza corretamente em viewport mobile', () => {
    cy.viewport('iphone-6');
    addItemByName('Sauce Labs Backpack');
    goToCart();

    cy.get('.cart_quantity_label').should('contain', 'QTY');
    cy.get('.cart_desc_label').should('contain', 'Description');
    cy.get('[data-test="continue-shopping"]').should('be.visible');
    cy.get('[data-test="checkout"]').should('be.visible');
  });

  it('Carrinho com problem_user: renderiza e Remove funciona', () => {
    login('problem_user');
    addItemByName('Sauce Labs Backpack');
    goToCart();
    cy.get('.cart_item').should('have.length', 1);
    cy.contains('.cart_item', 'Sauce Labs Backpack')
      .find('button').contains('Remove').click();
    cy.get('.cart_item').should('have.length', 0);
  });

  it('Carrinho com visual_user: renderiza itens', () => {
    login('visual_user');
    addItemByName('Sauce Labs Bike Light');
    goToCart();
    cy.get('.cart_item').should('have.length', 1);
  });
});

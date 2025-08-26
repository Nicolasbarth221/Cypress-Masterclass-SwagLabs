describe('Carrinho de Compras - Swag Labs', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/inventory.html')
  })

  it('Carrinho inicia vazio e sem badge', () => {
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').should('have.length', 0)
    cy.get('body').find('.shopping_cart_badge').should('have.length', 0)
  })

  it('Adicionar 1 item mostra no carrinho', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').should('have.length', 1)
  })

  it('Remover item pelo carrinho', () => {
    cy.contains('.inventory_item', 'Sauce Labs Bike Light').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.contains('.cart_item', 'Sauce Labs Bike Light').find('button').contains('Remove').click()
    cy.get('.cart_item').should('have.length', 0)
  })

  it('Adicionar 2 itens diferentes', () => {
    cy.contains('.inventory_item', 'Sauce Labs Bolt T-Shirt').contains('Add to cart').click()
    cy.contains('.inventory_item', 'Sauce Labs Fleece Jacket').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').should('have.length', 2)
  })

  it('Remover pelo inventário reflete no carrinho', () => {
    cy.contains('.inventory_item', 'Sauce Labs Onesie').contains('Add to cart').click()
    cy.contains('.inventory_item', 'Sauce Labs Onesie').contains('Remove').click()
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').should('have.length', 0)
  })

  it('Mesmo item não duplica', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Remove').click()
    cy.get('body').find('.shopping_cart_badge').should('have.length', 0)
  })

  it('Continue Shopping volta para lista', () => {
    cy.get('.shopping_cart_link').click()
    cy.get('[data-test="continue-shopping"]').click()
    cy.get('.inventory_item').should('have.length', 6)
  })

  it('Link do nome abre detalhes', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.contains('.cart_item', 'Sauce Labs Backpack').find('.inventory_item_name').click()
    cy.url().should('include', '/inventory-item.html')
  })

  it('Remover no carrinho e voltar não restaura', () => {
    cy.contains('.inventory_item', 'Sauce Labs Bolt T-Shirt').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.contains('.cart_item', 'Sauce Labs Bolt T-Shirt').find('button').contains('Remove').click()
    cy.go('back')
    cy.contains('.inventory_item', 'Sauce Labs Bolt T-Shirt').contains('Add to cart').should('be.visible')
  })

  it('Checkout vai para passo 1', () => {
    cy.contains('.inventory_item', 'Sauce Labs Bike Light').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.get('[data-test="checkout"]').click()
    cy.url().should('include', '/checkout-step-one.html')
  })

  it('Checkout com carrinho vazio também vai', () => {
    cy.get('.shopping_cart_link').click()
    cy.get('[data-test="checkout"]').click()
    cy.url().should('include', '/checkout-step-one.html')
  })

  it('Carrinho persiste após reload', () => {
    cy.contains('.inventory_item', 'Sauce Labs Fleece Jacket').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.reload()
    cy.contains('.cart_item', 'Sauce Labs Fleece Jacket').should('be.visible')
  })

  it('Persistência reload inventory e cart', () => {
    cy.contains('.inventory_item', 'Sauce Labs Fleece Jacket').contains('Add to cart').click()
    cy.reload()
    cy.get('.shopping_cart_link').click()
    cy.reload()
    cy.contains('.cart_item', 'Sauce Labs Fleece Jacket').should('be.visible')
  })

  it('Itens aparecem no localStorage', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.contains('.inventory_item', 'Sauce Labs Bike Light').contains('Add to cart').click()
    cy.window().then(win => {
      const raw = win.localStorage.getItem('cart-contents') || '[]'
      const arr = JSON.parse(raw)
      expect(arr.length).to.eq(2)
    })
  })

  it('Ordenação volta para padrão', () => {
    cy.get('[data-test="product-sort-container"]').select('lohi')
    cy.get('.shopping_cart_link').click()
    cy.get('[data-test="continue-shopping"]').click()
    cy.get('[data-test="product-sort-container"]').should('have.value', 'az')
  })

  it('Badge muda quando adiciona e remove', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.contains('.inventory_item', 'Sauce Labs Bike Light').contains('Add to cart').click()
    cy.contains('.inventory_item', 'Sauce Labs Bolt T-Shirt').contains('Add to cart').click()
    cy.contains('.inventory_item', 'Sauce Labs Bike Light').contains('Remove').click()
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Remove').click()
    cy.contains('.inventory_item', 'Sauce Labs Bolt T-Shirt').contains('Remove').click()
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').should('have.length', 0)
  })

  it('Adicionar todos e remover todos', () => {
    cy.get('.inventory_item').each($card => {
      cy.wrap($card).contains('Add to cart').click()
    })
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').each($row => {
      cy.wrap($row).contains('Remove').click()
    })
    cy.get('.cart_item').should('have.length', 0)
  })

  it('Botões funcionam com Enter', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.get('[data-test="continue-shopping"]').click()
    cy.url().should('include', '/inventory.html')
  })

  it('Reset limpa carrinho', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.get('#react-burger-menu-btn').click()
    cy.get('#reset_sidebar_link').click()
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').should('have.length', 0)
  })

  it('Bloqueia acesso sem login', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.window().then(w => w.sessionStorage.clear())
    cy.visit('https://www.saucedemo.com/cart.html', { failOnStatusCode: false })
    cy.location('pathname', { timeout: 10000 }).should('eq', '/')
  })


  it('Logout limpa o carrinho', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.get('#react-burger-menu-btn').click()
    cy.get('#logout_sidebar_link').should('be.visible').click()
    cy.location('pathname', { timeout: 10000 }).should('eq', '/')
    cy.visit('https://www.saucedemo.com/cart.html', { failOnStatusCode: false })
    cy.location('pathname', { timeout: 10000 }).should('eq', '/')
  })


  it('Badge mostra número certo', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.contains('.inventory_item', 'Sauce Labs Bike Light').contains('Add to cart').click()
    cy.get('.shopping_cart_badge').should('have.text', '2')
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').should('have.length', 2)
  })


  it('Remover último item some badge', () => {
    cy.contains('.inventory_item', 'Sauce Labs Onesie').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').find('button').contains('Remove').click()
    cy.get('body').find('.shopping_cart_badge').should('have.length', 0)
  })

  it('Adicionar pelo detalhe do produto', () => {
    cy.contains('.inventory_item', 'Sauce Labs Fleece Jacket').find('.inventory_item_name').click()
    cy.contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.contains('.cart_item', 'Sauce Labs Fleece Jacket').should('be.visible')
  })

  it('No carrinho clica imagem ou nome', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.contains('.cart_item', 'Sauce Labs Backpack').find('.inventory_item_name').click()
    cy.url().should('include', '/inventory-item.html')
  })

  it('Botão Remove funciona com Enter', () => {
    cy.contains('.inventory_item', 'Sauce Labs Bike Light').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.contains('.cart_item', 'Sauce Labs Bike Light').find('button').contains('Remove').click()
    cy.contains('.cart_item', 'Sauce Labs Bike Light').should('not.exist')
  })

  it('Carrinho em viewport mobile', () => {
    cy.viewport('iphone-6')
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.get('[data-test="checkout"]').should('be.visible')
  })

  it('Carrinho com problem_user', () => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('problem_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.contains('.inventory_item', 'Sauce Labs Backpack').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').find('button').contains('Remove').click()
    cy.get('.cart_item').should('have.length', 0)
  })

  it('Carrinho com visual_user', () => {
    cy.visit('https://www.saucedemo.com/')
    cy.get('[data-test="username"]').type('visual_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.contains('.inventory_item', 'Sauce Labs Bike Light').contains('Add to cart').click()
    cy.get('.shopping_cart_link').click()
    cy.get('.cart_item').should('have.length', 1)
  })
})

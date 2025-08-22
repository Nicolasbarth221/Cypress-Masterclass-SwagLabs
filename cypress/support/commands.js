// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('visitLogin', () => {
  cy.visit('/')                          // baseUrl + '/'
  cy.get('[data-test="username"]').should('be.visible').and('be.enabled')
  cy.get('[data-test="password"]').should('be.visible').and('be.enabled')
})

Cypress.Commands.add('login', (username, password) => {
  cy.visitLogin()
  cy.get('[data-test="username"]').clear().type(username)
  cy.get('[data-test="password"]').clear().type(password, { log: false })
  cy.get('[data-test="login-button"]').click()
})

/** Mantém sessão entre testes do mesmo spec (mais rápido e estável) */
Cypress.Commands.add('loginAsStandardUsingSession', () => {
  cy.session('standard_user', () => {
    cy.visit('/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce', { log: false })
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/inventory.html')
  })
})

import 'cypress-plugin-tab'


/// <reference types="cypress" />

describe('home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it('should have Senate title', () => {
        // https://on.cypress.io/title
        cy.title().should('include', 'Senate')
    })

    it('displays front page full width', () => {
        cy.get('[data-cy="home"]').should('have.css', 'width', '100%')
    })

    it('displays logo', () => {
        cy.get('[data-cy="logo-image"]').should(
            'have.attr',
            'src',
            '/logo_dark.svg'
        )
        cy.get('[data-cy="logo"]').contains('Senate')
    })

    it('displays hero', () => {
        cy.get('[data-cy="content"]').contains('Join')
        cy.get('[data-cy="content"]').contains('Senate!')
        cy.get('[data-cy="content"]').contains(
            'Start receiving notifications from your DAOs every time a new proposal is made!'
        )
    })

    it('displays links', () => {
        cy.get('[data-cy="links"]').contains('About')
        cy.get('[data-cy="links"]').contains('FAQ')
        cy.get('[data-cy="links"]').contains('Twitter')
        cy.get('[data-cy="links"]').contains('Github')
        cy.get('[data-cy="links"]').contains('Discord')
    })

    it('displays launch button', () => {
        cy.get('[data-cy="content"]').contains('Launch App')
    })

    it('goes to dashboard', () => {
        cy.get('[data-cy="content"]').contains('Launch App').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard')
    })
})

export {}

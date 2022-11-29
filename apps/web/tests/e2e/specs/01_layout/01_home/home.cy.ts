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

    /* ==== Test Created with Cypress Studio ==== */
    it('shows all text', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-cy="logo-image"]').should(
            'have.attr',
            'src',
            '/logo_dark.svg'
        )
        cy.get('[data-cy="logo-image"]').should('have.attr', 'width', '50')
        cy.get('[data-cy="logo-image"]').should('have.attr', 'height', '50')
        cy.get('a > .flex > p').should('have.text', 'Senate')
        cy.get('[href="/about"] > p').should('have.text', 'About')
        cy.get('[href="/faq"] > p').should('have.text', 'FAQ')
        cy.get('[href="https://twitter.com/SenateLabs"] > p').should(
            'have.text',
            'Twitter'
        )
        cy.get('[href="https://github.com/senate-xyz/senate"] > p').should(
            'have.text',
            'Github'
        )
        cy.get('[href="https://discord.gg/pX7JNetz"] > p').should(
            'have.text',
            'Discord'
        )
        cy.get('[data-cy="content"] > .w-full > .flex > :nth-child(1)').should(
            'have.text',
            'Join'
        )
        cy.get('[data-cy="content"] > .w-full > .flex > :nth-child(2)').should(
            'have.text',
            'Senate!'
        )
        cy.get('.m-4').should(
            'have.text',
            'Start receiving notifications from your DAOs every time a new proposal is made!'
        )
        cy.get('.rounded > a > p').should('have.text', 'Launch App')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has everything visible', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-cy="logo-image"]').should('be.visible')
        cy.get('a > .flex > p').should('be.visible')
        cy.get('[data-cy="content"] > .w-full').should('be.visible')
        cy.get('[data-cy="home"]').should('be.visible')
        cy.get(':nth-child(2) > img').should('be.visible')
        cy.get('.rounded > a > p').should('be.visible')
        cy.get('.m-4').should('be.visible')
        cy.get('[data-cy="content"] > .w-full > .flex > :nth-child(1)').should(
            'be.visible'
        )
        cy.get('[data-cy="content"] > .w-full > .flex > :nth-child(2)').should(
            'be.visible'
        )
        /* ==== End Cypress Studio ==== */
    })
})

export {}

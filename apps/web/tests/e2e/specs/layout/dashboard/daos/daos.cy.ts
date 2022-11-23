/// <reference types="cypress" />

describe('home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard/daos')
    })

    it('should have Senate title', () => {
        cy.title().should('include', 'Senate')
    })

    it('displays front page full width', () => {
        cy.get('[data-cy="daos"]').should('have.css', 'width', '100%')
    })

    it('displays navbar', () => {
        cy.get('[data-cy="daos"]').contains('DAOs')
        cy.get('[data-cy="daos"]').contains('Proposals')
        cy.get('[data-cy="daos"]').contains('Settings')
    })

    it('navbar logo should go to home', () => {
        cy.get('[data-cy="logo"]').click()
        cy.url().should('eq', 'http://localhost:3000/')
    })

    it('navbar should go to daos', () => {
        cy.get('[data-cy="daos"]').contains('DAOs').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/daos')
    })

    it('navbar should go to proposals', () => {
        cy.get('[data-cy="daos"]').contains('Proposals').click()
        cy.url().should(
            'eq',
            'http://localhost:3000/dashboard/proposals/active'
        )
    })

    it('navbar should go to settings', () => {
        cy.get('[data-cy="daos"]').contains('Settings').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/settings')
    })

    it('should have dashboard header with title and connect wallet', () => {
        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')

        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('DAOs')
    })

    it('should have following daos', () => {
        cy.get('[data-cy="daos"]').contains('DAOs you are following')
    })

    it('should have not following daos', () => {
        cy.get('[data-cy="daos"]').contains('DAOs you are not following yet...')
    })
})

export {}

/// <reference types="cypress" />

describe('home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard')
    })

    it('should have Senate title', () => {
        cy.title().should('include', 'Senate')
    })

    it('displays front page full width', () => {
        cy.get('[data-cy="dashboard"]').should('have.css', 'width', '100%')
    })

    it('displays navbar', () => {
        cy.get('[data-cy="dashboard"]').contains('DAOs')
        cy.get('[data-cy="dashboard"]').contains('Proposals')
        cy.get('[data-cy="dashboard"]').contains('Settings')
    })

    it('navbar logo should go to home', () => {
        cy.get('[data-cy="logo"]').click()
        cy.url().should('eq', 'http://localhost:3000/')
    })

    it('navbar should go to daos', () => {
        cy.get('[data-cy="dashboard"]').contains('DAOs').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/daos')
    })

    it('navbar should go to proposals', () => {
        cy.get('[data-cy="dashboard"]').contains('Proposals').click()
        cy.url().should(
            'eq',
            'http://localhost:3000/dashboard/proposals/active'
        )
    })

    it('navbar should go to settings', () => {
        cy.get('[data-cy="dashboard"]').contains('Settings').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/settings')
    })
})

export {}

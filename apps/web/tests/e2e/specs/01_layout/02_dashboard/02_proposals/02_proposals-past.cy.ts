/// <reference types="cypress" />

describe('proposals-past', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard/proposals/past')
    })

    it('should have Senate title', () => {
        cy.title().should('include', 'Senate')
    })

    it('displays front page full width', () => {
        cy.get('[data-cy="proposals-past"]').should('have.css', 'width', '100%')
    })

    it('displays navbar', () => {
        cy.get('[data-cy="proposals-past"]').contains('DAOs')
        cy.get('[data-cy="proposals-past"]').contains('Proposals')
        cy.get('[data-cy="proposals-past"]').contains('Settings')
    })

    it('navbar logo should go to home', () => {
        cy.get('[data-cy="logo"]').click()
        cy.url().should('eq', 'http://localhost:3000/')
    })

    it('navbar should go to daos', () => {
        cy.get('[data-cy="proposals-past"]').contains('DAOs').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/daos')
    })

    it('navbar should go to proposals', () => {
        cy.get('[data-cy="proposals-past"]').contains('Proposals').click()
        cy.url().should(
            'eq',
            'http://localhost:3000/dashboard/proposals/active'
        )
    })

    it('navbar should go to settings', () => {
        cy.get('[data-cy="proposals-past"]').contains('Settings').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/settings')
    })

    it('should have dashboard header with title and connect wallet', () => {
        cy.get('[data-cy="proposals-past"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')

        cy.get('[data-cy="proposals-past"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Proposals')
    })

    it('should have active proposals', () => {
        cy.get('[data-cy="proposals-past"]').contains('Active Proposals')
    })

    it('should have past proposals', () => {
        cy.get('[data-cy="proposals-past"]').contains('Past Proposals')
    })

    it('should have filters', () => {
        cy.get('[data-cy="proposals-past"]').contains('From')
        cy.get('[data-cy="proposals-past"]').contains('Ended on')
        cy.get('[data-cy="proposals-past"]').contains('With vote status of')

        cy.get('[data-cy="proposals-past"]').contains('Any')
        cy.get('[data-cy="proposals-past"]').contains('Last 24 hours')
        cy.get('[data-cy="proposals-past"]').contains('Any status')
    })
})

export {}
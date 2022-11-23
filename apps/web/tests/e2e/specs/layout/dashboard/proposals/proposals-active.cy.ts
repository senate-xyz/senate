/// <reference types="cypress" />

describe('home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard/proposals/active')
    })

    it('should have Senate title', () => {
        cy.title().should('include', 'Senate')
    })

    it('displays front page full width', () => {
        cy.get('[data-cy="proposals-active"]').should(
            'have.css',
            'width',
            '100%'
        )
    })

    it('displays navbar', () => {
        cy.get('[data-cy="proposals-active"]').contains('DAOs')
        cy.get('[data-cy="proposals-active"]').contains('Proposals')
        cy.get('[data-cy="proposals-active"]').contains('Settings')
    })

    it('navbar logo should go to home', () => {
        cy.get('[data-cy="logo"]').click()
        cy.url().should('eq', 'http://localhost:3000/')
    })

    it('navbar should go to daos', () => {
        cy.get('[data-cy="proposals-active"]').contains('DAOs').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/daos')
    })

    it('navbar should go to proposals', () => {
        cy.get('[data-cy="proposals-active"]').contains('Proposals').click()
        cy.url().should(
            'eq',
            'http://localhost:3000/dashboard/proposals/active'
        )
    })

    it('navbar should go to settings', () => {
        cy.get('[data-cy="proposals-active"]').contains('Settings').click()
        cy.url().should('eq', 'http://localhost:3000/dashboard/settings')
    })

    it('should have dashboard header with title and connect wallet', () => {
        cy.get('[data-cy="proposals-active"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')

        cy.get('[data-cy="proposals-active"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Proposals')
    })

    it('should have active proposals', () => {
        cy.get('[data-cy="proposals-active"]').contains('Active Proposals')
    })

    it('should have past proposals', () => {
        cy.get('[data-cy="proposals-active"]').contains('Past Proposals')
    })

    it('should have filters', () => {
        cy.get('[data-cy="proposals-active"]').contains('From')
        cy.get('[data-cy="proposals-active"]').contains('Ending in')
        cy.get('[data-cy="proposals-active"]').contains('With vote status of')

        cy.get('[data-cy="proposals-active"]').contains('Any')
        cy.get('[data-cy="proposals-active"]').contains('Any day')
        cy.get('[data-cy="proposals-active"]').contains('Any status')
    })
})

export {}

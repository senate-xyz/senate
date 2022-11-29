/// <reference types="cypress" />

describe('dashboard', () => {
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

    /* ==== Test Created with Cypress Studio ==== */
    it('shows navbar', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-cy="navbar"]').should('be.visible')
        cy.get('[href="/dashboard/settings"] > .flex > .text-sm').should(
            'be.visible'
        )
        cy.get('[href="/dashboard/settings"] > .flex > .text-sm').should(
            'have.text',
            'Settings'
        )
        cy.get('[href="/dashboard/settings"] > .flex > .fill-slate-400').should(
            'be.visible'
        )
        cy.get(
            '[href="/dashboard/proposals/active"] > .flex > .text-sm'
        ).should('have.text', 'Proposals')
        cy.get(
            '[href="/dashboard/proposals/active"] > .flex > .text-sm'
        ).should('be.visible')
        cy.get(
            '[href="/dashboard/proposals/active"] > .flex > .fill-slate-400'
        ).should('be.visible')
        cy.get('[href="/dashboard/daos"] > .flex > .text-sm').should(
            'have.text',
            'DAOs'
        )
        cy.get('[href="/dashboard/daos"] > .flex > .text-sm').should(
            'be.visible'
        )
        cy.get('[href="/dashboard/daos"] > .flex > .fill-slate-400').should(
            'be.visible'
        )
        cy.get('[data-cy="navbar"]').should('be.visible')
        cy.get('[data-cy="navbar"]').should('have.class', 'w-24')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('shows daos page', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[href="/dashboard/daos"] > .flex > .fill-slate-400').click()
        cy.get('[data-testid="rk-connect-button"]').should('be.visible')
        cy.get('.text-5xl').should('be.visible')
        cy.get(':nth-child(1) > .text-2xl').click()
        cy.get('.text-5xl').should('have.text', 'DAOs')
        cy.get('.h-48').should('be.visible')
        cy.get('.h-full > :nth-child(1) > .w-full > :nth-child(1)').should(
            'be.visible'
        )
        cy.get('.h-full > :nth-child(1) > .w-full > :nth-child(2)').should(
            'be.visible'
        )
        cy.get('.h-full').should('have.class', 'w-full')
        cy.get('.h-full').should('have.class', 'h-full')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('shows active proposals page', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(
            '[href="/dashboard/proposals/active"] > .flex > .fill-slate-400'
        ).click()
        cy.get('.h-48').should('be.visible')
        cy.get('.h-48 > .text-5xl').should('be.visible')
        cy.get('.h-48 > .text-5xl').should('have.text', 'Proposals')
        cy.get('[data-testid="rk-connect-button"]').should('be.visible')
        cy.get('[data-testid="rk-connect-button"]').should('be.enabled')
        cy.get('[data-testid="rk-connect-button"]').should(
            'have.text',
            'Connect Wallet'
        )
        cy.get('.gap-10').should('be.visible')
        cy.get('.text-gray-100').should('be.visible')
        cy.get('.text-gray-100').should('have.text', 'Active Proposals')
        cy.get('.text-gray-400').should('be.visible')
        cy.get('.text-gray-400').should('have.text', 'Past Proposals')
        cy.get('.mt-2 > :nth-child(1) > .flex-row').should('be.visible')
        cy.get('#fromDao').should('be.visible')
        cy.get('#fromDao').should('be.enabled')
        cy.get('#endingIn').should('be.visible')
        cy.get('#endingIn').should('be.enabled')
        cy.get('#voteStatus').should('be.visible')
        cy.get('#voteStatus').should('be.enabled')
        cy.get('.h-full').should('be.visible')
        cy.get('tr > :nth-child(2)').click()
        cy.get('.h-full').click()
        cy.get('.mt-2 > :nth-child(1) > .flex-row').click()
        cy.get('.mt-2 > :nth-child(1) > :nth-child(2) > .w-full').click()
        cy.get('.h-48').click()
        cy.get('.mt-2 > :nth-child(1) > :nth-child(2) > .w-full').should(
            'be.visible'
        )
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('.text-gray-400').should('have.class', 'text-gray-400')
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('.text-gray-400').should('have.class', 'text-gray-400')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('shows past proposals page', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(
            '[href="/dashboard/proposals/active"] > .flex > .fill-slate-400 > path'
        ).click()
        cy.get('.text-gray-400').click()
        cy.get('.h-48').should('be.visible')
        cy.get('.h-48 > .text-5xl').should('be.visible')
        cy.get('.h-48 > .text-5xl').should('have.text', 'Proposals')
        cy.get('[data-testid="rk-connect-button"]').should('be.enabled')
        cy.get('[data-testid="rk-connect-button"]').should('be.visible')
        cy.get('[data-testid="rk-connect-button"]').should(
            'have.text',
            'Connect Wallet'
        )
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('.text-gray-400').should('have.class', 'text-gray-400')
        cy.get('#fromDao').should('be.visible')
        cy.get('#fromDao').should('be.enabled')
        cy.get('#endedOn').should('be.visible')
        cy.get('#endedOn').should('be.enabled')
        cy.get('#voteStatus').should('be.visible')
        cy.get('#voteStatus').should('be.enabled')
        cy.get('.mt-2 > :nth-child(1) > :nth-child(2) > .w-full').should(
            'be.visible'
        )
        cy.get('.h-full').should('have.class', 'w-full')
        cy.get('.h-full').should('have.class', 'h-full')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('shows settings page', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[href="/dashboard/settings"] > .flex > .fill-slate-400').click()
        cy.get('.h-full > .w-full > .flex').should('be.visible')
        cy.get('.text-5xl').should('have.text', 'Settings')
        cy.get('.text-5xl').should('be.visible')
        cy.get('[data-testid="rk-connect-button"]').should('be.visible')
        cy.get('[data-testid="rk-connect-button"]').should('be.enabled')
        cy.get('[data-testid="rk-connect-button"]').should(
            'have.text',
            'Connect Wallet'
        )
        cy.get('.h-full').click()
        cy.get('.h-full').should('have.class', 'w-full')
        /* ==== End Cypress Studio ==== */
    })
})

export {}

/// <reference types="cypress" />

describe('home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard/daos')

        cy.setupMetamask(
            'test test test test test test test test test test test junk',
            'mainnet',
            'senate123'
        )
    })
    it('it should do wallet connect on clear cookies', () => {
        cy.clearCookies()

        cy.disconnectMetamaskWalletFromAllDapps()

        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')
            .click()

        cy.contains('MetaMask').click()

        cy.switchToMetamaskNotification()
        cy.acceptMetamaskAccess()

        cy.switchToCypressWindow()

        cy.contains('Send message').click()
        cy.switchToMetamaskNotification()
        cy.confirmMetamaskSignatureRequest()

        cy.switchToCypressWindow()

        cy.contains('0xf3…2266')
    })

    it('it should connect with cookies', () => {
        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')
            .click()
        cy.contains('Send message').click()
        cy.switchToMetamaskNotification()
        cy.confirmMetamaskSignatureRequest()

        cy.switchToCypressWindow()

        cy.contains('0xf3…2266')
    })

    it('it should disconnect with cookies', () => {
        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')
            .click()
        cy.contains('Send message').click()
        cy.switchToMetamaskNotification()
        cy.confirmMetamaskSignatureRequest()

        cy.switchToCypressWindow()

        cy.contains('0xf3…2266').click()
        cy.contains('Disconnect').click()

        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')
    })
})

export {}

/// <reference types="cypress" />
import '@synthetixio/synpress/support/commands'

describe('home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard/daos')
    })

    it('should have Senate title', () => {
        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')
            .click()

        cy.contains('MetaMask').click()

        cy.contains('Send message').click()

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)

        cy.switchToMetamaskNotification()

        cy.confirmMetamaskSignatureRequest()

        cy.switchToCypressWindow()

        cy.contains('0xf3…2266')
    })
})

export {}

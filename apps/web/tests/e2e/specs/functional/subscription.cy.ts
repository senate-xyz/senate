import * as bip39 from 'bip39'

describe('sub', () => {
    const login = (name: string) => {
        cy.session(name, () => {
            cy.setupMetamask(bip39.generateMnemonic(), 'main')
            cy.disconnectMetamaskWalletFromAllDapps()
            cy.visit('http://localhost:3000/dashboard/daos')
            cy.switchToMetamaskWindow()
            cy.disconnectMetamaskWalletFromAllDapps()
            cy.switchMetamaskAccount(1)
            cy.switchToCypressWindow()

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
        cy.visit('http://localhost:3000/dashboard/daos')
    }

    /* ==== Test Created with Cypress Studio ==== */
    it('subscribe and unsubscribe', function () {
        /* ==== Generated with Cypress Studio ==== */
        login('testUser')
        cy.get(':nth-child(1) > .mt-4 > .h-20').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .h-20').should('be.enabled')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').should('be.visible')
        cy.get('.h-full > .h-20').should('be.enabled')
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('be.visible')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').should('be.visible')
        cy.get('.h-full > .h-20').should('be.enabled')
        cy.get('.h-full > .h-20').click()
        /* ==== End Cypress Studio ==== */
    })
})

export {}

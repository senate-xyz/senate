import * as bip39 from 'bip39'

describe('sub', () => {
    const login = (name: string) => {
        cy.session(name, () => {
            cy.setupMetamask(bip39.generateMnemonic(), 'mainnet')
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

            // eslint-disable-next-line promise/catch-or-return, promise/always-return
            cy.contains('MetaMask').then((btn) => {
                ;(btn as Cypress.Chainable).click()
                cy.wait(1000)
                cy.acceptMetamaskAccess()
            })

            cy.contains('Send message').click()
            cy.switchToMetamaskNotification()
            cy.confirmMetamaskSignatureRequest()

            cy.switchToCypressWindow()

            cy.contains('0xf3…2266')
        })
        cy.visit('http://localhost:3000/dashboard/daos')
    }

    /* ==== Test Created with Cypress Studio ==== */
    it('subscribes and unsubscribes first', function () {
        /* ==== Generated with Cypress Studio ==== */
        login('testUser')

        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(1) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .h-20').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .h-20').should('be.enabled')
        cy.get(':nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Aave'
        )
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').should('be.visible')
        cy.get('.h-full > .h-20').should('be.enabled')
        cy.get('.h-full > .h-20').click()
        cy.get('[data-cy="followed"] > .mt-4').should('be.visible')
        cy.get(
            '[data-cy="followed"] > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Aave')
        cy.get('[data-cy="followed"] > .mt-4').click()
        cy.get('.h-full > .h-20').should('be.visible')
        cy.get('.h-full > .h-20').should('be.enabled')
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(1) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Aave'
        )
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('subscribes and unsubscribes all', function () {
        login('testUser')
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get('[data-cy="followed"] > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(1) > .grid > :nth-child(2) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(1) > .grid > :nth-child(3) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(1) > .grid > :nth-child(4) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(1) > .grid > :nth-child(5) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(1) > .grid > :nth-child(6) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(7) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(8) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(9) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(10) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(11) > .mt-4').should('be.visible')
        cy.get('.h-20').click()
        cy.get('.h-20').click()
        cy.get(':nth-child(12) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .mt-4').click()
        cy.get('.h-20').click()
        cy.get('[data-cy="unfollowed"] > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(2) > .grid > :nth-child(2) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(2) > .grid > :nth-child(3) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(2) > .grid > :nth-child(4) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(2) > .grid > :nth-child(5) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(2) > .grid > :nth-child(6) > .mt-4').should(
            'be.visible'
        )
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(7) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(8) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(9) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(10) > .mt-4').should('be.visible')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(11) > .mt-4').should('be.visible')
        cy.get('[data-cy="followed"] > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(12) > .mt-4').should('be.visible')
        /* ==== End Cypress Studio ==== */
    })
})

export {}

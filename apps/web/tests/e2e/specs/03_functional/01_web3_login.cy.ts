/// <reference types="cypress" />

describe('login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard/daos')
    })

    it('it should do wallet connect', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid="rk-connect-button"]').should(
            'have.text',
            'Connect Wallet'
        )
        cy.get('[data-testid="rk-connect-button"]').click()

        // eslint-disable-next-line promise/catch-or-return, promise/always-return
        cy.contains('MetaMask').then((btn) => {
            ;(btn as unknown as Cypress.Chainable).click()

            cy.switchToMetamaskNotification()
            cy.acceptMetamaskAccess()
            cy.wait(1000)
            cy.switchToCypressWindow()
        })

        cy.get('[data-testid="rk-auth-message-button"]').should(
            'have.text',
            'Send message'
        )
        cy.get('[data-testid="rk-auth-message-button"]').click()
        cy.confirmMetamaskSignatureRequest()
        cy.get('[data-testid="rk-account-button"]').should(
            'have.text',
            '0 ETH🍣0xf3…2266'
        )
        /* ==== End Cypress Studio ==== */
    })

    it('it should disconnect', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid="rk-connect-button"]').should(
            'have.text',
            'Connect Wallet'
        )
        cy.get('[data-testid="rk-connect-button"]').click()

        cy.get('[data-testid="rk-auth-message-button"]').should(
            'have.text',
            'Send message'
        )
        cy.get('[data-testid="rk-auth-message-button"]').click()
        cy.confirmMetamaskSignatureRequest()
        cy.get('[data-testid="rk-account-button"]').should(
            'have.text',
            '0 ETH🍣0xf3…2266'
        )
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid="rk-account-button"]').click()
        cy.get('[data-testid="rk-disconnect-button"]').should(
            'have.text',
            'Disconnect'
        )
        cy.get('[data-testid="rk-disconnect-button"]').click()
        cy.get('#rk_connect_title').should('have.text', 'Connect a Wallet')
        /* ==== End Cypress Studio ==== */
    })
})

export {}

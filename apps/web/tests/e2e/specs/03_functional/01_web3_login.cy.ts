/// <reference types="cypress" />

describe('login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard/daos')
    })

    it('it should do wallet connect', () => {
        cy.disconnectMetamaskWalletFromDapp()
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid="rk-connect-button"]').click()
        cy.get('[data-testid="rk-wallet-option-metaMask"]').click()
        cy.acceptMetamaskAccess()
        cy.get('[data-testid="rk-auth-message-button"]').click()
        cy.confirmMetamaskSignatureRequest()
        cy.get('[data-testid="rk-account-button"]').should(
            'have.text',
            '0 ETH🍣0xf3…2266'
        )
        /* ==== End Cypress Studio ==== */
    })

    it('it should do wallet connect again', () => {
        cy.disconnectMetamaskWalletFromDapp()
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid="rk-connect-button"]').click()
        cy.get('[data-testid="rk-wallet-option-metaMask"]').click()
        cy.acceptMetamaskAccess()
        cy.get('[data-testid="rk-auth-message-button"]').click()
        cy.confirmMetamaskSignatureRequest()
        cy.get('[data-testid="rk-account-button"]').should(
            'have.text',
            '0 ETH🍣0xf3…2266'
        )
        /* ==== End Cypress Studio ==== */
    })
})

export {}

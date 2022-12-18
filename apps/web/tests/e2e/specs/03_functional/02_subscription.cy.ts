import * as bip39 from 'bip39'

describe('sub', () => {
    const login = (name: string) => {
        cy.session(name, () => {
            cy.setupMetamask(bip39.generateMnemonic(), 'mainnet')
            cy.disconnectMetamaskWalletFromAllDapps()
            cy.visit('http://localhost:3000/dashboard/daos')
            cy.disconnectMetamaskWalletFromDapp()
            cy.get('[data-testid="rk-connect-button"]').click()
            cy.get('[data-testid="rk-wallet-option-metaMask"]').click()
            cy.acceptMetamaskAccess()
            cy.get('[data-testid="rk-auth-message-button"]').click()
            cy.confirmMetamaskSignatureRequest()
            cy.get('.h-\\[46px\\] > .h-full').type('test@test.com')
            cy.get('#default-checkbox').check()
            cy.get('.h-\\[42px\\]').click()
            cy.wait(12000)
            cy.get('[data-testid="rk-account-button"]').should(
                'contain.text',
                '🍣0xf3…2266'
            )
        })
        cy.visit('http://localhost:3000/dashboard/daos')
    }

    /* ==== Test Created with Cypress Studio ==== */
    it('subscribes and unsubscribes first', function () {
        login('testUser')
        /* ==== Generated with Cypress Studio ==== */
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            '[data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get('[data-testid="open-menu"] > img').click()
        cy.get('[data-testid="unsubscribe"]').click()
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('subscribes and unsubscribes all', function () {
        login('testUser')
        /* ==== Generated with Cypress Studio ==== */
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            '[data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'MakerDAO')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(2) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'MakerDAO')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Balancer')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(3) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Balancer')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Optimism')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(4) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Optimism')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Element')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(5) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Element')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', '1inch')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(6) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', '1inch')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Hop Protocol')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(7) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Hop Protocol')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'SafeDAO')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(8) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'SafeDAO')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Compound')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(9) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Compound')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Synthetix')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(10) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Synthetix')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'dYdX')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(11) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'dYdX')
        cy.get(
            '[data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Uniswap')
        cy.get(
            '[data-testid="daocard-unfollowed-front"] > [data-testid="open-menu"]'
        ).click()
        cy.get('[data-testid="subscribe"]').click()
        cy.get(
            ':nth-child(12) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Uniswap')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            '[data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'MakerDAO')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(2) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'MakerDAO')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Balancer')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(3) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Balancer')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Optimism')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(4) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Optimism')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Element')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(5) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Element')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', '1inch')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(6) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', '1inch')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Hop Protocol')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(7) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Hop Protocol')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'SafeDAO')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(8) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'SafeDAO')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Compound')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(9) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Compound')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Synthetix')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(10) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Synthetix')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'dYdX')
        cy.get(
            ':nth-child(1) > [data-testid="daocard-followed-front"] > * > [data-testid="open-menu"] > img'
        ).click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(11) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'dYdX')
        cy.get(
            '[data-testid="daocard-followed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Uniswap')
        cy.get('[data-testid="open-menu"] > img').click()
        cy.get('[data-testid="unsubscribe"]').click()
        cy.get(
            ':nth-child(12) > [data-testid="daocard-unfollowed-front"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Uniswap')
        /* ==== End Cypress Studio ==== */
    })
})

export {}

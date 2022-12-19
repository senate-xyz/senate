import * as bip39 from 'bip39'

describe('proposals', () => {
    const login = (name: string) => {
        cy.session(name, () => {
            cy.setupMetamask(bip39.generateMnemonic(), 'mainnet')
            cy.disconnectMetamaskWalletFromAllDapps()
            cy.visit('http://localhost:3000/daos')
            cy.disconnectMetamaskWalletFromDapp()
            cy.get('[data-testid="rk-connect-button"]').click()
            cy.get('[data-testid="rk-wallet-option-metaMask"]').click()
            cy.acceptMetamaskAccess()
            cy.get('[data-testid="rk-auth-message-button"]').click()
            cy.confirmMetamaskSignatureRequest()
            cy.get('[data-testid="rk-account-button"]').should(
                'contain.text',
                '🍣0xf3…2266'
            )
        })
        cy.visit('http://localhost:3000/daos')
    }

    /* ==== Test Created with Cypress Studio ==== */
    it('subscribes to all daos', function () {
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
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('goes to proposals', function () {
        /* ==== Generated with Cypress Studio ==== */
        login('testUser')
        cy.visit('http://localhost:3000/daos')
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has active proposals', function () {
        login('testUser')
        cy.visit('http://localhost:3000/proposals/active')
        /* ==== Generated with Cypress Studio ==== */
        cy.get(
            ':first-child > .cursor-pointer > [data-testid="proposal-url"] > [data-testid="proposal-name"]'
        ).should('be.visible')
        cy.get(
            ':last-child > .cursor-pointer > [data-testid="proposal-url"] > [data-testid="proposal-name"]'
        ).should('be.visible')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has past proposals', function () {
        login('testUser')
        cy.visit('http://localhost:3000/proposals/past')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid="ended-selector"]').select('7776000000')
        cy.get(
            ':nth-child(1) > .cursor-pointer > [data-testid="proposal-url"] > [data-testid="proposal-name"]'
        ).should('be.visible')
        cy.get(
            ':nth-child(272) > .cursor-pointer > [data-testid="proposal-url"] > [data-testid="proposal-name"]'
        ).should('be.visible')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has active proposals dao filter', function () {
        login('testUser')
        cy.visit('http://localhost:3000/proposals/active')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid="from-selector"]').select(
            'clbtra0ex000097vzn2xvd3x8'
        )
        cy.get(
            ':first-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get(
            ':last-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get('[data-testid="from-selector"]').select(
            'clbtra9te001y97vzj5mr47w3'
        )
        cy.get(
            ':first-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Synthetix')
        cy.get(
            ':last-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Synthetix')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has past proposals dao filter', function () {
        login('testUser')
        cy.visit('http://localhost:3000/proposals/past')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-testid="ended-selector"]').select('7776000000')
        cy.get('[data-testid="from-selector"]').select(
            'clbtra0ex000097vzn2xvd3x8'
        )
        cy.get(
            ':first-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get(
            ':last-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Aave')
        cy.get('[data-testid="from-selector"]').select(
            'clbtra24c000a97vzljrbb457'
        )
        cy.get(
            ':first-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'MakerDAO')
        cy.get(
            ':last-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'MakerDAO')
        cy.get('[data-testid="from-selector"]').select(
            'clbtra9te001y97vzj5mr47w3'
        )
        cy.get(
            ':first-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Synthetix')
        cy.get(
            ':last-child > [data-testid="col1"] > * > [data-testid="dao-name"]'
        ).should('have.text', 'Synthetix')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('unsubscribes all', function () {
        login('testUser')
        cy.visit('http://localhost:3000/daos')

        /* ==== Generated with Cypress Studio ==== */
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

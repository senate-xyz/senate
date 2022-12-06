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
            cy.get('[data-testid="rk-account-button"]').should(
                'have.text',
                '0 ETH🍣0xf3…2266'
            )
        })
        cy.visit('http://localhost:3000/dashboard/daos')
    }

    /* ==== Test Created with Cypress Studio ==== */
    it('subscribes and unsubscribes first', function () {
        /* ==== Generated with Cypress Studio ==== */
        login('testUser')
        /* ==== Generated with Cypress Studio ==== */
        cy.get(
            ':nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center'
        ).should('have.text', 'Aave')
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').should(
            'have.text',
            'Subscribe'
        )
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click()
        cy.get('.h-20').should('have.text', 'Confirm')
        cy.get('.h-20').click()
        cy.get(
            ':nth-child(1) > .grid > .h-\\[320px\\] > .relative > .h-full'
        ).should('be.visible')
        cy.get(
            ':nth-child(1) > .grid > .h-\\[320px\\] > .relative > .h-full > :nth-child(2) > .text-center'
        ).should('have.text', 'Aave')
        cy.get('.cursor-pointer > img').click()
        cy.get('.h-20').should('have.text', 'Unsubscribe')
        cy.get('.h-20').click()
        cy.get(
            ':nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center'
        ).should('have.text', 'Aave')
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').should(
            'have.text',
            'Subscribe'
        )
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('subscribes and unsubscribes all', function () {
        login('testUser')
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Aave');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(1) > .grid > .h-\\[320px\\] > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Aave');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'MakerDAO');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(2) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'MakerDAO');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Balancer');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(3) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Balancer');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Optimism');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(4) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Optimism');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Element');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(5) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Element');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', '1inch');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(6) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', '1inch');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Hop Protocol');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(7) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Hop Protocol');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'SafeDAO');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(8) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'SafeDAO');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Compound');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(9) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Compound');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Synthetix');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(10) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Synthetix');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'dYdX');
        cy.get(':nth-child(1) > .relative > .h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(11) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'dYdX');
        cy.get(':nth-child(2) > .grid > .h-\\[320px\\] > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Uniswap');
        cy.get('.h-\\[56px\\]').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(12) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Uniswap');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(2) > .grid > .h-\\[320px\\] > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Aave');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(2) > .grid > :nth-child(2) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'MakerDAO');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(2) > .grid > :nth-child(3) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Balancer');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(2) > .grid > :nth-child(4) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Optimism');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(2) > .grid > :nth-child(5) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Element');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(2) > .grid > :nth-child(6) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', '1inch');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(7) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Hop Protocol');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(8) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'SafeDAO');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(9) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Compound');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(10) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Synthetix');
        cy.get(':nth-child(1) > .relative > .absolute > .cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(11) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'dYdX');
        cy.get('.cursor-pointer > img').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(12) > .relative > .h-full > :nth-child(2) > .text-center').should('have.text', 'Uniswap');
        /* ==== End Cypress Studio ==== */
    })
})

export {}

import * as bip39 from 'bip39'

describe('proposals', () => {
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
    it('subscribes to all daos', function () {
        login('testUser')
        /* ==== Generated with Cypress Studio ==== */
        cy.visit('http://localhost:3000/dashboard/daos')
        cy.get(':nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Aave'
        )
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            '[data-cy="followed"] > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Aave')
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'MakerDAO')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(1) > .grid > :nth-child(2) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'MakerDAO')
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Balancer')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(1) > .grid > :nth-child(3) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Balancer')
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Optimism')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(1) > .grid > :nth-child(4) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Optimism')
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Element')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(1) > .grid > :nth-child(5) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Element')
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', '1inch')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(1) > .grid > :nth-child(6) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', '1inch')
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Hop Protocol')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(7) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Hop Protocol'
        )
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'SafeDAO')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(8) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'SafeDAO'
        )
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Compound')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(9) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Compound'
        )
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Synthetix')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(10) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Synthetix'
        )
        cy.get(
            ':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'dYdX')
        cy.get(':nth-child(1) > .mt-4 > .h-20').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(11) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'dYdX'
        )
        cy.get('[data-cy="unfollowed"] > .mt-4 > .flex-col > .px-6').should(
            'have.text',
            'Uniswap'
        )
        cy.get('.h-20').click()
        cy.get('.h-20').click()
        cy.get(':nth-child(12) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Uniswap'
        )
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('goes to proposals', function () {
        /* ==== Generated with Cypress Studio ==== */
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/daos')

        cy.get(
            '[href="/dashboard/proposals/active"] > .flex > .fill-slate-400'
        ).should('be.visible')
        cy.get(
            '[href="/dashboard/proposals/active"] > .flex > .fill-slate-400'
        ).click()
        cy.get('.text-gray-100').should('be.visible')
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has active proposals', function () {
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/proposals/active')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.h-32 > :nth-child(1)').should('be.visible')
        cy.get('.h-32 > :nth-last-child(1)').should('be.visible')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has past proposals', function () {
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/proposals/past')
        cy.get('#endedOn').select('7776000000')
        cy.get('.h-32 > :nth-child(1)').should('be.visible')
        cy.get('.h-32 > :nth-last-child(1)').should('be.visible')
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has active proposals dao filter', function () {
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/proposals/active')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('#fromDao').select('clavg9p020000u6sgsybz2srd')

        cy.wait(5000)

        // eslint-disable-next-line promise/catch-or-return
        cy.contains('No active proposals for current selection')
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            .should((_) => {})
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line promise/always-return
                if (!res.length) {
                    cy.get(
                        '.divide-y > :first-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'Aave')
                    cy.get(
                        '.divide-y > :last-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'Aave')
                }
            })

        cy.get('#fromDao').select('clavg9qs3000au6sgtua21s3g')

        cy.wait(5000)

        // eslint-disable-next-line promise/catch-or-return
        cy.contains('No active proposals for current selection') // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            .should((_) => {})
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line promise/always-return
                if (!res.length) {
                    cy.get(
                        '.divide-y > :first-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'MakerDAO')
                    cy.get(
                        '.divide-y > :last-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'MakerDAO')
                }
            })

        cy.get('#fromDao').select('clavg9zvq001yu6sgnfo8r82a')

        cy.wait(5000)

        // eslint-disable-next-line promise/catch-or-return
        cy.contains('No active proposals for current selection') // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            .should((_) => {})
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line promise/always-return
                if (!res.length) {
                    cy.get(
                        '.divide-y > :first-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'Synthetix')
                    cy.get(
                        '.divide-y > :last-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'Synthetix')
                }
            })

        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has past proposals dao filter', function () {
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/proposals/past')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('#endedOn').select('7776000000')
        cy.get('#fromDao').select('clavg9p020000u6sgsybz2srd')

        cy.wait(5000)

        // eslint-disable-next-line promise/catch-or-return
        cy.contains('No past proposals for current selection') // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            .should((_) => {})
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line promise/always-return
                if (!res.length) {
                    cy.get(
                        '.divide-y > :first-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'Aave')
                    cy.get(
                        '.divide-y > :last-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'Aave')
                }
            })

        cy.get('#endedOn').select('7776000000')
        cy.get('#fromDao').select('clavg9qs3000au6sgtua21s3g')

        cy.wait(5000)

        // eslint-disable-next-line promise/catch-or-return
        cy.contains('No past proposals for current selection') // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            .should((_) => {})
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line promise/always-return
                if (!res.length) {
                    cy.get(
                        '.divide-y > :first-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'MakerDAO')
                    cy.get(
                        '.divide-y > :last-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'MakerDAO')
                }
            })

        cy.get('#endedOn').select('7776000000')
        cy.get('#fromDao').select('clavg9zvq001yu6sgnfo8r82a')

        cy.wait(5000)

        // eslint-disable-next-line promise/catch-or-return
        cy.contains('No past proposals for current selection') // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            .should((_) => {})
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line promise/always-return
                if (!res.length) {
                    cy.get(
                        '.divide-y > :first-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'Synthetix')
                    cy.get(
                        '.divide-y > :last-child > :nth-child(1) > .m-2 > p'
                    ).should('have.text', 'Synthetix')
                }
            })

        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('unsubscribes all', function () {
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/daos')

        /* ==== Generated with Cypress Studio ==== */
        cy.visit('http://localhost:3000/dashboard/daos')
        cy.get(':nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Aave'
        )
        cy.get(':nth-child(1) > .mt-4').click()
        cy.get('.h-20').click()
        cy.get(
            '[data-cy="unfollowed"] > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Aave')
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'MakerDAO')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(2) > .grid > :nth-child(2) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'MakerDAO')
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Balancer')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(2) > .grid > :nth-child(3) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Balancer')
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Optimism')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(2) > .grid > :nth-child(4) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Optimism')
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Element')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', '1inch')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(
            ':nth-child(2) > .grid > :nth-child(6) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', '1inch')
        cy.get(
            ':nth-child(2) > .grid > :nth-child(5) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Element')
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Hop Protocol')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(7) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Hop Protocol'
        )
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'SafeDAO')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(8) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'SafeDAO'
        )
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Compound')
        cy.get(':nth-child(1) > .grid > :nth-child(1)').click()
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(9) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Compound'
        )
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Synthetix')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(10) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Synthetix'
        )
        cy.get(
            ':nth-child(1) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'dYdX')
        cy.get(':nth-child(1) > .grid > :nth-child(1) > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(11) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'dYdX'
        )
        cy.get(
            '[data-cy="followed"] > .mt-4 > .flex-col > .px-6 > .mb-2'
        ).should('have.text', 'Uniswap')
        cy.get('[data-cy="followed"] > .mt-4').click()
        cy.get('.h-full > .h-20').click()
        cy.get(':nth-child(12) > .mt-4 > .flex-col > .px-6 > .mb-2').should(
            'have.text',
            'Uniswap'
        )
        /* ==== End Cypress Studio ==== */
    })
})

export {}

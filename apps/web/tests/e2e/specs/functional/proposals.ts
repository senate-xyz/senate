import * as bip39 from 'bip39'

describe('proposals', () => {
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
    it('subscribes to all daos', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.visit('http://localhost:3000/dashboard/daos')
        login('testUser')
        /* ==== Generated with Cypress Studio ==== */
        cy.visit('http://localhost:3000/dashboard/daos');
        cy.get(':nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Aave');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get('[data-cy="followed"] > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Aave');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'MakerDAO');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(2) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'MakerDAO');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Balancer');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(3) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Balancer');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Optimism');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(4) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Optimism');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Element');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(5) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Element');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', '1inch');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(1) > .grid > :nth-child(6) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', '1inch');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Hop Protocol');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(7) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Hop Protocol');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'SafeDAO');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(8) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'SafeDAO');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Compound');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(9) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Compound');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Synthetix');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(10) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Synthetix');
        cy.get(':nth-child(2) > .grid > :nth-child(1) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'dYdX');
        cy.get(':nth-child(1) > .mt-4 > .h-20').click();
        cy.get('.h-full > .h-20').click();
        cy.get(':nth-child(11) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'dYdX');
        cy.get('[data-cy="unfollowed"] > .mt-4 > .flex-col > .px-6').should('have.text', 'Uniswap');
        cy.get('.h-20').click();
        cy.get('.h-20').click();
        cy.get(':nth-child(12) > .mt-4 > .flex-col > .px-6 > .mb-2').should('have.text', 'Uniswap');
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('goes to proposals', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.visit('http://localhost:3000/dashboard/daos')
        login('testUser')
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
        cy.get('.text-gray-100').should('be.visible')
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'be.visible'
        )
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-gray-100').should('be.visible')
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'be.visible'
        )
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has past proposals', function () {
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/proposals/past')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('#endedOn').select('7776000000')
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'be.visible'
        )
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'have.class',
            'cursor-pointer'
        )
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'have.class',
            'hover:underline'
        )
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('#endedOn').select('7776000000')
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'be.visible'
        )
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'have.class',
            'cursor-pointer'
        )
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'have.class',
            'hover:underline'
        )
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has active proposals dao filter', function () {
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/proposals/active')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('#fromDao').select('clavg9p020000u6sgsybz2srd')
        cy.get(':nth-child(1) > :nth-child(1) > .m-2').should(
            'have.text',
            'Aave'
        )
        cy.get(':nth-child(4) > :nth-child(1) > .m-2').should(
            'have.text',
            'Aave'
        )
        cy.get('#fromDao').select('clavg9qs3000au6sgtua21s3g')
        cy.get(':nth-child(1) > :nth-child(1) > .m-2').should(
            'have.text',
            'MakerDAO'
        )
        cy.get(':nth-child(3) > :nth-child(1) > .m-2').should(
            'have.text',
            'MakerDAO'
        )
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('#fromDao').select('clavg9p020000u6sgsybz2srd')
        cy.get(':nth-child(1) > :nth-child(1) > .m-2').should(
            'have.text',
            'Aave'
        )
        cy.get(':nth-child(4) > :nth-child(1) > .m-2').should(
            'have.text',
            'Aave'
        )
        cy.get('#fromDao').select('clavg9qs3000au6sgtua21s3g')
        cy.get(':nth-child(1) > :nth-child(1) > .m-2').should(
            'have.text',
            'MakerDAO'
        )
        cy.get(':nth-child(3) > :nth-child(1) > .m-2').should(
            'have.text',
            'MakerDAO'
        )
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('has past proposals dao filter', function () {
        login('testUser')
        cy.visit('http://localhost:3000/dashboard/proposals/past')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('#endedOn').select('7776000000')
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'be.visible'
        )
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'have.class',
            'cursor-pointer'
        )
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'have.class',
            'hover:underline'
        )
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-gray-100').should('have.class', 'text-gray-100')
        cy.get('#endedOn').select('7776000000')
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'be.visible'
        )
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'have.class',
            'cursor-pointer'
        )
        cy.get('.divide-y > :nth-child(1) > .cursor-pointer').should(
            'have.class',
            'hover:underline'
        )
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('#fromDao').select('clavg9p020000u6sgsybz2srd')
        cy.get(':nth-child(1) > :nth-child(1) > .m-2').should(
            'have.text',
            'Aave'
        )
        cy.get(':nth-child(60) > :nth-child(1) > .m-2').should(
            'have.text',
            'Aave'
        )
        cy.get('#fromDao').select('clavg9qs3000au6sgtua21s3g')
        cy.get('.divide-y > :nth-child(1) > :nth-child(1)').should(
            'have.text',
            'MakerDAO'
        )
        cy.get(':nth-child(26) > :nth-child(1)').should('have.text', 'MakerDAO')
        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('#fromDao').select('clavg9p020000u6sgsybz2srd')
        cy.get(':nth-child(1) > :nth-child(1) > .m-2').should(
            'have.text',
            'Aave'
        )
        cy.get(':nth-child(60) > :nth-child(1) > .m-2').should(
            'have.text',
            'Aave'
        )
        cy.get('#fromDao').select('clavg9qs3000au6sgtua21s3g')
        cy.get('.divide-y > :nth-child(1) > :nth-child(1)').should(
            'have.text',
            'MakerDAO'
        )
        cy.get(':nth-child(26) > :nth-child(1)').should('have.text', 'MakerDAO')
        /* ==== End Cypress Studio ==== */
    })

    /* ==== Test Created with Cypress Studio ==== */
    it('unsubscribes all', function () {
        /* ==== Generated with Cypress Studio ==== */
        cy.visit('http://localhost:3000/dashboard/daos')
        login('testUser')

        /* ==== End Cypress Studio ==== */
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

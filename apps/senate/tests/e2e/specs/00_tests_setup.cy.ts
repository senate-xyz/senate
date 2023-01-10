/// <reference types="cypress" />
import * as bip39 from 'bip39'

describe('setup', () => {
    before(() => {
        cy.clearCookies()
    })

    it('sets up metamask', () => {
        cy.setupMetamask(bip39.generateMnemonic(), 'mainnet')
        cy.disconnectMetamaskWalletFromAllDapps()
    })
})

export {}

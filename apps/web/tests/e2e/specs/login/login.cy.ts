/// <reference types="cypress" />

import * as bip39 from 'bip39'

describe('login', () => {
    before(() => {
        cy.clearCookies()
        cy.setupMetamask(bip39.generateMnemonic(), 'main')
        cy.disconnectMetamaskWalletFromAllDapps()
    })

    beforeEach(() => {
        cy.visit('http://localhost:3000/dashboard/daos')
    })

    it('it should do wallet connect on clear cookies', () => {
        cy.clearCookies()

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

    it('it should connect with cookies', () => {
        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')
            .click()
        cy.contains('Send message').click()
        cy.switchToMetamaskNotification()
        cy.confirmMetamaskSignatureRequest()

        cy.switchToCypressWindow()

        cy.contains('0xf3…2266')
    })

    it('it should disconnect with cookies', () => {
        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')
            .click()
        cy.contains('Send message').click()
        cy.switchToMetamaskNotification()
        cy.confirmMetamaskSignatureRequest()

        cy.switchToCypressWindow()

        cy.contains('0xf3…2266').click()
        cy.contains('Disconnect').click()

        cy.get('[data-cy="daos"]')
            .get('[data-cy="dashboard-header"]')
            .contains('Connect Wallet')
    })

    it('it should create new account', () => {
        cy.switchToMetamaskWindow()

        cy.disconnectMetamaskWalletFromAllDapps()
        cy.createMetamaskAccount()
        cy.switchMetamaskAccount(2)

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

        cy.contains('0x70…79C8').click()
    })
})

export {}

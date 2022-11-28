import { defineConfig } from 'cypress'
import synpressPlugins from '@synthetixio/synpress/plugins'
import cypressLocalStoragePlugin from 'cypress-localstorage-commands/plugin'

export default defineConfig({
    projectId: '8rph21',
    userAgent: 'synpress',
    retries: {
        // Configure retry attempts for `cypress run`
        // Default is 0
        runMode: 0,
        openMode: 0,
    },
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    video: false,
    chromeWebSecurity: true,
    modifyObstructiveCode: false,
    viewportWidth: 1366,
    viewportHeight: 850,
    env: {
        coverage: false,
    },
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 30000,
    requestTimeout: 30000,
    e2e: {
        setupNodeEvents(on, config) {
            cypressLocalStoragePlugin(on, config)
            synpressPlugins(on, config)
            return config
        },
        experimentalSessionAndOrigin: true,
        experimentalStudio: true,
        baseUrl: 'http://localhost:3000',
        specPattern: 'tests/e2e/specs/**/*.{js,jsx,ts,tsx}',
        supportFile: 'tests/e2e/support.js',
    },
})

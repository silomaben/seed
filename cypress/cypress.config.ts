import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'AIQ End To End Tests',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    log: true, 
    quest: true
  },
  e2e: {
    'baseUrl': 'http://ui-app-service.cypress',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    testIsolation: false,
  },
});



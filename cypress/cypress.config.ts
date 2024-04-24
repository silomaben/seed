import { defineConfig } from "cypress";

export default defineConfig({
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
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    testIsolation: false,
  },
});


// had issues accessing dashboards so i went back to actualizing our cypress cicd POC
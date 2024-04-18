import { defineConfig } from "cypress";

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
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
  },
});


// had issues accessing dashboards so i went back to actualizing our cypress cicd POC
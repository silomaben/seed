const { defineConfig } = require("cypress");
const { GenerateCtrfReport } = require('cypress-ctrf-json-report')

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    html:true,
    json:true,
    inlineAssets: true,
    saveAllAttempts: false,
    log: true, 
    quest: true
  },
  e2e: {
    baseUrl: "http://ui-app-service.filetracker.svc.cluster.local",
    setupNodeEvents(on, config) {
      GenerateCtrfReport({
        on,
      }),
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});

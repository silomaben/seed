// cypress/support/cypress.d.ts

declare namespace Cypress {
    interface Chainable<Subject = any> {
        /**
         * Adds test context for Mochawesome reporter
         * @param context The context to add
         */
        addTestContext(context: string): Chainable<Subject>;
    }
}

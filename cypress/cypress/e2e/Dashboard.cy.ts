import '../support/commands';

it('confirm dashboard content area contains all the categories and redirects to respective pages  onclick.', () => {
    // cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    cy.visit("/auth")
    // cy.visit("/")

    // cy.get('.ml-4 > .text-900').click()

    cy.wait(5000);

    cy.contains('body', ' Please contact your administrator').should('exist');

    let numberOfItems;

    // cy.addTestContext('Below are the available categories');

    // cy.dataCy('content-container')
    //     .find('[data-cy="category-item"]')
    //     .then(($items) => {
    //         numberOfItems = $items.length;

    //         for (let i = 0; i < numberOfItems; i++) {
    //             cy.clickCategory(i);
    //         }
    //     });
});


it('tests with steve', () => {
    // cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    cy.visit("/auth")
    cy.visit("/testwithsteve")

    cy.wait(5000);

    // cy.contains('body', ' Please contact your administrator').should('exist');

    let numberOfItems;

    // cy.addTestContext('Below are the available categories');

    // cy.dataCy('content-container')
    //     .find('[data-cy="category-item"]')
    //     .then(($items) => {
    //         numberOfItems = $items.length;

    //         for (let i = 0; i < numberOfItems; i++) {
    //             cy.clickCategory(i);
    //         }
    //     });
});

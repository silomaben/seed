import '../support/commands';

it('confirm dashboard content area contains all the categories and redirects to respective pages  onclick.', () => {
    cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    cy.wait(4000);

    let numberOfItems;

    cy.addTestContext('Below are the available categories');

    cy.dataCy('content-container')
        .find('[data-cy="category-item"]')
        .then(($items) => {
            numberOfItems = $items.length;

            for (let i = 0; i < numberOfItems; i++) {
                cy.clickCategory(i);
            }
        });
});

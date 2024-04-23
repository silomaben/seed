declare namespace Cypress {
    interface Chainable<Subject = any> {
        login(email: string, password: string): void;
        dataCy(value: string): Chainable<any>;
        clickCategory(index: number): Chainable<any>;
        processPage(currentPage: number, totalPages: number): Chainable<any>;
        handlePagination(processPage: any): Chainable<any>;
    }
    // interface Chainable<Subject = any> {
    //     login(email: string, password: string): void;
    // }
}

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/auth');

    cy.wait(9000);

    cy.get('button[class="p-ripple p-element p-button p-component"]').click();

    const args = { email, password };

    cy.origin(
        'https://dev-qtn1vptw.us.auth0.com',
        { args },
        ({ email, password }) => {
            cy.get('#username').type(email);

            Cypress.config('pageLoadTimeout', 6000);
            cy.get('input[name="password"]')
                .type(password)

                .get('button[type="submit"][name="action"][value="default"]')
                .click();
        }
    );
});

Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('clickCategory', (index) => {
    return cy.dataCy('content-container').each(($container) => {
        const categoryItems = $container.find('[data-cy=category-item]');

        // Check if the index is within the bounds of categoryItems
        if (index < categoryItems.length) {
            const clickedItem = categoryItems.eq(index);

            const titleText = clickedItem
                .find('[data-cy=category-item-title]')
                .text();

            cy.addTestContext(titleText);
            cy.wrap(categoryItems.eq(index)).click();
            cy.wait(2000);
            cy.go('back');
            return;
        }
    });
});


Cypress.Commands.add(
    'handlePagination',
    (processPage: any) => {
        cy.get('span.p-paginator-pages.ng-star-inserted button')
            .its('length')
            .then((totalPages: number) => {
                console.log(`Total pages: ${totalPages}`);
                processPage(1, totalPages);
            });
    }
);


// Cypress.Commands.add(
//     'processPage',
//     (currentPage: number, totalPages: number, column: number) => {
//         const nextPageButton =
//             'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

//         console.log(`Processing page ${currentPage}`);

//         cy.get('.p-datatable-tbody tr').each((row, index) => {
//             const name = row.find('td:nth-child(3)').text();
//             cy.wrap(row)
//                 .find(`td:nth-child(${column})`)
//                 .click()
//                 .get('.p-dialog-header-icon')
//                 .click()
//                 .then(() => {
//                     console.log(`viewing logs for ${name}`);
//                 });
//         });

//         if (currentPage < totalPages) {
//             // Click the next page button
//             cy.wait(4000).get(nextPageButton).click();

//             // Wait for the next page to load (you may need to adjust the timeout based on your application)
//             cy.wait(6000).then(() => {
//                 // Process the next page recursively
//                 cy.processPage(currentPage + 1, totalPages, column);
//             });
//         } else {
//             console.log('------------------');
//         }
//     }
// );

       
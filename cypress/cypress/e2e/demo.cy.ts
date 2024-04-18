import '../support/commands';

describe('user management', () => {
    beforeEach('', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    });

    it.only('test filter functionality', () => {
        cy.wait(6000);

        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        cy.get('.p-datatable-tbody')
            .find('tr')
            .each(($row, index) => {
                if (index < 4) {
                    const nickName = $row.find('td:nth-child(2)').text().trim();

                    cy.log(`Searching for nickName: ${nickName}`);

                    cy.dataCy('search-box').type(nickName);
                    cy.dataCy('search-btn').click();

                    cy.wait(6000);

                    // Assertion: Check if the table contains only the filtered user's data
                    cy.get('.p-datatable-tbody')
                        .find('tr')
                        .should(($filteredRows) => {
                            expect(
                                $filteredRows
                                    .eq(0)
                                    .find('td:nth-child(2)')
                                    .text()
                                    .trim()
                            ).to.equal(nickName);
                        });

                    cy.dataCy('reset-btn').click();

                    cy.wait(6000);
                }
            });

        // .find('td:nth-child(2)')
        // .then(($elements) => {
        //     for (let i = 0; i < 2; i++) {
        //         const nickName = $elements.eq(i).text().trim();

        //         cy.dataCy('search-box').type(nickName);
        //         cy.dataCy('search-btn').click();
        //         cy.wait(6000);

        //         cy.get('.p-datatable-tbody')
        //             .find('tr')
        //             .find('td:nth-child(2)')
        //             .eq(i)
        //             .invoke('text')
        //             .then((tableText) => {
        //                 console.log(tableText.trim());
        //                 expect(tableText.trim()).to.contain(nickName);
        //             });

        //         cy.wait(6000);

        //         cy.dataCy('reset-btn').click()
        //     }
        // });
    });
});

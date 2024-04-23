import '../support/commands';

describe('Categories questions', () => {
    beforeEach('', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    });

    it('a category should contain questions and the question card should contain an image, title, subtitle, and an ellipsis with  view, edit and delete options.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-tns-c2338333015-3.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-3'
        )
            .should('contain', 'Categories')
            .should('be.visible')
            .click();
        // Store the selector for dashboard items
        const dashboardItemSelector =
            '.ng-trigger > li > .ng-tns-c2338333015-5 > .ng-trigger .ng-star-inserted';
        const processedItems: any = new Set();
        // Get all menu items and iterate over them
        cy.get(dashboardItemSelector).each(($el, i) => {
            // Extract the text of the menu item
            const menuItemText = $el.text().trim();
            if (processedItems.has(menuItemText)) {
                cy.log(`Skipping already processed item: ${menuItemText}`);
            } else {
                // if (menuItemText === 'Travel') {
                // / Click on the current menu item
                cy.wait(6000);
                cy.wrap($el).click();
                cy.wait(6000);
                cy.get('.grid.dashboard-list')
                    .should('exist')
                    .then(($gridList) => {
                        const card_ = $gridList.get();
                        const QuestionCard = card_[0].children[0]?.innerHTML;
                        if (!QuestionCard?.includes('app-dashboard-card')) {
                            console.log(`The ${menuItemText} is empty`);
                        } else {
                            console.log(`Dashboard ${menuItemText} is full`);
                            cy.get('app-dashboard-card').each(($card) => {
                                if ($card.length > 0) {
                                    cy.wrap($card)
                                        .find('.p-element.text-xl.font-bold')
                                        .should('exist')
                                        .should('be.visible');
                                    cy.wrap($card)
                                        .find('img')
                                        .should('exist')
                                        .should('be.visible');
                                    cy.wrap($card)
                                        .find('.p-element.mb-2')
                                        .should('exist')
                                        .should('be.visible');
                                    cy.wrap($card)
                                        .find('.pi-ellipsis-v')
                                        .should('exist')
                                        .should('be.visible');
                                }
                            });
                        }
                    });
                processedItems.add(menuItemText);
            }
        });
        cy.log(processedItems);
    });

    it.only('should check user management can search functionality and reset filters', () => {
        cy.wait(6000);

        cy.get('.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted')
            .should('contain', 'User Management')
            .click();

        cy.wait(4000);

        cy.get('.p-datatable-tbody')
            .find('tr')
            .find('td:nth-child(2)')
            .then(($elements) => {
                for (let i = 0; i < 2; i++) {
                    const nickName = $elements.eq(i).text().trim();


                    cy.dataCy('search-box').type(nickName);
                    cy.dataCy('search-btn').click();
                    cy.wait(6000);

                    cy.get('.p-datatable-tbody')
                        .find('tr')
                        .find('td:nth-child(2)')
                        .eq(i)  
                        .invoke('text')
                        .then((tableText) => {
                            console.log(tableText.trim());
                            expect(tableText.trim()).to.contain(nickName);
                        });

                    cy.wait(6000);

                    cy.dataCy('reset-btn').click();

                }
            });

    });
});

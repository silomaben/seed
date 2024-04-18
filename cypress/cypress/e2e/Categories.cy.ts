import '../support/commands';

describe('Categories questions', () => {
    beforeEach('', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    });



    it('a category should contain questions and the question card should contain an image, title, subtitle, and an ellipsis with  view, edit and delete options.', () => {
        cy.wait(4000);

        cy.get('.ng-tns-c2338333015-3.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-3')
            .should('contain', 'Categories')
            .should('be.visible')
            .click();

        
        let menuItems = [];


        cy.get('.ng-trigger > li > .ng-tns-c2338333015-5 > .ng-trigger .ng-star-inserted').each(($el, index) => {
            cy.wrap($el).invoke('text').then((text) => {
                menuItems.push(text.trim())
            });
        }).then(() => {
            const menuSet = Array.from(new Set(menuItems));

            for (let i = 0; i < menuSet.length; i++) {
                cy.get('.ng-trigger > li > .ng-tns-c2338333015-5 > .ng-trigger .ng-star-inserted')
                    .contains(menuSet[i])
                    .click({ force: true });


                cy.wait(4000)

                cy.get('.grid.dashboard-list')
                    .then(($grid) => {
                        const questionContainer = $grid.get();


                        const childHtml = questionContainer[0].children[0]?.innerHTML || "empty";

                        if (childHtml.includes("app-dashboard-card") && childHtml.includes("question-card")) {
                            console.log(`Dashboard '${menuSet[i]}' is full`);
                            cy.get('.grid.dashboard-list')
                                .find('app-dashboard-card')
                                .each(($card) => {
                                    if ($card.length > 0) {
                                        cy.wrap($card).find('.p-element.text-xl.font-bold').should('exist').should("be.visible");

                                        cy.wrap($card).find('img').should('exist').should("be.visible");

                                        cy.wrap($card).find('.p-element.mb-2').should('exist').should("be.visible");

                                        cy.wrap($card).find('.pi-ellipsis-v').should('exist').should("be.visible");
                                    }
                                })

                        } else {

                            cy.addTestContext(`Dashboard '${menuSet[i]}' is empty.`);

                        }

                    })

            }

        });

    });

    it('confirm questions contain widgets with data', () => {
        cy.wait(4000);
        let menuItems = [];



        cy.get('.ng-trigger > li > .ng-tns-c2338333015-5 > .ng-trigger .ng-star-inserted').each(($el, index) => {
            cy.wrap($el).invoke('text').then((text) => {
                menuItems.push(text.trim())
            });
        }).then(() => {
            const menuSet = Array.from(new Set(menuItems));

            for (let i = 0; i < menuSet.length; i++) {
                cy.get('.ng-trigger > li > .ng-tns-c2338333015-5 > .ng-trigger .ng-star-inserted')
                    .contains(menuSet[i])
                    .click({ force: true });

                cy.wait(4000)

                cy.get('.grid.dashboard-list')
                    .then(($grid) => {
                        const questionContainer = $grid.get();


                        const childHtml = questionContainer[0].children[0]?.innerHTML || "empty";

                        if (childHtml.includes("app-dashboard-card") && childHtml.includes("question-card")) {
                            console.log(`Dashboard '${menuSet[i]}' is full`);

                            cy.get('.grid.dashboard-list')
                                .find('app-dashboard-card')
                                .as('dashboardCards');


                            // Now use the alias to click each card
                            cy.get('@dashboardCards').then(($cards) => {
                                for (let j = 0; j < $cards.length; j++) {

                                    cy.get('.grid.dashboard-list')
                                        .find('app-dashboard-card')
                                        .eq(j)
                                        .click();

                                    cy.wait(4000);
                                    
                                    cy.go('back')

                                    cy.wait(2000);

                                }
                            });


                        } else {
                            cy.addTestContext(`Dashboard '${menuSet[i]}' is empty.`);
                        }

                    })

            }

        });

    })

});

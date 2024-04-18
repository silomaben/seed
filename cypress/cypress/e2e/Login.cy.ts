// import { beforeEach  from "cypress";
import '../support/commands';

describe('Login Test', () => {
    it('should log in successfully', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
        cy.url().should('include', '/dashboard');
    });

    it('Should return error when the input fields are empty and the submit button is clicked.', () => {

        cy.visit('/auth');

        cy.get(
            'button[class="p-ripple p-element p-button p-component"]'
        ).click();
        cy.origin('https://dev-qtn1vptw.us.auth0.com', () => {
            cy.get('button[type="submit"][name="action"][value="default"]').click();

            cy.get('#username')
                .invoke('prop', 'validationMessage')
                .should('equal', 'Please fill out this field.');
        });
    });

    it('Should return error message for invalid email.', () => {
        cy.login('invalidEmail', `${Cypress.env('QA_PASSWORD')}`);
        cy.origin('https://dev-qtn1vptw.us.auth0.com', () => {
            cy.get('#error-element-password').should(
                'contain',
                'Wrong email or password'
            );
        });
    });

    it('Should return error message for invalid password.', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, 'invalid_password');
        cy.origin('https://dev-qtn1vptw.us.auth0.com', () => {
            cy.get('#error-element-password').should(
                'contain',
                'Wrong email or password'
            );
        });
    });

    it('Should return error message for invalid email and password.', () => {
        cy.login('Wrong Password', 'Wrong Password');
        cy.origin('https://dev-qtn1vptw.us.auth0.com', () => {
            cy.get('#error-element-password').should(
                'contain',
                'Wrong email or password'
            );
        });
    });
});

describe('Dashboard', () => {
    beforeEach('', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    });

    it('Confirm Sidebar contains all major page listing', () => {
        const dashboards = [
            'Dashboard',
            'Categories',
            'Filter',
            'Hotel',
            'User Management',
        ];

        dashboards.forEach((dashboard) => {
            cy.wait(6000)
            cy.get('.layout-sidebar')
                .should('contain', dashboard)
                .should('be.visible')
                .click();

            cy.log('checking ' + dashboard);
        });
    });

    it('confirm items exist in the categories dropdown on the sidebar', () => {
        cy.wait( 6000)
        cy.get('a.ng-tns-c3199753540-5')
            .should('contain', 'Categories')
            .should('be.visible')
            .click();

                cy.get('app-menu-item.ng-tns-c3199753540-5').each(
                    ($el, index) => {
                        cy.get('app-menu-item.ng-tns-c3199753540-5 > ul').click(
                            {
                                multiple: true,
                            }
                        );
                        const itemText = $el.text().trim();

                        
                        const itemList = [];
                        itemList.push(itemText);
                        
                        cy.log('Extracted Item:', itemList);

                        cy.wait(4000);

                        cy.log("------", cy.url())

                        // cy.log(`${index + 1}:`, $el.text());
                    }
                );
    });
});

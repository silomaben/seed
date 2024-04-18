import '../support/commands';

describe('Sidebar', () => {
    beforeEach('', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    });

    it('confirm major items exist on sidebar', () => {
        const dashboards = [
            'Dashboard',
            'Categories',
            'Filter',
            'Hotel',
            'User Management',
        ];

        dashboards.forEach((dashboard) => {
            cy.wait(6000);

            cy.get('.layout-sidebar')
                .should('contain', dashboard)
                .should('be.visible')
                .click();

            cy.log('checking ' + dashboard);
        });
    });

    it('confirm Categories exist in the categories dropdown on the sidebar', () => {
        cy.wait(6000);
        cy.get('a.ng-tns-c3199753540-5')
            .should('contain', 'Categories')
            .should('be.visible')
            .click();
        cy.addTestContext('Below are the available Categories');
        cy.get('app-menu-item.ng-tns-c3199753540-5').each((el, index) => {
            cy.addTestContext(`${el.text()}`);
            cy.get('app-menu-item.ng-tns-c3199753540-5 > ul').click({
                multiple: true,
            });
            const itemText = el.text().trim();

            const itemList = [];
            itemList.push(itemText);

            cy.log('Extracted Item:', itemList);

            cy.wait(4000);

            cy.log('------', cy.url());
        });
    });

    it('Confirm all expected filters are available . (Travel Type, Year, Period, Expense Type, Department, Destination Country)', () => {
        cy.wait(6000);
        cy.get(
            '.ng-tns-c3199753540-3.ng-tns-c3199753540-6.ng-star-inserted > a'
        )
            .should('be.visible', 'Filter')
            .click();
        
        cy.addTestContext('Below are the available Filters');

        cy.fixture('data.json').then((jsonData) => {
            const filterItems = jsonData.filters;
            cy.log(filterItems);

            filterItems.forEach((filterItem: string) => {
                cy.get(
                    '.ng-tns-c3199753540-3.ng-tns-c3199753540-6.ng-star-inserted > ul'
                )
                    .should('contain', filterItem)
                    .should('be.visible');

                cy.addTestContext(filterItem);
            });
        });
    });

    it('Confirm that you the button opens a new tab and navigates to the site with the following address', () => {
        cy.wait(6000);
        cy.get(
            '.ng-tns-c3199753540-20.ng-tns-c3199753540-21.ng-star-inserted > a'
        )
            .should('be.visible', 'Hotel')
            .click();

        cy.get(
            '.ng-tns-c3199753540-20.ng-tns-c3199753540-21.ng-star-inserted > a'
        )
            .should('be.visible', 'Hotel')
            .should('have.attr', 'href')
            .and('include', 'https://cerebriai.hotelplanner.com/');
    });
});

import '../support/commands';

describe('Profile', () => {
    beforeEach('', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    });

    it('confirm edit user updates ser data sucessfully', () => {
        cy.wait(6000)
        cy.contains('Dashboard').click()
        cy.wait(2000)

        cy.get('.layout-topbar-menu > .p-link').click({ force: true });

        cy.get(':nth-child(1) > .p-menuitem-link').click()

        cy.get('p-button.p-element > .p-ripple').click()


        cy.get('#name').should('exist').invoke('val').then((text) => {
                const updatedUsername = text + '.';
                cy.get('#name').clear().type(updatedUsername);
            });

        cy.get('#nickname').should('exist').invoke('val').then((text) => {
                const updatedNickname = text + '.';
                cy.get('#nickname').clear().type(updatedNickname);
            });


        cy.get('[label="Save"] > .p-ripple').click();

        cy.get('.p-toast-message-content').should('exist').invoke('text').should('contains', 'Profile updated');

        cy.wait(2000)

        cy.get('p-button.p-element > .p-ripple').click()


        cy.get('#name').should('exist').invoke('val').then((text) => {
            const nameWithoutFullStop = (text as string).replace(/\.$/, '');
            cy.get('#name').clear().type(nameWithoutFullStop);
        });

        cy.get('#nickname').should('exist').invoke('val').then((text) => {
            const nicknameWithoutFullStop = (text as string).replace(/\.$/, '')
            cy.get('#nickname').clear().type(nicknameWithoutFullStop);
        });

        cy.get('[label="Save"] > .p-ripple').click();
        cy.get('.p-toast-message-content').should('exist').invoke('text').should('contains', 'Profile updated');


    })

    it.only('confirm email field has data validation implemented as expected', () => {
        cy.wait(6000)
        cy.contains('Dashboard').click()
        cy.wait(2000)

        cy.get('.layout-topbar-menu > .p-link').click({ force: true });

        cy.get(':nth-child(1) > .p-menuitem-link').click()

        cy.get('p-button.p-element > .p-ripple').click()

        cy.get('#email').should('exist').invoke('val').then((text) => {
            const originalEmail = text;
            
            cy.get('#email').clear().type('test.email');
            cy.get('[label="Save"] > .p-ripple').click();

            cy.get('.p-toast-message-content').should('exist').invoke('text').should('contains', 'email must be an email');
            
            cy.get('#email').clear().type('@cerebri.com');
            cy.get('[label="Save"] > .p-ripple').click();

            cy.get('.p-toast-message-content').should('exist').invoke('text').should('contains', 'email must be an email');
            
            cy.get('#email').clear().type('email@cerebri');
            cy.get('[label="Save"] > .p-ripple').click();

            cy.get('.p-toast-message-content').should('exist').invoke('text').should('contains', 'email must be an email');
        });

    })
})
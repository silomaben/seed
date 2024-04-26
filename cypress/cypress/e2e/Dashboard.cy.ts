import '../support/commands';

it('visit auth page', () => {
    cy.visit("/auth")

    cy.get('button[class="p-ripple p-element p-button p-component"]').click();

    cy.url().then((url) => {
        cy.log('Current URL:', url);
    });
    

    cy.wait(2000);

});


it('visit /', () => {
    cy.visit("/")

    cy.get('button[class="p-ripple p-element p-button p-component"]').click();

    cy.url().then((url) => {
        cy.log('Current URL:', url);
    });
    

    cy.wait(2000);
});

it('visit nonexistent page', () => {
    cy.visit("/testwithsteve")

    cy.get('button[class="p-ripple p-element p-button p-component"]').click();

    cy.url().then((url) => {
        cy.log('Current URL:', url);
    });
    

    cy.wait(2000);
});

it('visit auth page of deployed ui', () => {

    let email = "benard.masikonde@cerebriai.com"

    let password = "Password123"

    const args = { email, password };
    cy.origin(
        'https://atq.cerebri.systems/atq2/auth',
        { args },
        ({ email, password }) => {
            cy.wait(2000)
            // cy.get('#username').type(email);

            // Cypress.config('pageLoadTimeout', 6000);
            // cy.get('input[name="password"]')
            //     .type(password)

            //     .get('button[type="submit"][name="action"][value="default"]')
            //     .click();
        }
    );
});


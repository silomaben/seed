import '../support/commands';

describe('User Management data and field validations', () => {
    beforeEach('login before each test case is run.', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    });

    it('Verify the User management dashboard contains 9 columns, input field, search button, reset button and add user button', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.get('input[type="text"]').should('be.empty');

        cy.get('p-button[label="Search"]')
            .should('be.visible')
            .contains('Search');

        //  check if the search icon is visible
        cy.get('.pi.pi-search').should('be.visible');

        cy.get('p-button[label="Reset"]')
            .should('be.visible')
            .contains('Reset');

        cy.get('p-button[label="Add User"]')
            .should('be.visible')
            .contains('Add User');

        //  check if the search icon is visible
        cy.get('.pi.pi-plus').should('be.visible');
    });

    it('Confirm that the table has 9 columns', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.fixture('data.json').then((jsonData) => {
            const userHeaders = jsonData['user-headers'];

            userHeaders.forEach((userHeader: any) => {
                cy.log('title => ', userHeader);
                cy.dataCy('table-headers').should('contain', userHeader);
            });
        });
    });

    it('Confirm that the picture column contains data of “IMG “ formats.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        cy.get('td p-avatar div').each((avatar, index) => {
            const imgTag = avatar.find('img');

            // Assert that the img tag exists within the avatar
            expect(imgTag).to.exist;

            // Log a message indicating whether the img tag was found
            if (imgTag.length > 0) {
                cy.log('The avatar contains an img tag.');
            } else {
                cy.log('No img tag found within the avatar.');
                cy.addTestContext(
                    `No img tag found within the avatar at position ${index}`
                );
            }
        });
    });

    it('Confirm that the Email column contains data on email formats.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button[class="p-ripple p-element p-paginator-next p-paginator-element p-link"]';

        function numberOfPages(): Cypress.Chainable<number> {
            return cy
                .get('span[class="p-paginator-pages ng-star-inserted"]')
                .find('button')
                .its('length')
                .then((length) => length);
        }

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody')
                .find('tr')
                .find('td:nth-child(4)')
                .each((text) => {
                    const cellContent = text.text().trim();

                    //   Use a regular expression to check if the content is in email format
                    const isEmail =
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                            cellContent
                        );

                    // Log the result of the check
                    if (isEmail) {
                        console.log(
                            `Email format for: ${cellContent} is valid`
                        );
                        // You can perform further assertions or actions for valid emails here
                    } else {
                        console.log(
                            `Email format for: ${cellContent} is invalid`
                        );
                        cy.addTestContext(
                            `Email format for: ${cellContent} is invalid`
                        );

                        // You can handle invalid email formats here
                    }
                });

            // Check if the current page is the last page
            if (currentPage < totalPages) {
                // Click the next page button
                cy.get(nextPageButton).click();

                // Wait for the next page to load (you may need to adjust the timeout based on your application)
                cy.wait(6000).then(() => {
                    // Process the next page recursively
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('Reached the last page. Iteration complete.');
            }
        };
        cy.handlePagination(processPage);
    });

    it('should check user management can search functionality and reset filters', () => {
        cy.wait(6000);

        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
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

                    cy.wait(2000);

                    cy.dataCy('reset-btn').click();
                }
            });
    });

    it('Confirm that the Login column contains data of date / datetime formats.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button[class="p-ripple p-element p-paginator-next p-paginator-element p-link"]';

        function numberOfPages(): Cypress.Chainable<number> {
            return cy
                .get('span[class="p-paginator-pages ng-star-inserted"]')
                .find('button')
                .its('length')
                .then((length) => length);
        }

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody')
                .find('tr')
                .each((row) => {
                    const name = row.find('td:nth-child(4)').text().trim();
                    const date = row.find('td:nth-child(6)').text().trim();

                    const isDate =
                        /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}$/.test(
                            date
                        );

                    if (date != '') {
                        if (isDate) {
                            console.log(`The date for ${name} is valid.`);
                        } else {
                            cy.addTestContext(
                                `The date for ${name} is invalid.`
                            );
                        }
                    } else {
                        cy.addTestContext(`The date for ${name} is empty`);
                    }
                });
            // Check if the current page is the last page
            if (currentPage < totalPages) {
                // Click the next page button
                cy.get(nextPageButton).click();

                // Wait for the next page to load (you may need to adjust the timeout based on your application)
                cy.wait(6000).then(() => {
                    // Process the next page recursively
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('Reached the last page. Iteration complete.');
            }
        };

        cy.handlePagination(processPage);
    });

    it('Confirm that the Last IP column contains data of IP address format and can be hovered over.', () => {
        cy.wait(6000);

        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const isBasicIp =
            /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                const name = row.find('td:nth-child(4)').text().trim();
                cy.wrap(row)
                    .find('td:nth-child(7)')
                    .invoke('attr', 'ng-reflect-text')
                    .then((ipConfigs: string) => {
                        console.log(ipConfigs);

                        // ipConfigs = ipConfigs.trim();

                        if (ipConfigs == undefined) {
                            cy.addTestContext(
                                `Last Ip for ${name} is not present!`
                            );
                        } else {
                            if (isBasicIp.test(ipConfigs)) {
                                console.log(
                                    `Basic IP address ${ipConfigs} format for ${name} is valid.`
                                );
                                // You can perform further assertions or actions for valid IP addresses here
                            } else {
                                console.log(
                                    `IP address ${ipConfigs} for ${name} does not conform IP address format`
                                );
                                // You can handle invalid formats here
                            }
                            console.log('not empty');
                        }
                    });
            });

            // Check if the current page is the last page
            if (currentPage < totalPages) {
                // Click the next page button
                cy.get(nextPageButton).click();

                // Wait for the next page to load (you may need to adjust the timeout based on your application)
                cy.wait(6000).then(() => {
                    // Process the next page recursively
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('Reached the last page. Iteration complete.');
            }
        };

        cy.handlePagination(processPage);
    });

    it('Confirm that the Logs column contains “View Logs” text and is clickable across all rows.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                const name = row.find('td:nth-child(3)').text();
                cy.wrap(row)
                    .find('td:nth-child(8)')
                    .click()
                    .get('.p-dialog-header-icon')
                    .click()
                    .then(() => {
                        console.log(`viewing logs for ${name}`);
                    });
            });

            if (currentPage < totalPages) {
                // Click the next page button
                cy.wait(4000).get(nextPageButton).click();

                // Wait for the next page to load (you may need to adjust the timeout based on your application)
                cy.wait(6000).then(() => {
                    // Process the next page recursively
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('------------------');
            }
        };

        // const handlePagination = () => {
        //     cy.get('span.p-paginator-pages.ng-star-inserted button')
        //         .its('length')
        //         .then((totalPages: number) => {
        //             console.log(`Total pages: ${totalPages}`);
        //             processPage(1, totalPages);
        //         });
        // };

        cy.handlePagination(processPage);
    });
});

describe('User Management action buttons', () => {
    beforeEach('login before each test case is run.', () => {
        cy.login(`${Cypress.env('QA_EMAIL')}`, `${Cypress.env('QA_PASSWORD')}`);
    });

    it('Confirm that it has Edit, Reset Password, and Delete Items existing in the dropdown and are clickable.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                const name = row.find('td:nth-child(3)').text();
                cy.wrap(row).find('td:nth-child(9)').click();

                cy.get(':nth-child(1) > .p-menuitem-link')
                    .contains('Edit')
                    .then((edit) => {
                        if (!edit)
                            cy.addTestContext(
                                `The edit button for ${name} is broken`
                            );
                    })
                    .get(':nth-child(2) > .p-menuitem-link')
                    .then((edit) => {
                        if (!edit)
                            cy.addTestContext(
                                `The edit button for ${name} is broken`
                            );
                    })
                    .contains('Reset Password')
                    .get(':nth-child(3) > .p-menuitem-link')
                    .contains('Delete')
                    .then((edit) => {
                        if (!edit)
                            cy.addTestContext(
                                `The edit button for ${name} is broken`
                            );
                    });

                cy.get('.p-datatable-tbody tr')
                    .eq(index) // Navigate back to the original row if needed
                    .find('td:nth-child(9)')
                    .click();
            });

            if (currentPage < totalPages) {
                cy.wait(4000).get(nextPageButton).click();
                cy.wait(6000).then(() => {
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('------------------');
            }
        };

        cy.handlePagination(processPage);
    });

    it('Confirm that a modal is displayed.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                const name = row.find('td:nth-child(3)').text();
                cy.wrap(row).find('td:nth-child(9)').click();

                cy.get(':nth-child(1) > .p-menuitem-link')
                    .contains('Edit')
                    .then((edit) => {
                        if (!edit)
                            cy.addTestContext(
                                `The edit button for ${name} is broken`
                            );
                    })
                    .click();
                cy.get("div[role='dialog']")
                    .should('be.visible')
                    .get('.p-dialog-header-icon')
                    .click();
            });

            if (currentPage < totalPages) {
                cy.wait(4000).get(nextPageButton).click();
                cy.wait(6000).then(() => {
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('------------------');
            }
        };

        cy.handlePagination(processPage);
    });

    it('Confirm that the Modal Contains the user profile icon, last login, login count, last ip and user id.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                if (index < 2) {
                    const name = row.find('td:nth-child(3)').text();
                    cy.wrap(row).find('td:nth-child(9)').click();

                    cy.get(':nth-child(1) > .p-menuitem-link')
                        .contains('Edit')
                        .then((edit) => {
                            if (!edit)
                                cy.addTestContext(
                                    `The edit button for ${name} is broken`
                                );
                        })
                        .click();

                    cy.get("div[role='dialog']")
                        .should('be.visible')
                        .find('div.col.w-full')
                        .dataCy('user-icon')
                        .find('img');

                    cy.get("div[role='dialog']")
                        .should('be.visible')
                        .find('div.col.w-full > .mt-3 > div')
                        .each((item) => {
                            const itemx = Cypress.$(item)
                                .find('.col-4')
                                .text()
                                .trim();
                            const itemy = Cypress.$(item)
                                .find('.col-8')
                                .text()
                                .trim();
                            if (!itemy) {
                                cy.addTestContext(
                                    `${itemx} for ${name} is empty!`
                                );
                            }
                        });

                    cy.get('.p-dialog-header-icon').click();
                }
            });

            if (currentPage < totalPages) {
                cy.wait(4000).get(nextPageButton).click();
                cy.wait(6000).then(() => {
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('------------------');
            }
        };

        cy.handlePagination(processPage);
    });

    it('Confirm all input fields exist and are editable.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                if (index < 2) {
                    const nickName = row.find('td:nth-child(2)').text();
                    const name = row.find('td:nth-child(3)').text();
                    const email = row.find('td:nth-child(4)').text();
                    cy.wrap(row).find('td:nth-child(9)').click();

                    cy.get(':nth-child(1) > .p-menuitem-link')
                        .contains('Edit')
                        .then((edit) => {
                            if (!edit)
                                cy.addTestContext(
                                    `The edit button for ${name} is broken`
                                );
                        })
                        .click();

                    cy.get("div[role='dialog']")
                        .should('be.visible')
                        .find('.my-3')
                        .should('exist')
                        .find('.flex')
                        .each((item, index) => {
                            if (index < 3) {
                                const label = item
                                    .find('span label')
                                    .text()
                                    .trim();
                                if (label == 'Nickname') {
                                    const input = item.find('span input');
                                    input.val(nickName);
                                    input.trigger('input');
                                    console.log(`${label} : ${nickName}`);
                                } else if (label == 'Name') {
                                    const input = item.find('span input');
                                    input.val(name);
                                    input.trigger('input');
                                    console.log(`${label} : ${name}`);
                                } else if (label == 'Email') {
                                    const input = item.find('span input');
                                    input.val(email);
                                    input.trigger('input');
                                    console.log(`${label} : ${email}`);
                                } else {
                                    console.log('no label found');
                                }
                            }
                        });

                    cy.get('.p-dialog-header-icon').click();
                }
            });

            if (currentPage < totalPages) {
                cy.wait(4000).get(nextPageButton).click();
                cy.wait(6000).then(() => {
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('------------------');
            }
        };

        cy.handlePagination(processPage);
    });

    it('Confirm that the modal contains departments and are listed in the drop-down', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                if (index < 2) {
                    const name = row.find('td:nth-child(3)').text();
                    cy.wrap(row).find('td:nth-child(9)').click();

                    cy.get(':nth-child(1) > .p-menuitem-link')
                        .contains('Edit')
                        .then((edit) => {
                            if (!edit)
                                cy.addTestContext(
                                    `The edit button for ${name} is broken`
                                );
                        })
                        .click();

                    cy.get("div[role='dialog']")
                        .should('be.visible')
                        .find('.my-3')
                        .should('exist')
                        .find('.flex')
                        .each((item, index) => {
                            if (index == 3) {
                                const label = item
                                    .find('span label')
                                    .text()
                                    .trim();
                                expect(label).to.contain('Department');
                                cy.get(
                                    '.w-full.p-dropdown.p-component'
                                ).click();
                                console.log('department clicked');
                                const departments = ['cerebri', 'sales', 'all'];
                                departments.forEach((department) => {
                                    cy.get('#pr_id_11_list > p-dropdownitem')
                                        .should('contain', department)
                                        .should('be.visible');
                                    cy.log('checking ' + department);
                                });
                            }
                        });

                    cy.get('.p-dialog-header-icon').click();
                }
            });

            if (currentPage < totalPages) {
                cy.wait(4000).get(nextPageButton).click();
                cy.wait(6000).then(() => {
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('------------------');
            }
        };

        cy.handlePagination(processPage);
    });

    it('Confirm that the modal contains the three roles, ie. cerebri-admin, admin, and user and are clickable.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                if (index < 2) {
                    const name = row.find('td:nth-child(3)').text();
                    cy.wrap(row).find('td:nth-child(9)').click();

                    cy.get(':nth-child(1) > .p-menuitem-link')
                        .contains('Edit')
                        .then((edit) => {
                            if (!edit)
                                cy.addTestContext(
                                    `The edit button for ${name} is broken`
                                );
                        })
                        .click();

                    cy.get("div[role='dialog']")
                        .should('be.visible')
                        .find('.my-3')
                        .should('exist')
                        .find('.flex')
                        .each((item, index) => {
                            if (index == 4) {
                                const label = item
                                    .find('span label')
                                    .text()
                                    .trim();
                                expect(label).to.contain('Roles');
                                const roles = [
                                    'admin',
                                    'cerebri-admin',
                                    'user',
                                ];
                                roles.forEach((role) => {
                                    cy.get(
                                        '.p-selectbutton.p-buttonset.p-component'
                                    )
                                        .find('div[role="button"]')
                                        .contains(role)
                                        .should('be.visible');
                                    cy.log('checking ' + role);
                                });
                            }
                        });

                    cy.get('.p-dialog-header-icon').click();
                }
            });

            if (currentPage < totalPages) {
                cy.wait(4000).get(nextPageButton).click();
                cy.wait(6000).then(() => {
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('------------------');
            }
        };

        cy.handlePagination(processPage);
    });

    it('Confirm that the modal contains cancel and save buttons and are clickable.', () => {
        cy.wait(6000);
        cy.get(
            '.ng-trigger > :nth-child(2) > .ng-tns-c2338333015-20 > .ng-star-inserted'
        )
            .should('contain', 'User Management')
            .click();

        cy.wait(6000);

        const nextPageButton =
            'button.p-ripple.p-element.p-paginator-next.p-paginator-element.p-link';

        const processPage = (currentPage: number, totalPages: number) => {
            console.log(`Processing page ${currentPage}`);

            cy.get('.p-datatable-tbody tr').each((row, index) => {
                if (index < 2) {
                    const name = row.find('td:nth-child(3)').text();
                    cy.wrap(row).find('td:nth-child(9)').click();

                    cy.get(':nth-child(1) > .p-menuitem-link')
                        .contains('Edit')
                        .then((edit) => {
                            if (!edit)
                                cy.addTestContext(
                                    `The edit button for ${name} is broken`
                                );
                        })
                        .click();

                    cy.get("div[role='dialog']")
                        .should('be.visible')
                        .find('.my-3')
                        .should('exist')
                        .find('.flex')
                        .each((item, index) => {
                            if (index == 5) {
                                const buttons = ['Cancel', 'Save'];
                                buttons.forEach((button) => {
                                    cy.get('.flex.justify-content-end.mt-4')
                                        .find('p-button')
                                        .contains(button)
                                        .should('be.visible');
                                    cy.log('checking ' + button);
                                });
                            }
                        });

                    cy.get('.p-dialog-header-icon').click();
                }
            });

            if (currentPage < totalPages) {
                cy.wait(4000).get(nextPageButton).click();
                cy.wait(6000).then(() => {
                    processPage(currentPage + 1, totalPages);
                });
            } else {
                console.log('------------------');
            }
        };

        cy.handlePagination(processPage);
    });
});

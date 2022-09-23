import * as sourceData from '../../fixtures/source.json'
import * as contentData from '../../fixtures/contentitem.json'

describe('Add Learning Content', function () {
    it('Successfully adding and deleting learning content', function () {

        //LOGIN PROCESS

        cy.visit('http://localhost:8081/');
        cy.url().should('include', 'http://localhost:8081/login');

        const innentialAdmin = Cypress.config('innentialAdmin');

        cy.get('[placeholder="email"]')
            .type(innentialAdmin.email)
            .should('have.value', innentialAdmin.email);

        cy.get('[placeholder="password"]')
            .type(innentialAdmin.password)
            .should('have.value', innentialAdmin.password);

        cy.get('[type="submit"').contains('Submit').click();

        cy.contains('Login successful').should('exist');

        cy.get('.el-menu-item').contains('Sources').click();
        cy.get('.el-table__row').then(row => {
            if (!row.find('.cell').text().includes('test_source')) {
                cy.get('.el-button.el-button--primary').contains('Add New Content Source').click();

                cy.contains('Submit').should('exist');

                cy.get('.el-dialog.el-dialog--small').within(() => {
                    cy.get('[name="name"]')
                        .type(sourceData.name)
                        .should('have.value', sourceData.name);

                    cy.get('[name="url"]')
                        .type(sourceData.url)
                        .should('have.value', sourceData.url);
                    cy.get('.el-button.el-button--primary').contains('Submit').click();
                })

                cy.contains('Successfully added!').should('exist');
            }
        })

        // ADD LEARNING CONTENT PIECE

        cy.get('.el-menu-item').contains('Learning Content').click();

        cy.get('.el-table__row').then(row => {
            if (!row.find('.cell').text().includes('Test Content')) {
                cy.get('.el-button.el-button--primary').contains('Add new Learning Content').click();

                const { title, url, author, type, price: { currency, value }, relatedPrimarySkills } = contentData
                cy.get('.el-form.el-form--label-right.en-US').within(() => {
                    cy.get('[name="title"]')
                        .type(title)
                        .should('have.value', title);

                    cy.get('[name="url"]')
                        .type(url)
                        .should('have.value', url);

                    cy.get('[name="author"]')
                        .type(author)
                        .should('have.value', author);

                    cy.get('[placeholder="Please select your zone"]').click();
                    cy.get('.el-select-dropdown__item').contains(type).click();
                });

                cy.get('[placeholder="Choose the published date"]').click();
                cy.get('.el-picker-panel.el-date-picker').within(() => {
                    cy.get('.available.today.current').click();
                })

                cy.get('.el-form.el-form--label-right.en-US').within(() => {
                    cy.get('[value="EUR"]').click();
                    cy.get('.el-select-dropdown__item').contains(currency).click();

                    cy.get('[name="value"]')
                        .type(value)
                        .should('have.value', value);

                    relatedPrimarySkills.map((primarySkill, i) => {
                        const [category, skillName] = primarySkill.split('|')
                        cy.get('[placeholder="Select primary skill"]').click();
                        cy.get('.el-cascader-menu__item.el-cascader-menu__item--extensible:visible').contains(category).click();
                        cy.get('.el-cascader-menu__item').contains(skillName).click();
                        if (i !== relatedPrimarySkills.length - 1) {
                            cy.get('.el-button.el-button--default').contains('Add new Skill').click();
                        }
                    })

                    cy.get('.el-button.el-button--primary').contains('Create').click();
                });

                // CHECK IF CONTENT WAS SUCCESSFULLY CREATED

                cy.contains('Content is successfully added').should('exist');
                cy.contains('Test Content').should('exist');
            }
        })

        // CHECK IF CONTENT CAN BE EDITED

        cy.get('tbody > :nth-child(1)').within(row => {
            if (row.find('.cell').text().includes('Test Content')){
                cy.get('.el-button.el-button--success.el-button--small').click();
            }
        })

        cy.contains('test source').should('exist');
        cy.go('back')

        // DELETE TEST CONTENT

        cy.get('tbody > :nth-child(1)').within(row => {
            if (row.find('.cell').text().includes('Test Content')){
                cy.get('.el-button.el-button--danger.el-button--small').contains('Delete').click();
            }
        })

        // cy.get('.el-table__row').within(() => {
        //     if (cy.contains('Test Content')) {
        //         cy.get('.el-button.el-button--danger.el-button--small').contains('Delete').click();
        //     }
        // })

        cy.contains('This will permanently delete the file. Continue?').should('exist');
        cy.get('.el-message-box__btns').within(() => {
            cy.get('.el-button.el-button--default.el-button--primary').contains('OK').click();
        })

        cy.contains("Delete completed!").should('exist')
        cy.contains("Test Content").should("not.exist")

        cy.get('.el-menu-item').contains('Sources').click();
        cy.get('tbody > :nth-child(1)').within(row => {
            if (row.find('.cell').text().includes('test_source')) {
                cy.get('.el-button.el-button--danger.el-button--small').contains('Delete').click();
            }
        })

        cy.contains('This will permanently delete the file. Continue?').should('exist');
        cy.get('.el-message-box__btns').within(() => {
            cy.get('.el-button.el-button--default.el-button--primary').contains('OK').click();
        })

        cy.contains("Content source successfully deleted").should('exist')
        cy.contains("test_source").should("not.exist")
    });
});
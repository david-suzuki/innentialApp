describe('Login', function() {
    it('Succesfull login with test username and password', function() {

        cy.visit('http://localhost:8082/');
        cy.url().should('include', 'http://localhost:8082/login');

        const testUser = Cypress.config('testUser');

        cy.get('[name="email"]')
            .type(testUser.email)
            .should('have.value', testUser.email);

        cy.get('[name="password"]')
            .type(testUser.password)
            .should('have.value', testUser.password);

        cy.get('.el-form.el-form--label-right').submit()

        // cy.get('.el-button--signin.signin__button').contains('Sign In').click();

        cy.url().should('include', 'http://localhost:8082');
        cy.contains('Login successful').should('exist');

        cy.get('.el-menu > :nth-child(2) > a').contains('Learning').click();
        cy.url().should('include', '/learning');

        cy.get('.el-menu > :nth-child(3) > a').contains('Paths').click();
        cy.url().should('include', '/learning-paths');

        cy.get('.el-menu > :nth-child(4) > a').contains('Organization').click();
        cy.url().should('include', '/teams');

        cy.get('.el-menu > :nth-child(5) > a').contains('Reviews').click();
        cy.url().should('include', '/reviews');

        cy.get('.el-menu > :nth-child(6) > a').contains('Goals').click();
        cy.url().should('include', '/goals');

        // cy.get('.el-menu > :nth-child(6) > a').contains('Skills').click();
        // cy.url().should('include', '/skill-gap');
        // cy.contains('Filters').should('exist');

        cy.get('.el-menu > :nth-child(7) > a').contains('Statistics').click();
        cy.url().should('include', '/statistics');
    });
});
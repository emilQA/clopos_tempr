class LoginPage {

    elements = {
        brandNameinput: () => cy.get('#brand', { timeout: 35000 }),
        passwordInput: () => cy.get('#password'),
        loginButton: () => cy.get('.next-step'),
        getValidationText: () => cy.get('.error-msg').invoke('text'),
        getBrandNameText: () => cy.get('.brand-name').invoke('text'),
        keyZero: () => cy.contains('button.numBtn', '0', { timeout: 15000 }).should('be.visible'),
        tableSecondTable: () => cy.get('#table-2 > .content'),
        orderSecondTable: () => cy.get('.receipt-info').should('contain.text', 'Masa 2'),
    }

    fillBrandNameAndClickLoginButton(data) {
        this.elements.brandNameinput().should('be.visible').clear().type(data);
        this.elements.loginButton().should('be.visible').click();
    }

    brandDataValidator(data) {
        this.elements.brandData(data).should('be.visible')
    }

    checkBrandLogoImage() {
        return cy.get(".brand-logo img")
            .should("exist")
            .should("have.attr", "src")
            .then((src) => {
                const image = new Image();
                image.src = src;
                return Cypress.Promise.resolve(image.naturalWidth);
            })
            .should("be.greaterThan", 0);
    }


    attemptLogin(data) {
        this.elements.brandNameinput().should('be.visible').clear().type(data);
        this.elements.loginButton().should('be.visible').click();
    }


    fillPasswordinputAndClickToLoginButton(password) {
        this.elements.passwordInput().should('be.visible').clear().type(password)
        this.elements.loginButton().should('be.visible').click();
    }


    truePinResolver(data) {
        Cypress._.times(data, () => {
            this.elements.keyZero().should('be.visible').click()
        })
    }



}


module.exports = new LoginPage();




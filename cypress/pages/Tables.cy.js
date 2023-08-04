class Tables {

    elements = {
        tables: () => cy.get('.text-center'),
        tableTwo: () => cy.get('#table-2 > .content'),
        tableFive: () => cy.get('#table-5 > .content')
    }

}

module.exports = new Tables();
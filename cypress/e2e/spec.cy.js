/// <reference types="cypress" />
import LoginPage from '../pages/LoginPage.cy'
import Tables from '../pages/Tables.cy';
import Order from '../pages/OrderPage.cy';

describe('e2e', () => {

  before(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win, 'open').as('windowOpen')
      }
    })
  });

  it('Performs Brand Login and Processes Order(E2E)', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      expect(err.message).to.include('error')
    })
    LoginPage.fillBrandNameAndClickLoginButton('notbrand')
    LoginPage.elements.getValidationText().should('equal', 'Sorry, but the Brand name notbrand does not exist');
    LoginPage.fillBrandNameAndClickLoginButton('alphatest')
    LoginPage.elements.getBrandNameText().should('equal', 'alphatest')
    LoginPage.checkBrandLogoImage()
    LoginPage.fillPasswordinputAndClickToLoginButton('123')
    LoginPage.elements.getValidationText().should('contain', "Invalid");
    LoginPage.fillPasswordinputAndClickToLoginButton('11111')
    LoginPage.truePinResolver(4)
    Tables.elements.tables().should('have.length.greaterThan', 0)
    Tables.elements.tableTwo().should('contain.text', 'Masa 2').click()
    Order.elements.receiptInfo().should('contain.text', 'Masa 2');
    Order.deleteOrderList('Xarab Məhsul')
    Order.clickProductByText('Vergi');
    Order.clickProductByText('Panakotta');
    Order.clickProductByText('Blincik');
    Order.clickProductByText('test mehsul 5');
    Order.verifyProductModalVisible('test mehsul 5');
    Order.clickProductByText('Xırdalan non-filtered');
    Order.confirmOrder(/Saxla|Save/);
    Order.openMenuAndSelectOption(/Qonaq sayını dəyiş|Edit number of guests/);
    Order.changeGuestNumber(123)
    Order.saveAndCloseModal()
    Order.changeOrderItem('Glenfiddich', /Saxla|Save/, 'Xarab Məhsul')
    Order.selectCustomerByPhoneNumber()
    Order.deleteOrApprove()
    Order.processPayment()
    Order.closeOrderAndPrintPopup()
    Tables.elements.tableFive().should('contain.text', 'Masa 5').click()
    Order.elements.receiptInfo().should('contain.text', 'Masa 5');
    Order.clickProductByText('Şorbalar');
    Order.clickProductByText('Düşbərə');
    Order.clickProductByText('texkarta test 1');
    // Order.clickProductByText('Mərci şorbası'); // bug
    Order.clickProductByText('initial');
    Order.makeOrderDiscount(/Tətbiq et|Apply/);
    Order.writeCommentforOrder('test comment');
    Order.processPayment()
    Order.closeOrderAndPrintPopup()

  });

})




class Order {
  get elements() {
    return {
      receiptInfo: () => cy.get('.receipt-info'),
      orderedList: () => cy.get('.clopos-scroll > div'),
      orderPopupDelete: () => cy.get('.remove'),
      orderPopupDeleteReason: (deleteReason) => cy.contains('.badge.badge-secondary', deleteReason),
      orderPopupConfirmDeletionButton: () => cy.get('[style="display: grid; column-gap: 10px; grid-auto-flow: column;"] > .btn-modal'),
      orderCard: (text) => cy.contains('.menu-item-padding', text),
      orderModalHeader: (text) => cy.contains('.d-flex > .modal-title', text),
      orderConfirmationButton: (confirmText) => cy.contains('.confirm', confirmText),
      leftMenu: () => cy.get('.dropup.dropdown>[data-toggle="dropdown"]'),
      menuOptionsSelector: (text) => cy.contains('.dropdown-item', text),
      guestModalAmountInput: () => cy.get('input[name="amount"]'),
      guestModalSaveButton: () => cy.contains('.btn-modal.confirm.btn.btn-secondary', /Saxla|Save/),
      modalOption: () => cy.get('.modifier-group > :nth-child(1) > :nth-child(2) > .card > .card-body'),
      modalInput: () => cy.get('.position-relative > .height-5'),
      modalConfirm: () => cy.get('button.btn-modal.confirm'),
      customerIcon: () => cy.get('#OrderPage > .leftNavbar > :nth-child(1) > :nth-child(1) > a'),
      selectCustomerByPhoneNumber: () => cy.contains('.customer-list-item', '+994 55 339 44 84'),
      selectedCustomersMenu: () => cy.get('button.selected-customer'),
      receiptPay: () => cy.get('.btn-receipt-pay'), // This is the green button and should show the total amount
      receiptTotalPrice: () => cy.get('.line1>.f-w-500'),
      orderCloseButton: () => cy.contains('.order-action-close', /Bağla|Close/),
      orderDiscount: () => cy.get('#OrderPage > .leftNavbar > :nth-child(1) > :nth-child(2) > a'),
      orderDiscountInput: () => cy.get('.height-5'),
      orderComment: () => cy.get('#OrderPage > .leftNavbar > :nth-child(1) > :nth-child(3) > a'),
      orderCommentInput: () => cy.get('.form-control'),
      orderCommentSaveButton: () => cy.get('.confirm')
    };
  }

  deleteOrderList(deleteReason) {
    cy.get(this.elements.orderedList()).then(($listMenu) => {
      if ($listMenu.children().length > 0, { timeout: 8000 }) {
        $listMenu.children().each(($child) => {
          cy.wrap($child).click();
          this.elements.orderPopupDelete().should('be.visible').click();
          this.elements.orderPopupDeleteReason(deleteReason).should('be.visible').click();
          this.elements.orderPopupConfirmDeletionButton().should('be.visible').click();
        });
      } else {
        cy.log('No children elements found.');
      }
    });
  }

  clickProductByText(text) {
    this.elements.orderCard(text).should('be.visible').click();
  }

  verifyProductModalVisible(text) {
    this.elements.orderCard(text).should('contain.text', text);
  }

  confirmOrder(confirmText) {
    this.elements.orderConfirmationButton(confirmText).should('be.visible').click();
  }

  openMenuAndSelectOption(text) {
    this.elements.leftMenu().should('be.visible').click();
    this.elements.menuOptionsSelector(text).should('be.visible').click();
  }

  changeGuestNumber(amount) {
    this.elements.guestModalAmountInput().then(($input) => {
      $input.removeAttr('readonly');
      cy.wrap($input).should('be.visible').type(amount);
    });
  }

  saveAndCloseModal() {
    this.elements.guestModalSaveButton().should('be.visible').click();
  }

  changeOrderItem(text, confirmText, deleteReason) {
    this.elements.orderedList().children().each(($element) => {
      if ($element.find('.d-block').length > 0) {
        cy.wrap($element).should('be.visible').click();
        this.elements.modalOption().should('be.visible').contains(text).click();
        this.elements.orderConfirmationButton(confirmText).should('be.visible').click();
        this.elements.orderPopupDeleteReason(deleteReason).should('be.visible').click();
        this.elements.orderPopupConfirmDeletionButton().should('be.visible').click();
      } else {
        cy.wrap($element).should('be.visible').click();
        this.elements.modalInput().then(($input) => {
          $input.removeAttr('readonly');
          cy.wrap($input).should('be.visible').type(222);
        });
        this.elements.modalConfirm().should('be.visible').click();
      }
    });
  }

  selectCustomerByPhoneNumber() {
    this.elements.customerIcon().should('be.visible').click();
    this.elements.selectCustomerByPhoneNumber().should('be.visible').click();
  }

  deleteOrApprove() {
    this.elements.selectedCustomersMenu().then(($buttons) => {
      const buttonText = $buttons.text();
      const buttonSelector = buttonText.includes('Sil') ? 'Sil|Delete' : 'Tətbiq et|Apply';
      cy.contains('button', new RegExp(buttonSelector)).should('be.visible').click();
    });
  }

  showReceipt() {
    this.elements.receiptPay().should('be.visible').click();
  }

  processPayment() {
    this.elements.receiptPay().should('be.visible').click();
    this.elements.receiptTotalPrice().should('be.visible').then(($totalPrice) => {
      const totalPriceText = $totalPrice.text().trim();
      const totalPrice = parseFloat(totalPriceText.replace('₼', ''));
      const halfPrice = totalPrice / 2;
      cy.get(':nth-child(1) > .form-control').should('be.visible').invoke('removeAttr', 'readonly').type(halfPrice, '{enter}').wait(2000);
      cy.get(':nth-child(2) > .form-control').should('be.visible').click().wait(1000);
    });
  }

  closeOrderAndPrintPopup() {
    if (!Cypress.env('printStub')) {
      //(task)stub yoxdursa yaratmaliyam
      Cypress.env('printStub', cy.stub(cy.state('window'), 'print', () => { }));
    }
    this.elements.orderCloseButton().click().should(() => {
      const stub = Cypress.env('printStub');
      expect(stub).to.be.called;
    });
  }

  makeOrderDiscount(confirmText) {
    this.elements.orderDiscount().click();
    this.elements.orderDiscountInput().should('be.visible').invoke('removeAttr', 'readonly').type('50')
    this.elements.orderConfirmationButton(confirmText).click()
  }

  writeCommentforOrder(comment) {
    this.elements.orderComment().click();
    this.elements.orderCommentInput().clear().type(comment)
    this.elements.orderCommentSaveButton().click()
  }

}

module.exports = new Order();

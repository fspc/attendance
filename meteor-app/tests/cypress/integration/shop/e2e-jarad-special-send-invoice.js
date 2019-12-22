const pin = '1234'

describe('Shopping Payment', function() {
  it('Choose Product', function() {
    cy.visit('/admin/userprofiles/')
    mkToughGuy()

    cy.get('input[name=email]')
      .clear()
      .type('admin@back2bikes.com.au')

    cy.get('input[name=password]')
      .clear()
      .type('me2')

    cy.get('button')
      .contains('Submit')
      .should('be.enabled')
      .click()
    cy.get('button[about="Tough Guy"]')
      .contains('Add...')
      .click()
    cy.get('button#multi_pass')
      .contains('Multi pass')
      .should('exist')
      .click()
    cy.get('button#pa_casual_session')
      .should('exist')
      .click()
    cy.get('button#checkout')
      .should('exist')
      .click()
    // Admin promo code brings up form
    cy.get('input[name="promo"]')
      .should('exist')
      .click()
      .clear()
      .type('JARAD-ROOLS')
    cy.get('button#check')
      .should('exist')
      .click()
    cy.get('input[value="email"]')
      .should('exist')
      .click()
    cy.get('input[type="email"]').should('have.value', 'tough.guy@tough-guys.inc.inc')
    cy.get('button[id="doit"]')
      .should('exist')
      .click()
    cy.get('h2[class="ui header"').contains('tough.guy@tough-guys.inc.inc')
    cy.visit('/admin/userprofiles/')
    cy.get('div[class="content"]')
      .contains('Tough Guy')
      .should('exist')
      .click()
    cy.get('div[class="content"]').contains('1 x PA-CASUAL')

    // Next steps:
    // 1) logout
    // 2) Click the link in the email sent to Tough Guy
    cy.window().then(win => {
      const cartId = win.sessionStorage.getItem('mycart')
      const memberId = win.sessionStorage.getItem('memberId')
      console.log(`member/cart ${memberId}/${cartId}`)
      // Clear session storage
      win.sessionStorage.clear()
      cy.visit('/signout')
      cy.visit(`/shop/renew/${memberId}/${cartId}`)
      cy.get('button')
        .contains('Next')
        .click()
    })

    // Remove the tough guy at the end
    // rmToughGuy()
  })
})

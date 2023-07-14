import MenuLateral from '../MenuLateral.vue'

describe('HelloWorld', () => {
  it('playground', () => {
    cy.mount(MenuLateral, { props: { msg: 'Hello Cypress' } })
  })

  it('renders properly', () => {
    cy.mount(MenuLateral, { props: { msg: 'Hello Cypress' } })
    cy.get('h1').should('contain', 'Hello Cypress')
  })
})

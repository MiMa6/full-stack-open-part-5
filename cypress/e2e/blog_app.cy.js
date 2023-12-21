describe('Blog app', function () {
  beforeEach(function () {
    const user = {
      name: 'Tatu Testaaja',
      username: 'TaTe',
      password: 'salainenSana'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.get('#username')
    cy.get('#password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('TaTe')
      cy.get('#password').type('salainenSana')
      cy.get('#login-button').click()

      cy.contains('Tatu Testaaja logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('TaTe')
      cy.get('#password').type('WrongPassword')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })
})
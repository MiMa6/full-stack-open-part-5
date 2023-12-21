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

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('TaTe')
      cy.get('#password').type('salainenSana')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title-form').type('Test Blog')
      cy.get('#author-form').type('Tuulia Tullinen')
      cy.get('#url-form').type('www.TuulianTulliBlogi.com')
      cy.get('#create-button').click()
      cy.contains('a new blog Test Blog by Tuulia Tullinen added')
      // List of blog
      cy.get('.blog').contains('Test Blog Tuulia Tullinen')
    })

  })
  describe('When logged in and blog created', function () {
    beforeEach(function () {
      // login
      cy.get('#username').type('TaTe')
      cy.get('#password').type('salainenSana')
      cy.get('#login-button').click()
      // creat blog
      cy.contains('new blog').click()
      cy.get('#title-form').type('Test Blog')
      cy.get('#author-form').type('Tuulia Tullinen')
      cy.get('#url-form').type('www.TuulianTulliBlogi.com')
      cy.get('#create-button').click()
    })
    it('User can like a blog', function () {
      cy.get('.blog')
        .contains('Test Blog Tuulia Tullinen')
        .contains('view').click()
      cy.contains('like').click()
      cy.contains('likes: 1')
    })
    it('User who created blog can delete it', function () {
      cy.get('.blog')
        .contains('Test Blog Tuulia Tullinen')
        .contains('view').click()
      cy.contains('remove').click()
      cy.get('.blog')
        .should('not.exist')
    })
  })
})
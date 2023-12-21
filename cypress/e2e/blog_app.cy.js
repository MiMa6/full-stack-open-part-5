describe('Blog app', function () {
  beforeEach(function () {
    const userOne = {
      name: 'Tatu Testaaja',
      username: 'TaTe',
      password: 'salainenSana'
    }
    const userTwo = {
      name: 'Jussi Journalisti',
      username: 'JuuJo',
      password: 'SalsaSalaan'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, userOne)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, userTwo)
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
  describe('When logged in and test blogs created', function () {
    beforeEach(function () {
      // login
      cy.get('#username').type('TaTe')
      cy.get('#password').type('salainenSana')
      cy.get('#login-button').click()
      // creat blog 1
      cy.get('#new-blog').click()
      cy.get('#title-form').type('Test Blog')
      cy.get('#author-form').type('Tuulia Tullinen')
      cy.get('#url-form').type('www.TuulianTulliBlogi.com')
      cy.get('#create-button').click()
      cy.wait(500)
      // creat blog 2
      cy.get('#new-blog').click()
      cy.get('#title-form').type('Blog Test')
      cy.get('#author-form').type('Jehu Jokunen')
      cy.get('#url-form').type('www.jehunjokijuoma.com')
      cy.get('#create-button').click()
    })
    it('User can like a blog', function () {
      cy.get('#test-blog')
        .contains('Test Blog Tuulia Tullinen')
        .contains('view').click()
      cy.get('#test-blog')
        .contains('like').click()
      cy.get('#test-blog')
        .contains('likes: 1')
    })
    it('User who created blog can delete it', function () {
      cy.get('#test-blog')
        .contains('Test Blog Tuulia Tullinen')
        .contains('view').click()
      cy.contains('remove').click()
      cy.get('#test-blog')
        .should('not.exist')
    })
    it('Only user who created blog can see delete button', function () {
      cy.contains('logout').click()
      cy.get('#username').type('JuuJo')
      cy.get('#password').type('SalsaSalaan')
      cy.get('#login-button').click()
      cy.get('#test-blog')
        .contains('Test Blog Tuulia Tullinen')
        .contains('view').click()
      cy.contains('remove').should('not.exist')
    })
    it('Blogs are ordered according to likes (descending)', function () {
      cy.get('#test-blog')
        .contains('Test Blog Tuulia Tullinen')
        .contains('view').click()
      cy.get('#test-blog')
        .contains('like').click()
      cy.get('#blog-test')
        .contains('Blog Test Jehu Jokunen')
        .contains('view').click()
      cy.get('#blog-test')
        .contains('like').click()
        .contains('like').click()
        .contains('like').click()

      cy.get('.blog').eq(0).should('contain', 'Blog Test Jehu Jokunen')
      cy.get('.blog').eq(1).should('contain', 'Test Blog Tuulia Tullinen')
    })
  })
})
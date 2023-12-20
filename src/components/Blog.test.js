import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
  let container
  const blog = {
    title: 'Food Blog',
    author: 'Jake Cake',
    url: 'www.foodblog.com',
    likes: 1,
    user: {
      name: 'Jakkkke'
    }
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
  })

  test('Blog name and author displayed at start', () => {
    const div = container.querySelector('.hideWhenVisible')
    expect(div).toHaveTextContent(
      'Food Blog Jake Cake'
    )
  })

  test('Url and likes not displayed at start', () => {
    const div = container.querySelector('.showWhenVisible')
    expect(div).toHaveTextContent(
      'www.foodblog.com'
    )
    expect(div).toHaveTextContent(
      '1'
    )
    expect(div).toHaveStyle('display: none')
  })
})
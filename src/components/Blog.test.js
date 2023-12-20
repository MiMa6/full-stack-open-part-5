import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'


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

  test('Blog name and author displayed at start', () => {
    container = render(<Blog blog={blog} />).container
    const div = container.querySelector('.hideWhenVisible')
    expect(div).toHaveTextContent(
      'Food Blog Jake Cake'
    )
  })

  test('Url and likes not displayed at start', () => {
    container = render(<Blog blog={blog} />).container
    const div = container.querySelector('.showWhenVisible')
    expect(div).toHaveTextContent(
      'www.foodblog.com'
    )
    expect(div).toHaveTextContent(
      '1'
    )
    expect(div).toHaveStyle('display: none')
  })

  test('Url and likes are displayed when button clicked', async () => {
    container = render(<Blog blog={blog} />).container
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.showWhenVisible')
    expect(div).toHaveTextContent(
      'www.foodblog.com'
    )
    expect(div).toHaveTextContent(
      '1'
    )
    expect(div).not.toHaveStyle('display: none')
  })

  test('Like button cliked twice', async () => {

    const user = userEvent.setup()
    const mockincreaseLikes = jest.fn()

    render(<Blog blog={blog} increaseLikes={mockincreaseLikes} />)

    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockincreaseLikes.mock.calls).toHaveLength(2)
  })
})
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('Create button clicked and form texts sent to createBlog', async () => {
    const user = userEvent.setup()
    const mockCreateBlog = jest.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)


    const inputTitle = screen.getByPlaceholderText('write title')
    const inputAuthor = screen.getByPlaceholderText('write author')
    const inputUrl = screen.getByPlaceholderText('write url')
    const button = screen.getByText('create')


    await user.type(inputTitle, 'Test title')
    await user.type(inputAuthor, 'Test author')
    await user.type(inputUrl, 'Test url')
    await user.click(button)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe('Test title')
    expect(mockCreateBlog.mock.calls[0][0].author).toBe('Test author')
    expect(mockCreateBlog.mock.calls[0][0].url).toBe('Test url')
  })
})
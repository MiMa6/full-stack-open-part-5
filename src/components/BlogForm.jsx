import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const cleanBlogForm = () => {
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    cleanBlogForm()
  }

  return (
    <form onSubmit={addBlog} >
      <div>
        title:
        <input
          id='title-form'
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder='write title'
        />
      </div>
      <div>
        author:
        <input
          id='author-form'
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          placeholder='write author'
        />
      </div>
      <div>
        url:
        <input
          id='url-form'
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          placeholder='write url'
        />
      </div>
      <div>
        <button id='create-button' type="submit">create</button>
      </div>
    </form >
  )
}

export default BlogForm
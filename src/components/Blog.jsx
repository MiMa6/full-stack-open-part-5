import { useState } from 'react'
import './styles.css'

const Blog = ({ blog, increaseLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        likes: {blog.likes}
        <button onClick={() => increaseLikes(blog.id)} type="submit"> like </button> <br />
        {blog.user.name} <br />
        <button className="blue-button" onClick={() => deleteBlog(blog.id)} type="submit"> remove </button> <br />
      </div>
    </div>
  )
}

export default Blog
import { useState } from 'react'
import './styles.css'

const Blog = ({ blog, increaseLikes, deleteBlog, user }) => {
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

  const blogId = blog.title.split(' ').join('-').toLowerCase()

  return (
    <div id={blogId} style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className="hideWhenVisible" >
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="showWhenVisible">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        likes: {blog.likes}
        <button onClick={() => increaseLikes(blog.id)} type="submit">like</button> <br />
        {blog.user.name} <br />
        {blog.user.name === user.name && (
          <button className="blue-button" onClick={() => deleteBlog(blog.id)} type="submit"> remove </button>
        )}
      </div>
    </div>
  )
}

export default Blog
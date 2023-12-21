import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [blogs.length])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type = 'info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 3500)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out')) {
      window.localStorage.removeItem('loggedBlogAppUser')
      setUser(null)
    }
  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(createdBlog))
      notifyWith(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'info')
      blogFormRef.current.toggleVisibility()

    } catch (exception) {
      console.log(exception)
      const responseErrorMessage = exception.response.data.error
      if (responseErrorMessage.includes('Blog validation failed')) {
        notifyWith('title and url required', 'error')
      } else {
        notifyWith(responseErrorMessage, 'error')
      }
    }
  }

  const increaseLikes = async (id) => {

    const blog = blogs.find(blog => blog.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1, user: user.id }

    try {
      const updatedBlog = await blogService.update(id, changedBlog)
      const updatedBlogWithUserInfo = { ...updatedBlog, user: blog.user }
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlogWithUserInfo))
    } catch (exception) {
      console.log(exception)
      notifyWith('Updating likes failed', 'error')
    }
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(blog => blog.id === id)

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.del(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        notifyWith(`Blog ${blog.title} by ${blog.author} deleted`, 'info')
      } catch (exception) {
        console.log(exception)
        if (exception.response.status === 401) {
          notifyWith('Only blog creator can delete blog', 'error')
        } else {
          notifyWith('Removing blog failed', 'error')
        }
      }
    }
  }

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <Togglable openButtonLabel="new blog" closeButtonLabel="cancel" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification info={info} />

        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }

  const blogsSortedDesc = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>

      <Notification info={info} />

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </div>

      <br />

      <div>
        <h2> create new </h2>
        {blogForm()}
      </div>
      <div>
        {blogsSortedDesc.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            increaseLikes={increaseLikes}
            deleteBlog={deleteBlog}
            user={user}
          />
        )}
      </div>

    </div>
  )
}


export default App
import { useState, useEffect } from 'react'
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
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
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

  const cleanBlogForm = () => {
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
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

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      notifyWith(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'info')
      cleanBlogForm()
    } catch (exception) {
      console.log(exception)
      const responseErrorMessage = exception.response.data.error
      if (responseErrorMessage.includes('Blog validation failed')) {
        notifyWith('title and author required', 'error')
      } else {
        notifyWith(responseErrorMessage, 'error')
      }
    }
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

        <Togglable buttonLabel="new blog">
          <BlogForm
            addBlog={addBlog}
            newTitle={newTitle}
            newAuthor={newAuthor}
            newUrl={newUrl}
            setNewTitle={setNewTitle}
            setNewAuthor={setNewAuthor}
            setNewUrl={setNewUrl}
          />
        </Togglable>
      </div>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>

    </div>
  )
}


export default App
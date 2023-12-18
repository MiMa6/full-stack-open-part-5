import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
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
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
      blogService.create(newBlog)
      cleanBlogForm()
    } catch (exception) {
      console.log(exception)
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
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

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </div>

      <br />

      <div>
        <h2> create new </h2>

        <BlogForm
          addBlog={addBlog}
          newTitle={newTitle}
          newAuthor={newAuthor}
          newUrl={newUrl}
          setNewTitle={setNewTitle}
          setNewAuthor={setNewAuthor}
          setNewUrl={setNewUrl}
        />
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
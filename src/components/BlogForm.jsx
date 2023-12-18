const BlogForm = ({
  addBlog,
  newTitle,
  newAuthor,
  newUrl,
  setNewTitle,
  setNewAuthor,
  setNewUrl,
}) => {
  return (
    <form onSubmit={addBlog} >
      <div>
        title:
        <input
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <div>
        <button type="submit"> create </button>
      </div>
    </form >
  )
}

export default BlogForm
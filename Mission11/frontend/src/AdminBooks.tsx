import { useState, useEffect } from 'react'
import type { Book } from './types/Book'

const API = `${import.meta.env.VITE_API_URL}/books`

const emptyBook = (): Book => ({
  bookId: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  pageCount: 0,
  price: 0,
})

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [newBook, setNewBook] = useState(emptyBook())
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchAllBooks = async () => {
    setLoading(true)
    const res = await fetch(`${API}?pageSize=1000&pageNum=1`)
    const data = await res.json()
    setBooks(data.books)
    setLoading(false)
  }

  useEffect(() => {
    fetchAllBooks()
  }, [])

  const handleDelete = async (bookId: number) => {
    if (!confirm('Delete this book?')) return
    await fetch(`${API}/${bookId}`, { method: 'DELETE' })
    setBooks((prev) => prev.filter((b) => b.bookId !== bookId))
  }

  const handleEditSave = async () => {
    if (!editingBook) return
    const res = await fetch(`${API}/${editingBook.bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingBook),
    })
    const updated = await res.json()
    setBooks((prev) => prev.map((b) => (b.bookId === updated.bookId ? updated : b)))
    setEditingBook(null)
  }

  const handleAdd = async () => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    })
    if (!res.ok) {
      alert('Failed to add book. Please fill in all fields.')
      return
    }
    const added = await res.json()
    setBooks((prev) => [...prev, added])
    setNewBook(emptyBook())
    setShowAddForm(false)
  }

  const bookFields: (keyof Omit<Book, 'bookId'>)[] = [
    'title', 'author', 'publisher', 'isbn', 'classification', 'pageCount', 'price',
  ]

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin - Manage Books</h2>
        <button className="btn btn-success" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Book'}
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header fw-bold">Add New Book</div>
          <div className="card-body">
            <div className="row g-2">
              {bookFields.map((field) => (
                <div className="col-md-4" key={field}>
                  <label className="form-label text-capitalize">{field}</label>
                  <input
                    className="form-control"
                    type={field === 'pageCount' || field === 'price' ? 'number' : 'text'}
                    value={String(newBook[field])}
                    onChange={(e) =>
                      setNewBook((prev) => ({
                        ...prev,
                        [field]: field === 'pageCount' || field === 'price' ? Number(e.target.value) : e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <button className="btn btn-primary mt-3" onClick={handleAdd}>
              Save Book
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) =>
              editingBook?.bookId === book.bookId ? (
                <tr key={book.bookId}>
                  {bookFields.map((field) => (
                    <td key={field}>
                      <input
                        className="form-control form-control-sm"
                        type={field === 'pageCount' || field === 'price' ? 'number' : 'text'}
                        value={String(editingBook[field])}
                        onChange={(e) =>
                          setEditingBook((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  [field]:
                                    field === 'pageCount' || field === 'price'
                                      ? Number(e.target.value)
                                      : e.target.value,
                                }
                              : prev
                          )
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <button className="btn btn-sm btn-success me-1" onClick={handleEditSave}>Save</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingBook(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.classification}</td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => setEditingBook({ ...book })}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.bookId)}>Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminBooks
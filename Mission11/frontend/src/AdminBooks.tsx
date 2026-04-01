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
  category: '',
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
      const err = await res.json().catch(() => ({}))
      alert(`Error: ${err.error}\nInner: ${err.inner}`)
      return
    }
    const added = await res.json()
    setBooks((prev) => [...prev, added])
    setNewBook(emptyBook())
    setShowAddForm(false)
  }

  const numFields: (keyof Book)[] = ['pageCount', 'price']
  const classifications = ['Fiction', 'Non-Fiction']
  const categories = ['Classic', 'Biography', 'Science', 'History', 'Self-Help', 'Business', 'Other']

  const renderField = (field: keyof Book, book: Book, onChange: (f: keyof Book, v: string | number) => void) => {
    if (field === 'classification') {
      return (
        <select className="form-select" value={book.classification} onChange={(e) => onChange(field, e.target.value)}>
          <option value="">Select...</option>
          {classifications.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      )
    }
    if (field === 'category') {
      return (
        <select className="form-select" value={book.category} onChange={(e) => onChange(field, e.target.value)}>
          <option value="">Select...</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      )
    }
    return (
      <input
        className="form-control"
        type={numFields.includes(field) ? 'number' : 'text'}
        value={String(book[field] ?? '')}
        onChange={(e) => onChange(field, numFields.includes(field) ? Number(e.target.value) : e.target.value)}
      />
    )
  }

  const allFields: (keyof Omit<Book, 'bookId'>)[] = [
    'title', 'author', 'publisher', 'isbn', 'classification', 'category', 'pageCount', 'price',
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
              {allFields.map((field) => (
                <div className="col-md-4" key={field}>
                  <label className="form-label text-capitalize">{field}</label>
                  {renderField(field, newBook, (f, v) => setNewBook((prev) => ({ ...prev, [f]: v })))}
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
              <th>Classification</th>
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
                  {allFields.map((field) => (
                    <td key={field}>
                      {renderField(field, editingBook, (f, v) =>
                        setEditingBook((prev) => (prev ? { ...prev, [f]: v } : prev))
                      )}
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
                  <td>{book.category}</td>
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

import { useEffect, useState } from "react"
import type { Book } from "./types/Book"

function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [pageSize, setPageSize] = useState(5)
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortAsc, setSortAsc] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    fetch(`http://localhost:5151/books?pageSize=${pageSize}&pageNum=${pageNum}&sortAsc=${sortAsc}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books)
        setTotal(data.total)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [pageSize, pageNum, sortAsc])

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Bookstore</h2>

      {/* TOP CONTROLS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-primary"
          onClick={() => setSortAsc(!sortAsc)}
        >
          Sort by Title ({sortAsc ? "ASC" : "DESC"})
        </button>

        <div>
          <label className="me-2">Results per page:</label>
          <select 
            className="form-select d-inline w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPageNum(1)
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* LOADING / EMPTY STATE */}
      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-center">No books found.</p>
      ) : (
        books.map(b => (
          <div key={b.bookId} className="card mb-3 p-3 shadow-sm">
            <h5>{b.title}</h5>
            <p><strong>Author:</strong> {b.author}</p>
            <p><strong>Publisher:</strong> {b.publisher}</p>
            <p><strong>ISBN:</strong> {b.isbn}</p>
            <p><strong>Category:</strong> {b.classification}</p>
            <p><strong>Pages:</strong> {b.pageCount}</p>
            <p><strong>Price:</strong> ${b.price.toFixed(2)}</p>
          </div>
        ))
      )}

      {/* PAGINATION */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button 
          className="btn btn-secondary"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        <span>Page {pageNum}</span>

        <button 
          className="btn btn-secondary"
          disabled={pageNum * pageSize >= total}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default BookList
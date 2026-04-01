import { useEffect, useState } from "react"
import type { Book } from "./types/Book"

function BookList() {
  // ================================
  // STATE MANAGEMENT
  // ================================
  const [books, setBooks] = useState<Book[]>([])
  const [pageSize, setPageSize] = useState(5)
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortAsc, setSortAsc] = useState(true)
  const [loading, setLoading] = useState(true)

  const [category, setCategory] = useState("")
  const [cart, setCart] = useState<any[]>([])
  const [itemToRemove, setItemToRemove] = useState<any | null>(null)

  // ================================
  // FETCH BOOKS
  // ================================
  useEffect(() => {
    setLoading(true)

    fetch(`${import.meta.env.VITE_API_URL}/books?pageSize=${pageSize}&pageNum=${pageNum}&sortAsc=${sortAsc}&category=${category}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books)
        setTotal(data.total)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [pageSize, pageNum, sortAsc, category])

  // ================================
  // CART PERSISTENCE
  // ================================
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) setCart(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // ================================
  // CART FUNCTIONS
  // ================================
  const addToCart = (book: Book) => {
    const existing = cart.find(item => item.bookId === book.bookId)

    if (existing) {
      setCart(cart.map(item =>
        item.bookId === book.bookId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...book, quantity: 1 }])
    }
  }

  const confirmRemoveFromCart = () => {
    if (!itemToRemove) return
    setCart(cart.filter(item => item.bookId !== itemToRemove.bookId))
    setItemToRemove(null)
  }

  const totalPages = Math.ceil(total / pageSize)

  // ================================
  // UI
  // ================================
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1">
        <div className="container mt-4">
          <h2 className="text-center mb-4">Bookstore</h2>

          <div className="row">

            {/* ================= CART ================= */}
            <div className="col-md-4">
              <div className="card p-3 mb-4 shadow-sm">
                <h5>
                  Cart Summary
                  {/* Bootstrap Badge (#notcoveredinthevideos) */}
                  <span className="badge bg-success ms-2">
                    {cart.length}
                  </span>
                </h5>

                {cart.length === 0 ? (
                  <p className="text-muted">No items in cart</p>
                ) : (
                  cart.map(item => (
                    <div key={item.bookId} className="d-flex justify-content-between align-items-center mb-2">
                      <p className="mb-0">
                        {item.title} (x{item.quantity}) - $
                        {(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        className="btn btn-sm btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#removeModal"
                        onClick={() => setItemToRemove(item)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}

                <hr />

                <strong>
                  Total: $
                  {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </strong>
              </div>
            </div>

            {/* ================= MAIN CONTENT ================= */}
            <div className="col-md-8">

              {/* CONTROLS */}
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

                {/* LEFT SIDE */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => setSortAsc(!sortAsc)}
                  >
                    Sort ({sortAsc ? "ASC" : "DESC"})
                  </button>

                  {/* Collapse toggle (#notcoveredinthevideos) */}
                  <button
                    className="btn btn-outline-primary"
                    data-bs-toggle="collapse"
                    data-bs-target="#filterPanel"
                  >
                    Filters
                  </button>
                </div>

                {/* RIGHT SIDE */}
                <div className="d-flex align-items-center gap-2">
                  <label className="mb-0">Show:</label>
                  <select
                    className="form-select w-auto"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setPageNum(1)
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>

              </div>

              {/* FILTER PANEL */}
              <div className="collapse show mb-3" id="filterPanel">
                <div className="card p-3">
                  <label className="mb-2">Category:</label>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      setCategory(e.target.value)
                      setPageNum(1)
                    }}
                  >
                    <option value="">All</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                  </select>
                </div>
              </div>

              {/* BOOK LIST */}
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

                    <button
                      className="btn btn-success mt-2"
                      onClick={() => addToCart(b)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))
              )}

              {/* PAGINATION */}
              <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
                <button className="btn btn-outline-secondary" disabled={pageNum === 1} onClick={() => setPageNum(1)}>First</button>
                <button className="btn btn-secondary" disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Prev</button>

                <span>Page {pageNum} of {totalPages}</span>

                <button className="btn btn-secondary" disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>
                <button className="btn btn-outline-secondary" disabled={pageNum === totalPages} onClick={() => setPageNum(totalPages)}>Last</button>
              </div>

            </div>
          </div>

          {/* REMOVE MODAL (#notcoveredinthevideos) */}
          <div className="modal fade" id="removeModal" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <h5>Remove Item</h5>
                <p>Are you sure you want to remove this item?</p>

                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button className="btn btn-danger" data-bs-dismiss="modal" onClick={confirmRemoveFromCart}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-light text-center py-3 mt-4 border-top">
        <small className="text-muted">
          Bookstore App © 2026
        </small>
      </footer>
    </div>
  )
}

export default BookList
import { Routes, Route, Link } from 'react-router-dom'
import BookList from './BookList'
import AdminBooks from './AdminBooks'

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <span className="navbar-brand fw-bold">Bookstore</span>
        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/adminbooks">Admin</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/adminbooks" element={<AdminBooks />} />
      </Routes>
    </>
  )
}

export default App
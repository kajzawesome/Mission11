using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // Added category filtering to support user-selected book categories
    [HttpGet]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, bool sortAsc = true, string? category = null)
    {
        var query = _context.Books.AsQueryable();

        // Filter by category if provided
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Classification == category);
        }

        // Sorting
        query = sortAsc
            ? query.OrderBy(b => b.Title)
            : query.OrderByDescending(b => b.Title);

        var totalBooks = query.Count();

        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { Books = books, Total = totalBooks });
    }

    [HttpPost]
    public IActionResult AddBook([FromBody] Book book)
    {
        try
        {
            book.BookId = 0;
            _context.Books.Add(book);
            _context.SaveChanges();
            return Ok(book);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
        }
    }

    [HttpPut("{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book book)
    {
        var existing = _context.Books.Find(bookId);
        if (existing == null) return NotFound();

        existing.Title = book.Title;
        existing.Author = book.Author;
        existing.Publisher = book.Publisher;
        existing.ISBN = book.ISBN;
        existing.Classification = book.Classification;
        existing.Category = book.Category;
        existing.PageCount = book.PageCount;
        existing.Price = book.Price;

        _context.SaveChanges();
        return Ok(existing);
    }

    [HttpDelete("{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _context.Books.Find(bookId);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        _context.SaveChanges();
        return NoContent();
    }
}
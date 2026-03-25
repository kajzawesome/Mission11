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
}
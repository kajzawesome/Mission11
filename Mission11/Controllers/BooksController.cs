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

    [HttpGet]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, bool sortAsc = true)
    {
        var query = _context.Books.AsQueryable();

        // Sorting
        query = sortAsc
            ? query.OrderBy(b => b.Title)
            : query.OrderByDescending(b => b.Title);

        // Pagination
        var totalBooks = query.Count();

        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new
        {
            Books = books,
            Total = totalBooks
        });
    }
}
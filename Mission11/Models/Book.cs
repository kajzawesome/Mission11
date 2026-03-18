public class Book
{
    public required int BookId { get; set; }  // adjust if needed
    public required string Title { get; set; }
    public required string Author { get; set; }
    public required string Publisher { get; set; }
    public string? ISBN { get; set; }
    public string? Classification { get; set; }
    public int? PageCount { get; set; }
    public required decimal Price { get; set; }
}
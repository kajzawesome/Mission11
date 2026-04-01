using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Book
{
    public int BookId { get; set; }
    public required string Title { get; set; }
    public required string Author { get; set; }
    public required string Publisher { get; set; }
    public string? ISBN { get; set; }
    [Column("Category")]
    public string? Classification { get; set; }
    [Column("Classification")]
    [JsonIgnore]
    public string? ClassificationLegacy { get; set; }
    public int? PageCount { get; set; }
    public required decimal Price { get; set; }
}
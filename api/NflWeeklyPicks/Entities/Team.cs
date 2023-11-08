using Postgrest.Attributes;
using Postgrest.Models;

namespace NflWeeklyPicks.Entities;

[Table("teams")]
public class Team : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; } = null!;

    [Column("external_id")]
    public string ExternalId { get; set; } = null!;
}
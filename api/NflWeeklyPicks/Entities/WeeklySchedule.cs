using Postgrest.Attributes;
using Postgrest.Models;

namespace NflWeeklyPicks.Entities;

[Table("weekly_schedules")]
public class WeeklySchedule : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }

    [Column("week_number")]
    public string WeekNumber { get; set; } = null!;
    
    [Column("open_date")]
    public DateTimeOffset OpenDate { get; set; }
    
    [Column("close_date")]
    public DateTimeOffset CloseDate { get; set; }
}
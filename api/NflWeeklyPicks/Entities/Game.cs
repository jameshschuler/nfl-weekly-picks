using Postgrest.Attributes;
using Postgrest.Models;

namespace NflWeeklyPicks.Entities;

[Table("games")]
public class Game : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    
    [Column("away_team_id")]
    public int AwayTeamId { get; set; }
    
    [Column("home_team_id")]
    public int HomeTeamId { get; set; }
    
    [Column("away_team_score")]
    public string? AwayTeamScore { get; set; }
    
    [Column("home_team_score")]
    public string? HomeTeamScore { get; set; }
    
    [Column("winner_team_id")]
    public int? WinnerTeamId { get; set; }
    
    [Column("weekly_schedule_id")]
    public int WeeklyScheduleId { get; set; }
    
    [Column("name")]
    public string Name { get; set; } = null!;
    
    [Column("short_name")]
    public string ShortName { get; set; } = null!;
    
    [Column("start_date")]
    public DateTimeOffset StartDate { get; set; }
}
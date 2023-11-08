using System.Text.Json.Serialization;

namespace NflWeeklyPicks.DTOs;

public record ExternalApiResponse(Content Content);

public record Content(string ActiveDate, Dictionary<string, Schedule> Schedule, List<Team> ByeWeek);

public class Schedule
{
    [JsonPropertyName("Games")] 
    public List<GameResponse> Games { get; set; } = new List<GameResponse>();
}

public record Competition(string Date, List<Competitor> Competitors);

public record Competitor(string Id, string Score, bool? Winner, string HomeAway, Team Team);

public record Team(string Id, string DisplayName, string Name, string ShortDisplayName, string Abbreviation);

public record GameResponse(string Date, string Uid, string Name, string ShortName, List<Competition> Competitions);
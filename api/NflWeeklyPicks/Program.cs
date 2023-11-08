using Microsoft.AspNetCore.Authorization;
using NflWeeklyPicks.DTOs;
using NflWeeklyPicks.DTOs.Response;
using NflWeeklyPicks.Entities;
using Postgrest;
using Team = NflWeeklyPicks.Entities.Team;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var url = builder.Configuration["SUPABASE_URL"];
var key = builder.Configuration["SUPABASE_KEY"];

var options = new Supabase.SupabaseOptions
{
    AutoRefreshToken = true,
    AutoConnectRealtime = true,
    Schema = "nflweeklypicks"
};

builder.Services.AddScoped<Supabase.Client>(_ => new Supabase.Client(url, key, options));

builder.Services.AddSingleton<HttpClient>(_ => new HttpClient()
{
    BaseAddress = new Uri("https://cdn.espn.com"),
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapGet("api/schedule/seed", async (HttpClient httpClient, Supabase.Client supabaseClient) =>
{
    const int year = 2023;
    const int startWeek = 10;
    const int lastWeek = 18;
    
    DateTime? prevWeekLastGameDate = null;
    
    for (var i = startWeek; i <= lastWeek; i++)
    {
        var requestUri = $"core/nfl/schedule?xhr=1&year={year}&week={i}";
        var response = await httpClient.GetFromJsonAsync<ExternalApiResponse>(requestUri);
        if (response is null || !response.Content.Schedule.Any())
        {
           continue;
        };

        var games = new List<Game>();

        var firstDayOfGames = response.Content.Schedule.First();
        var firstGameDate = firstDayOfGames.Value.Games.First().Date;
        // Weekly cutoff date is 1 hour before first game of that week
        var weekCutOffDate = DateTimeOffset.Parse(firstGameDate).UtcDateTime.AddHours(-1);
        
        var weeklySchedule = new WeeklySchedule()
        {
            WeekNumber = i.ToString(),
            OpenDate = prevWeekLastGameDate ?? DateTime.UtcNow,
            CloseDate = weekCutOffDate,
        };

        var weeklyScheduleResult = await supabaseClient
            .From<WeeklySchedule>()
            .Insert(weeklySchedule, new QueryOptions { Returning = QueryOptions.ReturnType.Representation });
        
        foreach (var (_, value) in response.Content.Schedule)
        {
            if (!value.Games.Any()) continue;
            
            foreach (var game in value.Games)
            {
                if (!game.Competitions.Any()) continue;
                
                var (_, competitors) = game.Competitions.First();
                var homeTeam = competitors.First(c => c.HomeAway == "home");
                var awayTeam = competitors.First(c => c.HomeAway == "away");
                
                games.Add(new Game
                {
                    HomeTeamScore = homeTeam.Score,
                    HomeTeamId = int.Parse(homeTeam.Id),
                    AwayTeamScore = awayTeam.Score,
                    AwayTeamId = int.Parse(awayTeam.Id),
                    WeeklyScheduleId = weeklyScheduleResult.Model!.Id,
                    Name = game.Name,
                    ShortName = game.ShortName,
                    StartDate = DateTimeOffset.Parse(game.Date).UtcDateTime,
                });
            }

            await supabaseClient.From<Game>().Insert(games);
        }
        
        var lastSchedule = response.Content.Schedule.Last();
        var lastScheduledGameDate = lastSchedule.Value.Games.Last().Date;
        prevWeekLastGameDate = DateTimeOffset.Parse(lastScheduledGameDate).UtcDateTime.AddHours(12);
    }
    
    return Results.Ok();
});

app.MapGet("api/teams", [Authorize] async (Supabase.Client supabase) =>
{
    var response = await supabase.From<Team>().Get();
    var teams = response.Models.Select(m => new TeamResponse(m.Id, m.ExternalId, m.Name));
    
    return Results.Ok(teams);
});

app.Run();
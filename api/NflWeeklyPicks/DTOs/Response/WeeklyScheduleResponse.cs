namespace NflWeeklyPicks.DTOs.Response;

public record WeeklyScheduleResponse(string WeekNumber, DateTimeOffset OpenDate, DateTimeOffset CloseDate);
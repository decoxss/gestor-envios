using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

var cs = app.Configuration.GetConnectionString("Default");

app.MapGet("/api/prueba", async () =>
{
    using var conn = new SqlConnection(cs);
    await conn.OpenAsync();
    return Results.Ok("Conexión exitosa");
});

app.Run();
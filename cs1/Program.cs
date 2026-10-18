using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DB connect
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "DefaultConnection was not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseMySQL(connectionString));

// API
builder.Services.AddOpenApi();
builder.Services.AddScoped<NotesService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    await db.Database.EnsureCreatedAsync();
}

app.UseHttpsRedirection();
Endpoints.MapEndpoints(app);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.Run();
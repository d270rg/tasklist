
using FluentValidation;
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

builder.Services.AddScoped<IValidator<APITaskRecord>, APITaskRecordValidator>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    await db.Database.EnsureCreatedAsync();
}

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}


var routes = app.MapGroup("/").AddEndpointFilter<ValidationFilter>().ProducesValidationProblem();
Endpoints.MapEndpoints(routes);
app.Run();
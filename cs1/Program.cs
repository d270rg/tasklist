using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DB connect
var connectionString = builder.Configuration.GetConnectionString("DefaultConnectionString");

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

// API
builder.Services.AddOpenApi();
builder.Services.AddScoped<NotesService>();

var app = builder.Build();

app.UseHttpsRedirection();
Endpoints.MapEndpoints(app);
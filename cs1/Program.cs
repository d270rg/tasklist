using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DB connect
var connectionString = builder.Configuration.GetConnectionString("DefaultConnectionString");

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

// API
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseHttpsRedirection();

builder.Services.AddScoped<NotesService>();
builder.Services.AddScoped<Endpoints>();
app.Services.GetRequiredService<Endpoints>().MapEndpoints(app);
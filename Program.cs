using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AdocaoAnimais_v1.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configuração da ligação à base de dados (SQLite)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                       throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// Página de erros detalhada em desenvolvimento (EF Core)
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Configuração do ASP.NET Identity (autenticação)
builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<ApplicationDbContext>();

// MVC + configuração JSON (ex.: enums como string)
builder.Services
    .AddControllersWithViews()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// cors
builder.Services.AddCors();

//swagger yeah
builder.Services.AddSwaggerGen();

var app = builder.Build();

// cors 2
app.UseCors(c  => c
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials()
);

// swagger yeah 2
app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

// Serve o React (wwwroot)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

// Ordem correta: CORS -> Auth -> Authorization
app.UseCors("frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.MapRazorPages()
    .WithStaticAssets();

// React Router fallback
app.MapFallbackToFile("index.html");

app.Run();
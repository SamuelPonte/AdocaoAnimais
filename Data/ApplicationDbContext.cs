using AdocaoAnimais_v1.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AdocaoAnimais_v1.Models.Enums;

namespace AdocaoAnimais_v1.Data;


public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext(options)
{
    public DbSet<Animal> Animais { get; set; } = default!;
    public DbSet<Like> Likes { get; set; } = default!;


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Animal>()
            .Property(a => a.Sexo)
            .HasConversion<string>();

        modelBuilder.Entity<Animal>()
            .Property(a => a.Porte)
            .HasConversion<string>();

        modelBuilder.Entity<Animal>()
            .Property(a => a.Especie)
            .HasConversion<string>();
        
        modelBuilder.Entity<Like>()
            .HasIndex(l => new { l.AnimalId, l.UserId })
            .IsUnique();

    }
}
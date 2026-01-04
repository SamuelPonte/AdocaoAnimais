using AdocaoAnimais_v1.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AdocaoAnimais_v1.Models.Enums;

namespace AdocaoAnimais_v1.Data;

/// <summary>
/// Contexto da base de dados da aplicação.
/// 
/// Integra o ASP.NET Identity e disponibiliza as entidades principais
/// utilizadas no domínio (Animais e Likes).
/// </summary>
public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext(options)
{
    /// <summary>
    /// Conjunto de animais registados na aplicação.
    /// </summary>
    public DbSet<Animal> Animais { get; set; } = default!;
    
    /// <summary>
    /// Conjunto de likes registados na aplicação.
    /// </summary>
    public DbSet<Like> Likes { get; set; } = default!;

    /// <summary>
    /// Configuração do modelo (mapeamentos e restrições).
    /// </summary>
    /// <param name="modelBuilder">Construtor do modelo EF Core.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    
        // Guarda enums do Animal como string na base de dados
        modelBuilder.Entity<Animal>()
            .Property(a => a.Sexo)
            .HasConversion<string>();

        modelBuilder.Entity<Animal>()
            .Property(a => a.Porte)
            .HasConversion<string>();

        modelBuilder.Entity<Animal>()
            .Property(a => a.Especie)
            .HasConversion<string>();
        
        // Impede likes repetidos do mesmo utilizador no mesmo animal
        modelBuilder.Entity<Like>()
            .HasIndex(l => new { l.AnimalId, l.UserId })
            .IsUnique();

    }
}
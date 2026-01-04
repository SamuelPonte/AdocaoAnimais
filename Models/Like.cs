using System.ComponentModel.DataAnnotations;

namespace AdocaoAnimais_v1.Models;

/// <summary>
/// Representa um like de um utilizador a um animal.
/// </summary>
public class Like
{
    /// <summary>
    /// Identificador único do like.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Identificador do animal associado ao like.
    /// </summary>
    [Required]
    public int AnimalId { get; set; }
    
    /// <summary>
    /// Propriedade de navegação para o animal.
    /// </summary>
    public Animal? Animal { get; set; }

    /// <summary>
    /// Identificador do utilizador que efetuou o like.
    /// </summary>
    [Required]
    public string UserId { get; set; } = ""; // IdentityUser.Id (string)
}
using System.ComponentModel.DataAnnotations;

namespace AdocaoAnimais_v1.Models;

public class Like
{
    public int Id { get; set; }

    [Required]
    public int AnimalId { get; set; }
    public Animal? Animal { get; set; }

    [Required]
    public string UserId { get; set; } = ""; // IdentityUser.Id (string)
}
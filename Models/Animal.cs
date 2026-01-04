namespace AdocaoAnimais_v1.Models;
using System.ComponentModel.DataAnnotations;
using AdocaoAnimais_v1.Models.Enums;

/// <summary>
/// Representa um animal disponível para adoção.
/// </summary>
public class Animal
{
    // Obrigatorio ter ID
    /// <summary>
    /// Identificador único do animal.
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Nome do animal.
    /// </summary>
    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string Nome { get; set; }
    
    /// <summary>
    /// Espécie do animal (ex.: cão, gato).
    /// </summary>
    [Required(ErrorMessage = "A espécie é obrigatória.")]
    public Especie Especie { get; set; }   // cão, gato, etc
    
    /// <summary>
    /// Raça do animal.
    /// </summary>
    public string Raca { get; set; }
    
    /// <summary>
    /// Idade do animal.
    /// </summary>
    [Range(0, 150, ErrorMessage = "A idade deve ser um valor válido.")]
    public int Idade { get; set; }
    
    /// <summary>
    /// Sexo do animal.
    /// </summary>
    [Required(ErrorMessage = "O sexo é obrigatório.")]
    public Sexo Sexo { get; set; }      // M/F (ou o que definires)
    
    /// <summary>
    /// Porte do animal.
    /// </summary>
    [Required(ErrorMessage = "O porte é obrigatório.")]
    public Porte Porte { get; set; }     // pequeno/médio/grande
    
    /// <summary>
    /// Descrição do animal.
    /// </summary>
    public string Descricao { get; set; }
    
    /// <summary>
    /// Caminho ou URL da fotografia do animal.
    /// </summary>
    public string Foto { get; set; }      // URL ou caminho
    
    // vai ser o email da tabela AspNetUsers
    /// <summary>
    /// Email do dono (utilizador autenticado).
    /// </summary>
    public string? Dono  { get; set; }
}
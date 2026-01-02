namespace AdocaoAnimais_v1.Models;
using System.ComponentModel.DataAnnotations;
using AdocaoAnimais_v1.Models.Enums;

public class Animal
{
    // Obrigatorio ter ID
    public int Id { get; set; }
    
    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string Nome { get; set; }
    
    [Required(ErrorMessage = "A espécie é obrigatória.")]
    public Especie Especie { get; set; }   // cão, gato, etc
    
    public string Raca { get; set; }
    
    [Range(0, 150, ErrorMessage = "A idade deve ser um valor válido.")]
    public int Idade { get; set; }
    
    [Required(ErrorMessage = "O sexo é obrigatório.")]
    public Sexo Sexo { get; set; }      // M/F (ou o que definires)
    
    [Required(ErrorMessage = "O porte é obrigatório.")]
    public Porte Porte { get; set; }     // pequeno/médio/grande
    
    public string Descricao { get; set; }
    
    public string Foto { get; set; }      // URL ou caminho
    
    // vai ser o email da tabela AspNetUsers
    public string? Dono  { get; set; }
}
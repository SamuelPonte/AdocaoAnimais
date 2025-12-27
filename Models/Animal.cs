namespace AdocaoAnimais_v1.Models;

public class Animal
{
    // Obrigatorio ter ID
    public int Id { get; set; }
    
    public string Nome { get; set; }
    public string Especie { get; set; }   // cão, gato, etc
    public string Raca { get; set; }
    public int Idade { get; set; }
    public string Sexo { get; set; }      // M/F (ou o que definires)
    public string Porte { get; set; }     // pequeno/médio/grande
    public string Descricao { get; set; }
    public string Foto { get; set; }      // URL ou caminho
    
    // vai ser o email da tabela AspNetUsers
    public string Dono  { get; set; }
}
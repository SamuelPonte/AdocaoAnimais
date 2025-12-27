namespace AdocaoAnimais_v1.Models;

public class Skins
{
    // Obrigatorio ter ID
    public int Id { get; set; }
    
    public string Nome { get; set; }
    public string Raridade { get; set; }
    public double Preco { get; set; }
    public string Foto { get; set; }
    
    // vai ser o email da tabela AspNetUsers
    public string Dono  { get; set; }
}
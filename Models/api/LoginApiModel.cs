namespace AdocaoAnimais_v1.Models.api;

/// <summary>
/// Modelo utilizado no pedido de autenticação via API.
/// </summary>
public class LoginApiModel
{
    /// <summary>
    /// Nome de utilizador.
    /// </summary>
    public string Username { get; set; }
    
    /// <summary>
    /// Palavra-passe do utilizador.
    /// </summary>
    public string Password { get; set; }
}
namespace AdocaoAnimais_v1.Models;

/// <summary>
/// Modelo utilizado para apresentar informações de erro.
/// </summary>
public class ErrorViewModel
{
    /// <summary>
    /// Identificador do pedido que originou o erro.
    /// </summary>
    public string? RequestId { get; set; }

    /// <summary>
    /// Indica se o identificador do pedido deve ser apresentado.
    /// </summary>
    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AdocaoAnimais_v1.Models;

namespace AdocaoAnimais_v1.Controllers;

/// <summary>
/// Controller base para as páginas MVC (Razor) da aplicação.
/// </summary>
public class HomeController : Controller
{
    /// <summary>
    /// Apresenta a página inicial (Razor).
    /// </summary>
    /// <returns>View da página inicial.</returns>
    public IActionResult Index()
    {
        return View();
    }
    
    /// <summary>
    /// Apresenta a página de privacidade (Razor).
    /// </summary>
    /// <returns>View da página de privacidade.</returns>
    public IActionResult Privacy()
    {
        return View();
    }
    
    /// <summary>
    /// Apresenta a página de erro com informação do RequestId.
    /// </summary>
    /// <returns>View de erro com modelo ErrorViewModel.</returns>
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
using Microsoft.AspNetCore.Mvc;
using AdocaoAnimais_v1.Data;
using AdocaoAnimais_v1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AdocaoAnimais_v1.Controllers.api;

/// <summary>
/// API para gestão de likes (contagem e alternância).
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class LikesApiController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    
    /// <summary>
    /// Inicializa o controller com contexto e user manager.
    /// </summary>
    public LikesApiController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET api/LikesApi/summary
    // devolve: { [animalId]: { count: 3, likedByMe: true } }
    /// <summary>
    /// Devolve um resumo de likes por animal.
    /// Inclui likedByMe apenas quando existe utilizador autenticado.
    /// </summary>
    /// <returns>Dicionário indexado por animalId.</returns>
    [HttpGet("summary")]
    public async Task<ActionResult<Dictionary<int, object>>> Summary()
    {
        // Contagem pública por animal
        var counts = await _context.Likes
            .GroupBy(l => l.AnimalId)
            .Select(g => new { AnimalId = g.Key, Count = g.Count() })
            .ToListAsync();

        HashSet<int> mineSet = new();

        // Só calcula likedByMe se houver login
        if (User?.Identity?.IsAuthenticated == true)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                var mine = await _context.Likes
                    .Where(l => l.UserId == user.Id)
                    .Select(l => l.AnimalId)
                    .ToListAsync();

                mineSet = mine.ToHashSet();
            }
        }
        
        // Estrutura final esperada pelo frontend: { [animalId]: { count, likedByMe } }
        var dict = new Dictionary<int, object>();
        foreach (var c in counts)
            dict[c.AnimalId] = new { count = c.Count, likedByMe = mineSet.Contains(c.AnimalId) };
        
        // animais com 0 likes mas likedByMe true não existem, ok.
        return Ok(dict);
    }

    // POST api/LikesApi/toggle/5
    /// <summary>
    /// Alterna o like do utilizador autenticado num animal.
    /// Se existir like, remove; caso contrário, cria.
    /// </summary>
    /// <param name="animalId">Identificador do animal.</param>
    /// <returns>Estado final do like.</returns>
    [HttpPost("toggle/{animalId:int}")]
    [Authorize]
    public async Task<ActionResult> Toggle(int animalId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();
        
        // Valida se o animal existe
        var existsAnimal = await _context.Animais.AnyAsync(a => a.Id == animalId);
        if (!existsAnimal) return NotFound();
        
        // Verifica se já existe like do utilizador para este animal
        var like = await _context.Likes
            .FirstOrDefaultAsync(l => l.AnimalId == animalId && l.UserId == user.Id);

        if (like == null)
        {
            _context.Likes.Add(new Like { AnimalId = animalId, UserId = user.Id });
            await _context.SaveChangesAsync();
            return Ok(new { liked = true });
        }
        else
        {
            _context.Likes.Remove(like);
            await _context.SaveChangesAsync();
            return Ok(new { liked = false });
        }
    }
}
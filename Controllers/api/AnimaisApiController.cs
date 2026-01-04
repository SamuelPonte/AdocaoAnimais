using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdocaoAnimais_v1.Data;
using AdocaoAnimais_v1.Models;
using Microsoft.AspNetCore.Authorization;

namespace AdocaoAnimais_v1.Controllers.api
{
    /// <summary>
    /// API para operações CRUD sobre animais.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AnimaisApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        /// <summary>
        /// Inicializa o controller com o contexto da base de dados.
        /// </summary>
        /// <param name="context">Contexto EF Core.</param>
        public AnimaisApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AnimaisApi
        /// <summary>
        /// Obtém a lista de todos os animais.
        /// </summary>
        /// <returns>Lista de animais.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Animal>>> GetAnimais()
        {
            return await _context.Animais.ToListAsync();
        }

        // GET: api/AnimaisApi/5
        /// <summary>
        /// Obtém um animal pelo respetivo identificador.
        /// </summary>
        /// <param name="id">Identificador do animal.</param>
        /// <returns>Animal encontrado, ou 404.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Animal>> GetAnimal(int id)
        {
            var animal = await _context.Animais.FindAsync(id);

            if (animal == null)
            {
                return NotFound();
            }

            return animal;
        }

        // PUT: api/AnimaisApi/5
        /// <summary>
        /// Atualiza um animal existente.
        /// Apenas o dono do registo pode editar.
        /// </summary>
        /// <param name="id">Identificador do animal.</param>
        /// <param name="animal">Dados atualizados do animal.</param>
        /// <returns>204 em sucesso, ou erro apropriado.</returns>
        [HttpPut("{id}")]
        [Authorize] // bloqueia a rota caso não esteja autenticado
        public async Task<IActionResult> PutAnimal(int id, Animal animal)
        {
            if (id != animal.Id)
            {
                return BadRequest();
            }
            
            // Vai buscar o registo atual para validar dono e preservar o campo Dono
            var existente = await _context.Animais
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == id);

            if (existente == null)
                return NotFound();

            // Regra: só o dono pode editar
            if (existente.Dono != User.Identity!.Name)
                return Forbid(); // 403

            // Impede alteração do Dono via JSON
            animal.Dono = existente.Dono;

            _context.Entry(animal).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnimalExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/AnimaisApi
        /// <summary>
        /// Cria um novo animal e associa-o ao utilizador autenticado.
        /// </summary>
        /// <param name="animal">Dados do animal a criar.</param>
        /// <returns>Animal criado.</returns>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Animal>> PostAnimal(Animal animal)
        {
            // O dono é sempre o utilizador autenticado
            animal.Dono = User.Identity!.Name;
            _context.Animais.Add(animal);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnimal", new { id = animal.Id }, animal);
        }

        // DELETE: api/SkinsApi/5
        /// <summary>
        /// Elimina um animal.
        /// Apenas o dono do registo pode eliminar.
        /// </summary>
        /// <param name="id">Identificador do animal.</param>
        /// <returns>204 em sucesso, ou erro apropriado.</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animais.FindAsync(id);
            if (animal == null)
            {
                return NotFound();
            }
            
            // Regra: só o dono pode apagar
            if (animal.Dono != User.Identity.Name)
            {
                return BadRequest();
            }

            _context.Animais.Remove(animal);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        /// <summary>
        /// Verifica se existe um animal com o id indicado.
        /// </summary>
        private bool AnimalExists(int id)
        {
            return _context.Animais.Any(e => e.Id == id);
        }
    }
}

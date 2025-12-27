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
    [Route("api/[controller]")]
    [ApiController]
    public class AnimaisApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnimaisApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AnimaisApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Animal>>> GetAnimais()
        {
            return await _context.Animais.ToListAsync();
        }

        // GET: api/AnimaisApi/5
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        // linha abaixo bloqeuia a rota casa nao esteja autenticado
        [Authorize]
        public async Task<IActionResult> PutAnimal(int id, Animal animal)
        {
            if (id != animal.Id)
            {
                return BadRequest();
            }
            
            // 1) Ir buscar o registo atual à BD (para validar dono e preservar Dono)
            var existente = await _context.Animais
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == id);

            if (existente == null)
                return NotFound();

            // 2) Regra do enunciado: só o dono pode editar
            if (existente.Dono != User.Identity!.Name)
                return Forbid(); // 403

            // 3) Impedir que o cliente altere o Dono no JSON
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Animal>> PostAnimal(Animal animal)
        {
            animal.Dono = User.Identity.Name;
            _context.Animais.Add(animal);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnimal", new { id = animal.Id }, animal);
        }

        // DELETE: api/SkinsApi/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animais.FindAsync(id);
            if (animal == null)
            {
                return NotFound();
            }
            
            if (animal.Dono != User.Identity.Name)
            {
                return BadRequest();
            }

            _context.Animais.Remove(animal);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AnimalExists(int id)
        {
            return _context.Animais.Any(e => e.Id == id);
        }
    }
}
